import React from 'react';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { updateValidAuth } from '@/actions/auth';
import CourseList from '../CourseList'; // eslint-disable-line import/order

jest.mock('@/actions/curriculum');

import { fetchCourses } from '@/actions/curriculum'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The CourseListContainer', () => {
  const context = { cookies };
  let store;
  let authFailStore;
  let otherFailStore;
  let wrapper;
  beforeEach(() => {
    const defaultState = {
      curriculum: {
        isFetching: false,
        courses: {
          total_pages: 1,
          results: [],
        },
      },
      user: {
        user_id: 1,
      },
    };

    const mockStore = configureStore();
    store = mockStore(defaultState);
    store.dispatch = jest.fn().mockResolvedValue();

    const mockAuthFailStore = configureStore();
    const authError = new Error();
    authError.response = {
      status: 401,
    };
    authFailStore = mockAuthFailStore(defaultState);
    authFailStore.dispatch = jest.fn();
    authFailStore.dispatch.mockRejectedValueOnce(authError);
    authFailStore.dispatch.mockResolvedValue();

    const mockOtherFailStore = configureStore();
    const error = new Error();
    error.response = {
      status: 500,
    };
    otherFailStore = mockOtherFailStore(defaultState);
    otherFailStore.dispatch = jest.fn().mockRejectedValue(error);

    wrapper = shallow(<CourseList store={store} />, { context }).dive().dive().dive();
  });
  test('dispatches an action to fetch courses', () => {
    wrapper.dive().props().fetchCourses();

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchCourses({
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );
  });

  test('handles authentication error fetching courses', (done) => {
    const localWrapper = shallow(
      <CourseList store={authFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchCourses().then(() => {
      expect(authFailStore.dispatch.mock.calls.length).toBe(2);
      expect(authFailStore.dispatch).toHaveBeenCalledWith(
        fetchCourses({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      expect(authFailStore.dispatch).toHaveBeenCalledWith(updateValidAuth(false));
      done();
    });
  });

  test('handles other error fetching courses', (done) => {
    const localWrapper = shallow(
      <CourseList store={otherFailStore} />, { context },
    ).dive().dive().dive();

    localWrapper.dive().props().fetchCourses().catch(() => {
      expect(otherFailStore.dispatch.mock.calls.length).toBe(1);
      expect(otherFailStore.dispatch).toHaveBeenCalledWith(
        fetchCourses({
          headers: {
            Authorization: `JWT ${cookiesValues.auth_jwt}`,
          },
        }),
      );
      done();
    });
  });
});

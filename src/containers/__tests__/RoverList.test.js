import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import RoverList from '../RoverList';
import { fetchRovers } from '../../actions/rover';

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The RoverListContainer', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;
  beforeEach(() => {
    store = mockStore({
      rover: {
        isFetching: false,
        rovers: [],
      },
    });
    store.dispatch = jest.fn();
    const context = { cookies };
    wrapper = shallow(<RoverList store={store} />, { context });
  });
  test('dispatches an action to fetch rovers', () => {
    const rovers = [{
      id: 1,
      name: 'Mars',
    }];
    const mockAxios = new MockAdapter(axios);

    mockAxios.onGet('/api/v1/rovers/').reply(200, rovers);
    wrapper.dive().props().fetchRovers();

    expect(store.dispatch).toHaveBeenCalledWith(
      fetchRovers({
        headers: {
          Authorization: `JWT ${cookiesValues.auth_jwt}`,
        },
      }),
    );

    mockAxios.restore();
  });
});

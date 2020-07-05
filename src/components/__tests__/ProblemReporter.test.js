import React from 'react';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { Button, Dialog, TextField } from '@material-ui/core';

import ProblemReporter from '../ProblemReporter'; // eslint-disable-line import/order

jest.mock('@/actions/code');

import { reportProgram } from '@/actions/code'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);
const context = { cookies };

describe('The ProblemReporter component', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;

  beforeEach(() => {
    store = mockStore({
      code: {
        id: 1,
      },
    });

    store.dispatch = jest.fn().mockResolvedValue();

    wrapper = shallowWithIntl(
      <ProblemReporter store={store}>
        Problem?
      </ProblemReporter>, { context },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();
  });

  test('renders on the page with no errors', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('opens modal', () => {
    expect(wrapper.state('open')).toBe(false);

    wrapper.find(Button).first().simulate('click');

    expect(wrapper.state('open')).toBe(true);

    wrapper.find(Dialog).simulate('close');

    expect(wrapper.state('open')).toBe(false);
  });

  test('submits report', () => {
    wrapper.find(TextField).at(0).simulate('change', {
      target: {
        value: 'field1',
      },
    });
    wrapper.find(TextField).at(1).simulate('change', {
      target: {
        value: 'field2',
      },
    });
    wrapper.find(TextField).at(2).simulate('change', {
      target: {
        value: 'field3',
      },
    });
    wrapper.find(Button).last().simulate('click');

    expect(reportProgram).toHaveBeenCalledWith(1, `
      What were you working on doing?
      field1
      --------------
      What did you expect to happen?
      field2
      --------------
      What happened instead?
      field3
    `, { headers: { Authorization: 'JWT undefined' } });
  });
});

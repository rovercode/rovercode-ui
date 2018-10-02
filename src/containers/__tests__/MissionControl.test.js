import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import MissionControl from '../MissionControl';

jest.mock('@/components/CodeViewer', () => () => <div />);
jest.mock('@/components/Console', () => () => <div />);
jest.mock('@/components/Control', () => () => <div />);
jest.mock('@/components/Indicator', () => () => <div />);
jest.mock('@/components/Workspace', () => () => <div />);

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The MissionControl container', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;
  beforeEach(() => {
    store = mockStore({
      code: {
        jsCode: 'testcode',
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const context = { cookies };
    wrapper = mount(<MissionControl store={store} />, {
      context,
      childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
    });

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

import React from 'react';
import { MemoryRouter } from 'react-router';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Cookies } from 'react-cookie';
import PropTypes from 'prop-types';
import rootReducer from '@/reducers/index';
import MissionControl from '../MissionControl';

jest.mock('@/components/CodeViewer', () => () => <div />);
jest.mock('@/components/Console', () => () => <div />);
jest.mock('@/components/Control', () => () => <div />);
jest.mock('@/components/Indicator', () => () => <div />);
jest.mock('@/components/ProgramName', () => () => <div />);
jest.mock('@/components/Workspace', () => () => <div />);

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The MissionControl container', () => {
  let store;
  let wrapper;
  beforeEach(() => {
    store = createStore(rootReducer, {
      code: {
        jsCode: 'testcode',
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const context = { cookies };
    wrapper = mount(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} />
        </MemoryRouter>
      </ReduxProvider>, {
        context,
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );
    const mcWrapper = wrapper.find(MissionControl);

    expect(toJson(mcWrapper)).toMatchSnapshot();
  });
});

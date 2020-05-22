import React from 'react';
import { MemoryRouter } from 'react-router';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import { Button, Drawer } from '@material-ui/core';
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
        tags: [],
      },
      rover: {
        isFetching: false,
        rovers: {
          next: null,
          previous: null,
          results: [],
        },
        commands: [],
      },
    });
    store.dispatch = jest.fn(() => Promise.resolve({}));
  });

  test('renders on the page with no errors', () => {
    const context = { cookies };
    wrapper = mountWithIntl(
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

    expect(mcWrapper).toMatchSnapshot();
  });

  test('shows and dismisses drawer on edit', () => {
    const context = { cookies };
    wrapper = shallowWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <MissionControl store={store} />
        </MemoryRouter>
      </ReduxProvider>, {
        context,
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    ).dive().dive().dive()
      .dive()
      .dive()
      .dive()
      .dive();

    expect(wrapper.find(Drawer).prop('open')).toBe(false);

    wrapper.find(Button).simulate('click');
    wrapper.update();

    expect(wrapper.find(Drawer).prop('open')).toBe(true);

    wrapper.find(Drawer).simulate('close');
    wrapper.update();

    expect(wrapper.find(Drawer).prop('open')).toBe(false);
  });
});

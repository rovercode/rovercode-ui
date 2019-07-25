import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { mountWithIntl } from 'enzyme-react-intl';
import moment from 'moment';
import MockDate from 'mockdate';
import { Cookies } from 'react-cookie';

import { logout } from '@/actions/auth';
import ProtectedRoute from '../ProtectedRoute';

const cookiesValues = { };
const cookies = new Cookies(cookiesValues);

describe('The ProtectedRoute component', () => {
  const mockStore = configureStore();
  const TestComponent = () => <div />;
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        exp: 1540341529,
      },
      auth: {
        isValidAuth: true,
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders component when authenticated', () => {
    MockDate.set(moment.unix(1540341528));

    const wrapper = mountWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Switch>
            <Route exact path="/accounts/login" />
            <ProtectedRoute exact path="/" component={TestComponent} />
          </Switch>
        </MemoryRouter>
      </ReduxProvider>, {
        context: { cookies },
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );

    expect(wrapper.find(TestComponent).exists()).toBe(true);
    expect(wrapper.find(Route).exists()).toBe(true);
    expect(wrapper.find(Route).prop('path')).toBe('/');

    MockDate.reset();
  });

  test('renders redirect when not authenticated', () => {
    MockDate.set(moment.unix(1540341530));

    const wrapper = mountWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Switch>
            <Route exact path="/accounts/login" />
            <ProtectedRoute exact path="/" component={TestComponent} store={store} />
          </Switch>
        </MemoryRouter>
      </ReduxProvider>, {
        context: { cookies },
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );

    expect(wrapper.find(TestComponent).exists()).toBe(false);
    expect(wrapper.find(Route).exists()).toBe(true);
    expect(wrapper.find(Route).prop('path')).toBe('/accounts/login');
    expect(store.dispatch).toHaveBeenCalledWith(logout());

    MockDate.reset();
  });

  test('renders redirect when not able to determine authentication status', () => {
    store = mockStore({
      user: {},
      auth: {
        isValidAuth: true,
      },
    });
    const wrapper = mountWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Switch>
            <Route exact path="/accounts/login" />
            <ProtectedRoute exact path="/" component={TestComponent} store={store} />
          </Switch>
        </MemoryRouter>
      </ReduxProvider>, {
        context: { cookies },
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );

    expect(wrapper.find(TestComponent).exists()).toBe(false);
    expect(wrapper.find(Route).exists()).toBe(true);
    expect(wrapper.find(Route).prop('path')).toBe('/accounts/login');
  });

  test('renders redirect when invalid auth', () => {
    store = mockStore({
      user: {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
        exp: 1540341529,
      },
      auth: {
        isValidAuth: false,
      },
    });
    store.dispatch = jest.fn();
    const wrapper = mountWithIntl(
      <ReduxProvider store={store}>
        <MemoryRouter initialEntries={['/']} initialIndex={0}>
          <Switch>
            <Route exact path="/accounts/login" />
            <ProtectedRoute exact path="/" component={TestComponent} store={store} />
          </Switch>
        </MemoryRouter>
      </ReduxProvider>, {
        context: { cookies },
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );

    expect(wrapper.find(TestComponent).exists()).toBe(false);
    expect(wrapper.find(Route).exists()).toBe(true);
    expect(wrapper.find(Route).prop('path')).toBe('/accounts/login');
    expect(store.dispatch).toHaveBeenCalledWith(logout());
  });
});

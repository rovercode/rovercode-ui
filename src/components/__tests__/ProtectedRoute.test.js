import React from 'react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import configureStore from 'redux-mock-store';
import { mount } from 'enzyme';
import moment from 'moment';
import MockDate from 'mockdate';
import { Cookies } from 'react-cookie';

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
  });

  test('renders component when authenticated', () => {
    MockDate.set(moment.unix(1540341528));

    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Switch>
          <Route exact path="/accounts/login" />
          <ProtectedRoute exact path="/" component={TestComponent} store={store} />
        </Switch>
      </MemoryRouter>, {
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

    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Switch>
          <Route exact path="/accounts/login" />
          <ProtectedRoute exact path="/" component={TestComponent} store={store} />
        </Switch>
      </MemoryRouter>, {
        context: { cookies },
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );

    expect(wrapper.find(TestComponent).exists()).toBe(false);
    expect(wrapper.find(Route).exists()).toBe(true);
    expect(wrapper.find(Route).prop('path')).toBe('/accounts/login');

    MockDate.reset();
  });

  test('renders redirect when not able to determine authentication status', () => {
    store = mockStore({
      user: {},
      auth: {
        isValidAuth: true,
      },
    });
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Switch>
          <Route exact path="/accounts/login" />
          <ProtectedRoute exact path="/" component={TestComponent} store={store} />
        </Switch>
      </MemoryRouter>, {
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
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Switch>
          <Route exact path="/accounts/login" />
          <ProtectedRoute exact path="/" component={TestComponent} store={store} />
        </Switch>
      </MemoryRouter>, {
        context: { cookies },
        childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
      },
    );

    expect(wrapper.find(TestComponent).exists()).toBe(false);
    expect(wrapper.find(Route).exists()).toBe(true);
    expect(wrapper.find(Route).prop('path')).toBe('/accounts/login');
  });
});

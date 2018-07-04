import React from 'react';
import { mount } from 'enzyme';
import {
  MemoryRouter, Route, Switch,
} from 'react-router';
import { Loader } from 'semantic-ui-react';
import { CookiesProvider } from 'react-cookie';
import toJson from 'enzyme-to-json';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import LoginCallback from '../LoginCallback';

const mock = new MockAdapter(axios);

const initialEntry = {
  pathname: '/login/google/callback',
  search: '?state=1234&code=5678',
  key: '123456',
};

test('LoginCallback renders on the page with no errors', () => {
  const wrapper = mount(
    <CookiesProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Switch>
          <Route path="/login/:service/callback" component={LoginCallback} />
        </Switch>
      </MemoryRouter>
    </CookiesProvider>,
  );

  expect(toJson(wrapper)).toMatchSnapshot();
});

test('LoginCallback displays loader while loading', () => {
  mock.reset();
  mock.onPost('/api/auth/social/google/login/').timeout();
  const wrapper = mount(
    <CookiesProvider>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Switch>
          <Route path="/login/:service/callback" component={LoginCallback} />
        </Switch>
      </MemoryRouter>
    </CookiesProvider>,
  );

  wrapper.setState({
    loading: true,
  });
  wrapper.update();

  expect(wrapper.find(Loader).exists()).toBe(true);
});

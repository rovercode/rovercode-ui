import React from 'react';
import { Message } from 'semantic-ui-react';
import { shallow } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Login from '../Login';

const mock = new MockAdapter(axios);

test('Login renders on the page with no errors', () => {
  const location = {
    pathname: '/login',
  };
  const wrapper = shallow(<Login location={location} />);

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Message).exists()).toBe(false);
});

test('Login redirects to social api on button click', async () => {
  const url = 'https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fsocial%2Fgoogle%2Fcallback';
  mock.reset();
  mock.onPost('/jwt/auth/social/google/auth-server/').reply(200, { url });
  window.location.assign = jest.fn();

  const location = {
    pathname: '/login',
  };
  const element = {
    target: {
      id: 'google',
    },
  };

  const wrapper = shallow(<Login location={location} />);

  await wrapper.instance().redirectToSocial(element);

  expect(window.location.assign).toBeCalledWith(
    'https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Flogin%2Fgoogle%2Fcallback%2F',
  );
});

test('Login shows error message on api error', async () => {
  mock.reset();
  mock.onPost('/jwt/auth/social/google/auth-server/').timeout();
  window.location.assign = jest.fn();

  const location = {
    pathname: '/login',
  };
  const element = {
    target: {
      id: 'google',
    },
  };

  const wrapper = shallow(<Login location={location} />);

  await wrapper.instance().redirectToSocial(element);
  wrapper.update();

  expect(wrapper.find(Message).exists()).toBe(true);
  expect(window.location.assign).not.toBeCalled();
});

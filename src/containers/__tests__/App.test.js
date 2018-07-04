import React from 'react';
import { Header, Loader } from 'semantic-ui-react';
import { shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import App from '../App';

const mock = new MockAdapter(axios);
const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

test('App renders on the page with no errors', () => {
  const wrapper = shallow(<App />, {
    context: { cookies },
  });

  expect(wrapper).toMatchSnapshot();
});

test('App shows the correct number of rovers for the user', async () => {
  mock.reset();
  mock.onGet('/api/v1/rovers/').reply(200, [
    {
      id: 1,
      name: 'Sparky',
      owner: 1,
    },
    {
      id: 2,
      name: 'Marvin',
      owner: 1,
    },
  ]);

  const cookieWrapper = shallow(<App />, {
    context: { cookies },
  });

  const wrapper = cookieWrapper.dive();

  await wrapper.instance().componentDidMount();
  wrapper.update();

  expect(wrapper.find(Header).exists()).toBe(true);
  expect(wrapper.find(Loader).exists()).toBe(false);
});

test('App shows no rovers on error', async () => {
  mock.reset();
  mock.onGet('/api/v1/rovers/').timeout();

  const cookieWrapper = shallow(<App />, {
    context: { cookies },
  });

  const wrapper = cookieWrapper.dive();

  await wrapper.instance().componentDidMount();
  wrapper.update();

  expect(wrapper.find(Header).exists()).toBe(true);
  expect(wrapper.find(Loader).exists()).toBe(false);
});

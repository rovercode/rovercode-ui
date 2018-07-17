import React from 'react';
import { Route } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import { shallow } from 'enzyme';

import Base from '../Base';

test('Base renders on the page with no errors', () => {
  const match = {
    path: '/accounts',
  };

  const wrapper = shallow(<Base match={match} />);

  expect(wrapper).toMatchSnapshot();
  expect(wrapper.find(Image).exists()).toBe(true);
  expect(wrapper.find(Route).length).toBe(2);
  expect(wrapper.find(Route).at(0).prop('path')).toBe('/accounts/login');
  expect(wrapper.find(Route).at(1).prop('path')).toBe('/accounts/signup');
});

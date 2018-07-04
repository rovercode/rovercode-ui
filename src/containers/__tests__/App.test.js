import React from 'react';
import { shallow } from 'enzyme';

import App from '../App';

test('App renders on the page with no errors', () => {
  const wrapper = shallow(<App />);

  expect(wrapper).toMatchSnapshot();
});

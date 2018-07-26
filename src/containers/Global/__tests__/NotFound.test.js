import React from 'react';
import { shallow } from 'enzyme';

import NotFound from '../NotFound';

test('NotFound renders on the page with no errors', () => {
  const wrapper = shallow(<NotFound />);

  expect(wrapper).toMatchSnapshot();
});

import React from 'react';
import { shallow } from 'enzyme';

import Footer from '../Footer';

describe('The Footer component', () => {
  test('renders on the page with no errors', () => {
    const wrapper = shallow(<Footer />);
    expect(wrapper).toMatchSnapshot();
  });
});

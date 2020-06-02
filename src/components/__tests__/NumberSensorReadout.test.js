import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import NumericSensorReadout from '../NumericSensorReadout';

describe('The NumericSensorReadout component', () => {
  test('renders on the page with no errors', () => {
    const wrapper = mount(<NumericSensorReadout />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

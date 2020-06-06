import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';

import NumericSensorReadout from '../NumericSensorReadout';

describe('The NumericSensorReadout component', () => {
  test('renders values on the page with no erros when values present', () => {
    const readings = [
      {
        label: 'A',
        reading: 42,
        maxReading: 1023,
      },
    ];

    const wrapper = mount(
      <NumericSensorReadout
        title="Flux Sensors"
        readings={readings}
        unit="Weber"
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('p').last().text()).toEqual('A: 42 / 1023 Weber');
  });

  test('renders on the page with no errors when no values', () => {
    const readings = [
      {
        label: 'A',
        reading: null,
        maxReading: 1023,
      },
    ];

    const wrapper = mount(
      <NumericSensorReadout
        title="Flux Sensors"
        readings={readings}
        unit="Weber"
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('p').last().text()).toEqual('Not connected');
  });
});

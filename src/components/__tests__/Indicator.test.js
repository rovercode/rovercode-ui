import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';

import { COVERED, NOT_COVERED } from '@/actions/sensor';
import Indicator from '../Indicator';

describe('The Indicator component', () => {
  const mockStore = configureStore();
  let store;

  test('renders on the page with no errors', () => {
    store = mockStore({
      sensor: {
        left: COVERED,
        right: NOT_COVERED,
      },
    });
    const wrapper = mount(<Indicator store={store} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('displays left covered', () => {
    store = mockStore({
      sensor: {
        left: COVERED,
        right: NOT_COVERED,
      },
    });
    const wrapper = shallow(<Indicator store={store} />).dive().dive();

    expect(wrapper.find('#covered-0').exists()).toBe(true);
    expect(wrapper.find('#not-covered-1').exists()).toBe(true);
  });

  test('displays right covered', () => {
    store = mockStore({
      sensor: {
        left: NOT_COVERED,
        right: COVERED,
      },
    });
    const wrapper = shallow(<Indicator store={store} />).dive().dive();

    expect(wrapper.find('#not-covered-0').exists()).toBe(true);
    expect(wrapper.find('#covered-1').exists()).toBe(true);
  });

  test('displays both covered', () => {
    store = mockStore({
      sensor: {
        left: COVERED,
        right: COVERED,
      },
    });
    const wrapper = shallow(<Indicator store={store} />).dive().dive();

    expect(wrapper.find('#covered-0').exists()).toBe(true);
    expect(wrapper.find('#covered-1').exists()).toBe(true);
  });

  test('displays neither covered', () => {
    store = mockStore({
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
      },
    });
    const wrapper = shallow(<Indicator store={store} />).dive().dive();

    expect(wrapper.find('#not-covered-0').exists()).toBe(true);
    expect(wrapper.find('#not-covered-1').exists()).toBe(true);
  });
});

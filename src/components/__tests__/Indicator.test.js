import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';

import { COVERED, NOT_COVERED } from '@/actions/sensor';
import Indicator from '../Indicator';

describe('The Indicator component', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders on the page with no errors', () => {
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
    const wrapper = shallow(<Indicator store={store} />).dive();

    expect(wrapper.find('#leftIndicator').hasClass('covered')).toBe(true);
    expect(wrapper.find('#leftIndicator').hasClass('not-covered')).toBe(false);
    expect(wrapper.find('#rightIndicator').hasClass('covered')).toBe(false);
    expect(wrapper.find('#rightIndicator').hasClass('not-covered')).toBe(true);
  });

  test('displays right covered', () => {
    store = mockStore({
      sensor: {
        left: NOT_COVERED,
        right: COVERED,
      },
    });
    const wrapper = shallow(<Indicator store={store} />).dive();

    expect(wrapper.find('#leftIndicator').hasClass('covered')).toBe(false);
    expect(wrapper.find('#leftIndicator').hasClass('not-covered')).toBe(true);
    expect(wrapper.find('#rightIndicator').hasClass('covered')).toBe(true);
    expect(wrapper.find('#rightIndicator').hasClass('not-covered')).toBe(false);
  });

  test('displays both covered', () => {
    store = mockStore({
      sensor: {
        left: COVERED,
        right: COVERED,
      },
    });
    const wrapper = shallow(<Indicator store={store} />).dive();

    expect(wrapper.find('#leftIndicator').hasClass('covered')).toBe(true);
    expect(wrapper.find('#leftIndicator').hasClass('not-covered')).toBe(false);
    expect(wrapper.find('#rightIndicator').hasClass('covered')).toBe(true);
    expect(wrapper.find('#rightIndicator').hasClass('not-covered')).toBe(false);
  });

  test('displays neither covered', () => {
    store = mockStore({
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
      },
    });
    const wrapper = shallow(<Indicator store={store} />).dive();

    expect(wrapper.find('#leftIndicator').hasClass('covered')).toBe(false);
    expect(wrapper.find('#leftIndicator').hasClass('not-covered')).toBe(true);
    expect(wrapper.find('#rightIndicator').hasClass('covered')).toBe(false);
    expect(wrapper.find('#rightIndicator').hasClass('not-covered')).toBe(true);
  });
});

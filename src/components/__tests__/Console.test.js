import React from 'react';
import { Button } from '@material-ui/core';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';

import { clear } from '@/actions/console';
import Console from '../Console';

describe('The Console component', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({
      console: {
        messages: ['first', 'second'],
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl(<Console store={store} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('displays messages', () => {
    const wrapper = shallow(<Console store={store} />).dive().dive();

    expect(wrapper.find('p').length).toBe(2);
    expect(wrapper.find('p').at(0).text()).toBe('>> first');
    expect(wrapper.find('p').at(1).text()).toBe('>> second');
  });

  test('clears messages', () => {
    const wrapper = mountWithIntl(<Console store={store} />);

    wrapper.find(Button).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(clear());
  });

  test('scrolls to the bottom', () => {
    const mockScroll = jest.fn();
    const wrapper = shallow(<Console store={store} />).dive().dive();
    wrapper.instance().bottomRef = {
      current: {
        scrollIntoView: mockScroll,
      },
    };
    wrapper.instance().componentDidUpdate();

    expect(mockScroll).toHaveBeenCalled();
  });
});

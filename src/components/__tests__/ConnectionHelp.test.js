import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ConnectionHelp from '../ConnectionHelp';

describe('The ConnectionHelp component', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        // showConnectionHelpOnLogin: false, // TODO
      },
      rover: {
        rover: null,
      },
    });
  });

  test('renders on the page with no errors', () => {
    const wrapper = mount((
      <Provider store={store}>
        <ConnectionHelp />
      </Provider>
    ));
    wrapper.find('ConnectionHelp').instance().setState({ open: true });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  test('handles opening and closing dialog', () => {
    const wrapper = shallow(
      <ConnectionHelp store={store} />,
    ).find('ConnectionHelp').dive();

    expect(wrapper.state('open')).toBe(true); // Starts open

    wrapper.find('WithStyles(ForwardRef(Dialog))').simulate('close');

    expect(wrapper.state('open')).toBe(false);

    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');

    expect(wrapper.state('open')).toBe(true);
  });

  test('handles redirect button', () => {
    store = mockStore({
      rover: {
        rover: {
          name: 'Jim',
        },
      },
    });
    const wrapper = shallow(
      <ConnectionHelp store={store} />,
    ).find('ConnectionHelp').dive();
    expect(wrapper.find(Redirect).exists()).toBe(false);
    wrapper.find('WithStyles(ForwardRef(Button))').at(2).simulate('click');
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toEqual({
      pathname: '/programs',
    });
    expect(wrapper.state('open')).toBe(false);
  });
});

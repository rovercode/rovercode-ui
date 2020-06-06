import React from 'react';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ConnectionHelp from '../ConnectionHelp'; // eslint-disable-line import/order

jest.mock('@/actions/user');

import { editUserShowGuide } from '@/actions/user'; // eslint-disable-line import/first, import/order

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The ConnectionHelp component', () => {
  const mockStore = configureStore();
  const context = { cookies };
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        user_id: 1,
        showGuide: true,
      },
      rover: {
        rover: null,
      },
    });
    store.dispatch = jest.fn().mockResolvedValue();
  });

  test('renders on the page with no errors', () => {
    const wrapper = mountWithIntl((
      <Provider store={store}>
        <ConnectionHelp />
      </Provider>
    ));
    wrapper.find('ConnectionHelp').instance().setState({ open: true });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  test('handles opening and closing dialog', () => {
    const wrapper = shallowWithIntl(
      <ConnectionHelp store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive();

    expect(wrapper.state('open')).toBe(true); // Starts open
    expect(wrapper.find('WithStyles(ForwardRef(FormControlLabel))').prop('control').props.checked).toBe(true);

    wrapper.find('WithStyles(ForwardRef(Dialog))').simulate('close');

    expect(wrapper.state('open')).toBe(false);

    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');

    expect(wrapper.state('open')).toBe(true);
  });

  test('handles redirect button', () => {
    store = mockStore({
      user: {
        user_id: 1,
        showGuide: false,
      },
      rover: {
        rover: {
          name: 'Jim',
        },
      },
    });
    const wrapper = shallowWithIntl(
      <ConnectionHelp store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive();
    expect(wrapper.find(Redirect).exists()).toBe(false);
    expect(wrapper.find('WithStyles(ForwardRef(FormControlLabel))').prop('control').props.checked).toBe(false);
    wrapper.find('WithStyles(ForwardRef(Button))').at(2).simulate('click');
    expect(wrapper.find(Redirect).exists()).toBe(true);
    expect(wrapper.find(Redirect).at(0).prop('to')).toEqual({
      pathname: '/courses',
    });
    expect(wrapper.state('open')).toBe(false);
  });

  test('handles changing show guide', () => {
    const wrapper = shallowWithIntl(
      <ConnectionHelp store={store} />, { context },
    ).dive().dive().dive()
      .dive()
      .dive();

    wrapper.instance().handleShowChange({
      target: {
        checked: true,
      },
    });

    expect(store.dispatch).toHaveBeenCalledWith(editUserShowGuide(1, true));
  });
});

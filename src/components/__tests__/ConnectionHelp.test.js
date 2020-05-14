import React from 'react';
import { mount, shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import ConnectionHelp from '../ConnectionHelp';

describe('The ConnectionHelp component', () => {
  const mockStore = configureStore();
  const store = mockStore({
    user: {
      // showConnectionHelpOnLogin: false, // TODO
    },
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

    expect(wrapper.state('open')).toBe(false);

    wrapper.find('WithStyles(ForwardRef(IconButton))').simulate('click');

    expect(wrapper.state('open')).toBe(true);

    wrapper.find('WithStyles(ForwardRef(Dialog))').simulate('close');

    expect(wrapper.state('open')).toBe(false);
  });
});

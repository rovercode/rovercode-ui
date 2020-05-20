import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { Button, Dialog } from '@material-ui/core';

import CodeViewer from '../CodeViewer';

describe('The CodeViewer component', () => {
  const mockStore = configureStore();

  test('renders on the page with no errors', () => {
    const store = mockStore({
      code: {
        jsCode: 'test code',
      },
    });
    const wrapper = shallow(
      <CodeViewer store={store}>
        Show Me The Code!
      </CodeViewer>,
    ).dive().dive();
    expect(wrapper).toMatchSnapshot();
  });

  test('handles blank code with no errors', () => {
    const store = mockStore({
      code: {
        jsCode: null,
      },
    });
    const wrapper = shallow(
      <CodeViewer store={store}>
        Show Me The Code!
      </CodeViewer>,
    ).dive().dive();

    expect(wrapper.state('open')).toBe(false);

    wrapper.find(Button).simulate('click');

    expect(wrapper.state('open')).toBe(true);

    wrapper.find(Dialog).simulate('close');

    expect(wrapper.state('open')).toBe(false);
  });
});

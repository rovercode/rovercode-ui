import React from 'react';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';

import CodeViewer from '../CodeViewer';

describe('The CodeViewer component', () => {
  const mockStore = configureStore();

  test('renders on the page with no errors', () => {
    const store = mockStore({
      code: {
        jsCode: 'test code',
      },
    });
    const wrapper = mount(
      <CodeViewer store={store}>
        Show Me The Code!
      </CodeViewer>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('handles blank code with no errors', () => {
    const store = mockStore({
      code: {
        jsCode: null,
      },
    });
    const wrapper = mount(
      <CodeViewer store={store}>
        Show Me The Code!
      </CodeViewer>,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});

import React from 'react';
import { Button } from 'semantic-ui-react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import configureStore from 'redux-mock-store';

import {
  changeExecutionState,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';
import Control from '../Control';

describe('The Control component', () => {
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore({
      code: {
        execution: EXECUTION_STOP,
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = mount(<Control store={store} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  test('dispatches an action to change execution state', () => {
    const wrapper = shallow(<Control store={store} />);

    wrapper.props().changeExecutionState(EXECUTION_RUN);

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_RUN));
  });

  test('changes to step state on button press', () => {
    const wrapper = shallow(<Control store={store} />);

    wrapper.dive().find(Button).at(0).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_STEP));
  });

  test('changes to run state on button press', () => {
    const wrapper = shallow(<Control store={store} />);

    wrapper.dive().find(Button).at(1).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_RUN));
  });

  test('changes to reset state on button press', () => {
    const wrapper = shallow(<Control store={store} />);

    wrapper.dive().find(Button).at(2).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_RESET));
  });

  test('changes to stop state on button press', () => {
    const runStore = mockStore({
      code: {
        execution: EXECUTION_RUN,
      },
    });
    runStore.dispatch = jest.fn();
    const wrapper = shallow(<Control store={runStore} />).dive();

    wrapper.find(Button).at(0).simulate('click');

    expect(runStore.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_STOP));
  });
});

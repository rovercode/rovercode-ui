import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import MissionControl from '../MissionControl';
import {
  changeExecutionState,
  EXECUTION_RUN,
  EXECUTION_STEP,
  EXECUTION_STOP,
  EXECUTION_RESET,
} from '@/actions/code';

jest.mock('@/components/Workspace', () => () => <div />);

const cookiesValues = { auth_jwt: '1234' };
const cookies = new Cookies(cookiesValues);

describe('The MissionControl container', () => {
  const mockStore = configureStore();
  let store;
  let wrapper;
  beforeEach(() => {
    store = mockStore({
      code: {
        jsCode: 'testcode',
      },
    });
    store.dispatch = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const context = { cookies };
    wrapper = mount(<MissionControl store={store} />, {
      context,
      childContextTypes: { cookies: PropTypes.instanceOf(Cookies) },
    });

    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find('pre').length).toBe(1);
    expect(wrapper.find('pre').first().text()).toBe('testcode');
  });

  test('dispatches an action to change execution state', () => {
    const context = { cookies };
    wrapper = shallow(<MissionControl store={store} />, { context });

    wrapper.props().changeExecutionState(EXECUTION_RUN);

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_RUN));
  });

  test('changes to step state on button press', () => {
    const context = { cookies };
    wrapper = shallow(<MissionControl store={store} />, { context });

    wrapper.dive().find(Button).at(0).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_STEP));
  });

  test('changes to run state on button press', () => {
    const context = { cookies };
    wrapper = shallow(<MissionControl store={store} />, { context });

    wrapper.dive().find(Button).at(1).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_RUN));
  });

  test('changes to stop state on button press', () => {
    const context = { cookies };
    wrapper = shallow(<MissionControl store={store} />, { context });

    wrapper.dive().find(Button).at(2).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_STOP));
  });

  test('changes to reset state on button press', () => {
    const context = { cookies };
    wrapper = shallow(<MissionControl store={store} />, { context });

    wrapper.dive().find(Button).at(3).simulate('click');

    expect(store.dispatch).toHaveBeenCalledWith(changeExecutionState(EXECUTION_RESET));
  });
});

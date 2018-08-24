import React from 'react';
import { Header } from 'semantic-ui-react';
import { mount, shallow } from 'enzyme';
import { Cookies } from 'react-cookie';
import configureStore from 'redux-mock-store';
import PropTypes from 'prop-types';
import MissionControl from '../MissionControl';
import { updateJsCode } from '@/actions/code';

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

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Header).length).toBe(1);
    expect(wrapper.find('pre').length).toBe(1);
    expect(wrapper.find('pre').first().text()).toBe('testcode');
  });

  test('dispatches an action to update JS code', () => {
    const context = { cookies };
    wrapper = shallow(<MissionControl store={store} />, { context });

    wrapper.props().updateJsCode('testcode');

    expect(store.dispatch).toHaveBeenCalledWith(updateJsCode('testcode'));
  });
});

import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { mount, shallow } from 'enzyme';
import Websocket from 'react-websocket';
import RoverConnection from '../RoverConnection';
import { COVERED, NOT_COVERED } from '@/actions/sensor';

let changeActiveRover;
let changeLeftSensorState;
let changeRightSensorState;
let mockWsSend;
let popCommand;

global.WebSocket = jest.fn().mockImplementation(() => ({
  send: mockWsSend,
}));

describe('The RoverList component', () => {
  beforeEach(() => {
    changeActiveRover = jest.fn();
    changeLeftSensorState = jest.fn();
    changeRightSensorState = jest.fn();
    mockWsSend = jest.fn();
    popCommand = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('displays active rover', () => {
    delete global.window.location;
    global.window.location = {
      protocol: 'http:',
      hostname: 'example.com',
    };
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );

    expect(wrapper.find(Card).length).toBe(1);
    expect(wrapper.find(Card).first().prop('color')).toBe('blue');
    expect(wrapper.find(Card.Meta).first().prop('children')).toBe('Active');
    expect(wrapper.find(Card.Header).first().prop('children')).toBe('Sparky');
    expect(wrapper.find(Websocket).length).toBe(1);
    expect(wrapper.find(Websocket).prop('url')).toBe('ws://example.com:8000/ws/realtime/1234/');
  });

  test('displays inactive rover', () => {
    delete global.window.location;
    global.window.location = {
      protocol: 'https:',
      hostname: 'example.com',
    };
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive={false}
      />,
    );

    expect(wrapper.find(Card).length).toBe(1);
    expect(wrapper.find(Card).first().prop('color')).toBeNull();
    expect(wrapper.find(Card.Meta).first().prop('children')).toBe('Inactive');
    expect(wrapper.find(Card.Header).first().prop('children')).toBe('Sparky');
    expect(wrapper.find(Websocket).length).toBe(1);
    expect(wrapper.find(Websocket).prop('url')).toBe('wss://example.com:443/ws/realtime/1234/');
  });

  test('displays online rover', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );

    wrapper.setState({
      online: true,
    });
    wrapper.update();

    expect(wrapper.find(Icon).first().prop('name')).toBe('circle');
    expect(wrapper.find(Icon).first().prop('color')).toBe('green');
  });

  test('displays offline rover', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );

    wrapper.setState({
      online: false,
    });
    wrapper.update();

    expect(wrapper.find(Icon).first().prop('name')).toBe('circle outline');
    expect(wrapper.find(Icon).first().prop('color')).toBeUndefined();
  });

  test('changes sensor state on message', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-left',
      'sensor-value': true,
      unit: 'active-high',
    }));

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-left',
      'sensor-value': false,
      unit: 'active-high',
    }));

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-right',
      'sensor-value': true,
      unit: 'active-high',
    }));

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-right',
      'sensor-value': false,
      unit: 'active-high',
    }));

    expect(changeLeftSensorState).toHaveBeenCalledTimes(2);
    expect(changeLeftSensorState.mock.calls[0][0]).toBe(COVERED);
    expect(changeLeftSensorState.mock.calls[1][0]).toBe(NOT_COVERED);
    expect(changeRightSensorState).toHaveBeenCalledTimes(2);
    expect(changeRightSensorState.mock.calls[0][0]).toBe(COVERED);
    expect(changeRightSensorState.mock.calls[1][0]).toBe(NOT_COVERED);
  });

  test('ignores sensor sensor state on message with inactive', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive={false}
      />,
    );

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-left',
      'sensor-value': true,
      unit: 'active-high',
    }));

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-left',
      'sensor-value': false,
      unit: 'active-high',
    }));

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-right',
      'sensor-value': true,
      unit: 'active-high',
    }));

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'ultrasonic-right',
      'sensor-value': false,
      unit: 'active-high',
    }));

    expect(changeLeftSensorState).toHaveBeenCalledTimes(0);
    expect(changeRightSensorState).toHaveBeenCalledTimes(0);
  });

  test('ignores unknown sensors', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );

    wrapper.instance().onMessage(JSON.stringify({
      type: 'sensor-reading',
      'sensor-type': 'distance',
      'sensor-id': 'test-sensor',
      'sensor-value': true,
      unit: 'active-high',
    }));

    expect(changeLeftSensorState).not.toHaveBeenCalled();
    expect(changeRightSensorState).not.toHaveBeenCalled();
  });

  test('sets sensor online on message', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );

    expect(wrapper.state('online')).toBe(false);

    wrapper.instance().onMessage(JSON.stringify({
      type: 'heartbeat',
    }));

    expect(wrapper.state('online')).toBe(true);
    expect(changeLeftSensorState).not.toHaveBeenCalled();
    expect(changeRightSensorState).not.toHaveBeenCalled();

    wrapper.instance().onMessage(JSON.stringify({
      type: 'heartbeat',
    }));

    expect(wrapper.state('online')).toBe(true);
  });

  test('ignores unknown message', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive
      />,
    );

    wrapper.instance().onMessage(JSON.stringify({
      type: 'test-type',
    }));

    expect(wrapper.state('online')).toBe(false);
    expect(changeLeftSensorState).not.toHaveBeenCalled();
    expect(changeRightSensorState).not.toHaveBeenCalled();
  });

  test('sets active on click', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive={false}
      />,
    );

    wrapper.find(Card).simulate('click');

    expect(changeActiveRover).toHaveBeenCalledWith('1234');
  });

  test('sets offline after timeout', () => {
    jest.useFakeTimers();

    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        isActive={false}
      />,
    );

    expect(setTimeout).toHaveBeenCalledTimes(1);

    wrapper.setState({ online: true });

    jest.runAllTimers();

    expect(wrapper.state('online')).toBe(false);
  });

  test('sends all commands when active', () => {
    const wrapper = mount(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        commands={['command1', 'command2', 'command3']}
        isActive
      />,
    );

    expect(mockWsSend).toHaveBeenCalledTimes(1);
    expect(popCommand).toHaveBeenCalledTimes(1);

    wrapper.setProps({
      commands: ['command2', 'command3'],
    });

    expect(mockWsSend).toHaveBeenCalledTimes(2);
    expect(popCommand).toHaveBeenCalledTimes(2);

    wrapper.setProps({
      commands: ['command3'],
    });

    expect(mockWsSend).toHaveBeenCalledTimes(3);
    expect(popCommand).toHaveBeenCalledTimes(3);

    wrapper.setProps({
      commands: [],
    });

    expect(mockWsSend).toHaveBeenCalledTimes(3);
    expect(popCommand).toHaveBeenCalledTimes(3);
  });

  test('does not send commands when inactive', () => {
    mount(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        popCommand={popCommand}
        clientId="1234"
        name="Sparky"
        commands={['command1', 'command2', 'command3']}
        isActive={false}
      />,
    );

    expect(mockWsSend).toHaveBeenCalledTimes(0);
    expect(popCommand).toHaveBeenCalledTimes(0);
  });
});

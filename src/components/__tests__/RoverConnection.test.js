import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { shallow } from 'enzyme';
import Websocket from 'react-websocket';
import RoverConnection from '../RoverConnection';

let changeActiveRover;
let changeLeftSensorState;
let changeRightSensorState;

describe('The RoverList component', () => {
  beforeEach(() => {
    changeActiveRover = jest.fn();
    changeLeftSensorState = jest.fn();
    changeRightSensorState = jest.fn();
  });

  test('renders on the page with no errors', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
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
    expect(wrapper.find(Websocket).prop('url')).toBe('ws://example.com/ws/realtime/1234');
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
    expect(wrapper.find(Websocket).prop('url')).toBe('wss://example.com/ws/realtime/1234');
  });

  test('displays online rover', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
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
    expect(changeLeftSensorState.mock.calls[0][0]).toBe(true);
    expect(changeLeftSensorState.mock.calls[1][0]).toBe(false);
    expect(changeRightSensorState).toHaveBeenCalledTimes(2);
    expect(changeRightSensorState.mock.calls[0][0]).toBe(true);
    expect(changeRightSensorState.mock.calls[1][0]).toBe(false);
  });

  test('ignores unknown sensors', () => {
    const wrapper = shallow(
      <RoverConnection
        changeActiveRover={changeActiveRover}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
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
});

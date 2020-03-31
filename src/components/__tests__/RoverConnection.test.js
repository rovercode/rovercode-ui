import React from 'react';
import { Button } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import RoverConnection from '../RoverConnection';

import { COVERED, NOT_COVERED } from '@/actions/sensor';

let changeLeftSensorState;
let changeRightSensorState;
let connectToRover;
let disconnectFromRover;
let scanForRover;
let rover;
let wrapper;

const generateDataView = (array) => {
  const buffer = new ArrayBuffer(array.length);
  const dataView = new DataView(buffer);
  for (let i = 0; i < array.length; i++) {
    dataView.setUint8(i, array[i]);
  }

  return dataView;
};

describe('The RoverConnection component', () => {
  beforeEach(() => {
    rover = {
      name: 'BBC micro:bit [abcde]',
    };

    changeLeftSensorState = jest.fn();
    changeRightSensorState = jest.fn();
    connectToRover = jest.fn(() => Promise.resolve({}));
    disconnectFromRover = jest.fn();
    scanForRover = jest.fn(() => Promise.resolve({ value: rover }));

    wrapper = shallow(
      <RoverConnection
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        rover={rover}
      />,
    );
  });

  test('renders on the page with no errors', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(FormattedMessage).prop('defaultMessage')).toEqual('Disconnect from');
    expect(wrapper.find(Button).children().at(1).text()).toBe(' abcde');
  });

  test('renders connect button when not connected', () => {
    wrapper = shallow(
      <RoverConnection
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
      />,
    );

    expect(wrapper.find(FormattedMessage).prop('defaultMessage')).toEqual('Connect to rover');
  });

  test('changes sensor state on message', () => {
    const leftSensor1 = [
      108, 101, 102, 116, 45, 115, 101, 110, 115, 111, 114, 58, 49,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(leftSensor1),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(COVERED);
    expect(changeRightSensorState).not.toHaveBeenCalled();

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    const leftSensor0 = [
      108, 101, 102, 116, 45, 115, 101, 110, 115, 111, 114, 58, 48,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(leftSensor0),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(changeRightSensorState).not.toHaveBeenCalled();

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    const rightSensor1 = [
      114, 105, 103, 104, 116, 45, 115, 101, 110, 115, 111, 114, 58, 49,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(rightSensor1),
      },
    });

    expect(changeRightSensorState).toHaveBeenCalledWith(COVERED);
    expect(changeLeftSensorState).not.toHaveBeenCalled();

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    const rightSensor0 = [
      114, 105, 103, 104, 116, 45, 115, 101, 110, 115, 111, 114, 58, 48,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(rightSensor0),
      },
    });

    expect(changeRightSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(changeLeftSensorState).not.toHaveBeenCalled();

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    const invalid = [
      114, 105,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(invalid),
      },
    });

    expect(changeRightSensorState).not.toHaveBeenCalled();
    expect(changeLeftSensorState).not.toHaveBeenCalled();
  });

  test('connects to rover', async () => {
    await wrapper.instance().connect();

    expect(scanForRover).toHaveBeenCalled();
    expect(connectToRover).toHaveBeenCalledWith(rover, wrapper.instance().onMessage);
  });

  test('disconnects from rover', () => {
    wrapper.find(Button).simulate('click');

    expect(disconnectFromRover).toHaveBeenCalledWith(rover);
  });
});

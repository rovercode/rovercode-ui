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
      addEventListener: jest.fn(),
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
    // light-sens:600,600
    const test1 = [
      108, 105, 103, 104, 116, 45, 115, 101, 110, 115, 58, 54, 48, 48, 44, 54, 48, 48,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(test1),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(COVERED);

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    // light-sens:100,600
    const test2 = [
      108, 105, 103, 104, 116, 45, 115, 101, 110, 115, 58, 49, 48, 48, 44, 54, 48, 48,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(test2),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(COVERED);

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    // light-sens:100,100
    const test3 = [
      108, 105, 103, 104, 116, 45, 115, 101, 110, 115, 58, 49, 48, 48, 44, 49, 48, 48,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(test3),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(NOT_COVERED);

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    // light-sens:600,100
    const test4 = [
      108, 105, 103, 104, 116, 45, 115, 101, 110, 115, 58, 54, 48, 48, 44, 49, 48, 48,
    ];

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(test4),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(NOT_COVERED);

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
    expect(rover.addEventListener).toHaveBeenCalled();
    expect(connectToRover).toHaveBeenCalledWith(rover, wrapper.instance().onMessage);
  });

  test('disconnects from rover', () => {
    wrapper.find(Button).simulate('click');

    expect(disconnectFromRover).toHaveBeenCalledWith(rover);
  });
});

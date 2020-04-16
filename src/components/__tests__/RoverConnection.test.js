import React from 'react';
import { Button, Popup } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { COVERED, NOT_COVERED } from '@/actions/sensor';
import RoverConnection from '../RoverConnection';


let changeLeftSensorState;
let changeRightSensorState;
let connectToRover;
let disconnectFromRover;
let scanForRover;
let write;
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
    write = jest.fn();

    wrapper = shallowWithIntl(
      <RoverConnection
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
        rover={rover}
      />,
    ).dive().dive();
  });

  test('renders on the page with no errors', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(FormattedMessage).prop('defaultMessage')).toEqual('Disconnect from');
    expect(wrapper.find(Button).children().at(1).text()).toBe(' abcde');
  });

  test('renders connect button when not connected', () => {
    wrapper = shallowWithIntl(
      <RoverConnection
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
      />,
    ).dive().dive();

    expect(wrapper.find(FormattedMessage).prop('defaultMessage')).toEqual('Connect to rover');
    expect(wrapper.find(Button).prop('disabled')).toBe(false);
  });

  test('renders disabled connect button when on unsupported platform', () => {
    wrapper = shallowWithIntl(
      <RoverConnection
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
      />,
    ).dive().dive();

    wrapper.instance().supportedPlatform = jest.fn(() => false);
    wrapper.instance().forceUpdate();

    expect(wrapper.find(Popup).exists()).toBe(true);
  });

  test('changes light sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:600,600')),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(COVERED);
    expect(write).toHaveBeenCalledWith('Light Sensor - L:600 R:600');

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();
    write.mockReset();

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:100,600')),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(COVERED);
    expect(write).toHaveBeenCalledWith('Light Sensor - L:100 R:600');

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();
    write.mockReset();

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:100,100')),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(write).toHaveBeenCalledWith('Light Sensor - L:100 R:100');

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();
    write.mockReset();

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:600,100')),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(COVERED);
    expect(changeRightSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(write).toHaveBeenCalledWith('Light Sensor - L:600 R:100');
  });

  test('outputs error on unknown message', () => {
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
    expect(write).toHaveBeenCalledWith('Unknown rover message received.');
  });

  test('outputs line sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('line-sens:100,200')),
      },
    });

    expect(write).toHaveBeenCalledWith('Line Sensor - L:100 R:200');
  });

  test('outputs distance sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('dist-sens:123')),
      },
    });

    expect(write).toHaveBeenCalledWith('Distance Sensor - 123 mm');
  });

  test('outputs uBit temperature sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('ub-temp-sens:24')),
      },
    });

    expect(write).toHaveBeenCalledWith('uBit Temperature Sensor - 24 C');
  });

  test('outputs uBit light sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('ub-light-sens:127')),
      },
    });

    expect(write).toHaveBeenCalledWith('uBit Light Sensor - 127');
  });

  test('outputs acceleration sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('accel:123,456,789')),
      },
    });

    expect(write).toHaveBeenCalledWith('Acceleration Sensor - X:123 mG Y:456 mG Z:789 mG');
  });

  test('outputs gyroscope sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('gyro:85,92')),
      },
    });

    expect(write).toHaveBeenCalledWith('Gryoscope Sensor - Pitch:85 degrees Roll:92 degrees');
  });

  test('outputs compass sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('compass-sens:100')),
      },
    });

    expect(write).toHaveBeenCalledWith('Compass Sensor - 100 degrees');
  });

  test('outputs magnetic force sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('mag-sens:80,90,100')),
      },
    });

    expect(write).toHaveBeenCalledWith('Magnetic Force Sensor - X:80 uT Y:90 uT Z:100 uT');
  });

  test('outputs battery sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('battery-sens:3300')),
      },
    });

    expect(write).toHaveBeenCalledWith('Battery Sensor - 3300 mV');
  });

  test('outputs dew point state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('dewpoint-sens:24')),
      },
    });

    expect(write).toHaveBeenCalledWith('Dew Point Sensor - 24 C');
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

import React from 'react';
import { EXECUTION_STOP } from '@/actions/code';
import { COVERED, NOT_COVERED } from '@/actions/sensor';
import RoverConnection from '../RoverConnection';

let changeExecutionState;
let changeLeftSensorState;
let changeRightSensorState;
let changeLightSensorReadings;
let changeLineSensorReadings;
let changeBatteryVoltageReading;
let connectToRover;
let disconnectFromRover;
let scanForRover;
let write;
let rover;
let sensor;
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
    sensor = {
      left: COVERED,
      right: NOT_COVERED,
    };

    changeExecutionState = jest.fn();
    changeLeftSensorState = jest.fn();
    changeRightSensorState = jest.fn();
    changeLightSensorReadings = jest.fn();
    changeLineSensorReadings = jest.fn();
    changeBatteryVoltageReading = jest.fn();
    connectToRover = jest.fn().mockResolvedValue();
    disconnectFromRover = jest.fn();
    scanForRover = jest.fn().mockResolvedValue({ value: rover });
    write = jest.fn();

    wrapper = shallowWithIntl(
      <RoverConnection
        changeExecutionState={changeExecutionState}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        changeLightSensorReadings={changeLightSensorReadings}
        changeLineSensorReadings={changeLineSensorReadings}
        changeBatteryVoltageReading={changeBatteryVoltageReading}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
        rover={rover}
        sensor={sensor}
      />,
    );
    wrapper.setState({ supportedPlatform: true });
  });

  test('renders disconnect button when connected', () => {
    wrapper = mountWithIntl(
      <RoverConnection
        changeExecutionState={changeExecutionState}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        changeLightSensorReadings={changeLightSensorReadings}
        changeLineSensorReadings={changeLineSensorReadings}
        changeBatteryVoltageReading={changeBatteryVoltageReading}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
        rover={rover}
        sensor={sensor}
      />,
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))')
      .find('WithStyles(ForwardRef(Typography))').at(0).text()).toBe(' abcde');
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))')
      .find('WithStyles(ForwardRef(Typography))').at(1).text()).toBe('Disconnect');
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))').prop('disabled')).toBe(undefined);
  });

  test('renders connect button when not connected', () => {
    wrapper = mountWithIntl(
      <RoverConnection
        changeExecutionState={changeExecutionState}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        changeLightSensorReadings={changeLightSensorReadings}
        changeLineSensorReadings={changeLineSensorReadings}
        changeBatteryVoltageReading={changeBatteryVoltageReading}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
        sensor={sensor}
      />,
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))')
      .find('WithStyles(ForwardRef(Typography))').at(0).text()).toBe('No Rover');
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))')
      .find('WithStyles(ForwardRef(Typography))').at(1).text()).toBe('Connect');
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))').prop('disabled')).toBe(false);
  });

  test('renders disabled connect button when on unsupported platform', () => {
    wrapper = mountWithIntl(
      <RoverConnection
        changeExecutionState={changeExecutionState}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        changeLightSensorReadings={changeLightSensorReadings}
        changeLineSensorReadings={changeLineSensorReadings}
        changeBatteryVoltageReading={changeBatteryVoltageReading}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
        sensor={sensor}
      />,
    );
    wrapper.find('RoverConnection').instance().setState({ supportedPlatform: false });
    wrapper.update();

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))').prop('disabled')).toBe(true);
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Popover)))').prop('open')).toBe(false);
    wrapper.find('span').at(0).simulate('mouseEnter');
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Popover)))').prop('open')).toBe(true);
    wrapper.find('span').at(0).simulate('mouseLeave');
    expect(wrapper.find('WithStyles(WithStyles(ForwardRef(Popover)))').prop('open')).toBe(false);
  });

  test('should set and clear menu anchor element when menu is opening and closing', () => {
    wrapper = shallowWithIntl(
      <RoverConnection
        changeExecutionState={changeExecutionState}
        changeLeftSensorState={changeLeftSensorState}
        changeRightSensorState={changeRightSensorState}
        changeLightSensorReadings={changeLightSensorReadings}
        changeLineSensorReadings={changeLineSensorReadings}
        changeBatteryVoltageReading={changeBatteryVoltageReading}
        connectToRover={connectToRover}
        disconnectFromRover={disconnectFromRover}
        scanForRover={scanForRover}
        write={write}
        sensor={sensor}
      />,
    );

    wrapper.setState({ supportedPlatform: false });

    expect(wrapper.instance().state.unsupportedPopoverAnchorElement).toBe(null);
    expect(wrapper.find('span').prop('aria-owns')).toBe(undefined);
    wrapper.instance().handlePopoverOpen({ target: 'element' });
    expect(wrapper.instance().state.unsupportedPopoverAnchorElement).toBe('element');
    expect(wrapper.find('span').prop('aria-owns')).toBe('mouse-over-popover');
    wrapper.instance().handlePopoverClose();
    expect(wrapper.instance().state.unsupportedPopoverAnchorElement).toBe(null);
    expect(wrapper.find('span').prop('aria-owns')).toBe(undefined);
  });

  test('changes light sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:600,600')),
      },
    });

    expect(changeLightSensorReadings).toHaveBeenCalledWith(600, 600);

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:100,600')),
      },
    });

    expect(changeLightSensorReadings).toHaveBeenCalledWith(100, 600);

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:100,100')),
      },
    });

    expect(changeLightSensorReadings).toHaveBeenCalledWith(100, 100);

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('light-sens:600,100')),
      },
    });

    expect(changeLightSensorReadings).toHaveBeenCalledWith(600, 100);
  });

  test('changes line sensor state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('line-sens:600,600')),
      },
    });

    expect(changeLineSensorReadings).toHaveBeenCalledWith(600, 600);

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('line-sens:100,600')),
      },
    });

    expect(changeLineSensorReadings).toHaveBeenCalledWith(100, 600);

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('line-sens:100,100')),
      },
    });

    expect(changeLineSensorReadings).toHaveBeenCalledWith(100, 100);

    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('line-sens:600,100')),
      },
    });

    expect(changeLineSensorReadings).toHaveBeenCalledWith(600, 100);
  });

  test('changes button state on message', () => {
    wrapper.setProps({
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
      },
    });
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('button:a')),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(COVERED);
    expect(changeRightSensorState).not.toHaveBeenCalled();

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    wrapper.setProps({
      sensor: {
        left: COVERED,
        right: NOT_COVERED,
      },
    });
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('button:b')),
      },
    });

    expect(changeLeftSensorState).not.toHaveBeenCalled();
    expect(changeRightSensorState).toHaveBeenCalledWith(COVERED);

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    wrapper.setProps({
      sensor: {
        left: COVERED,
        right: COVERED,
      },
    });
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('button:a')),
      },
    });

    expect(changeLeftSensorState).toHaveBeenCalledWith(NOT_COVERED);
    expect(changeRightSensorState).not.toHaveBeenCalled();

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    wrapper.setProps({
      sensor: {
        left: NOT_COVERED,
        right: COVERED,
      },
    });
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('button:b')),
      },
    });

    expect(changeLeftSensorState).not.toHaveBeenCalled();
    expect(changeRightSensorState).toHaveBeenCalledWith(NOT_COVERED);

    changeRightSensorState.mockReset();
    changeLeftSensorState.mockReset();

    wrapper.setProps({
      sensor: {
        left: NOT_COVERED,
        right: NOT_COVERED,
      },
    });
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('button:x')),
      },
    });

    expect(changeLeftSensorState).not.toHaveBeenCalled();
    expect(changeRightSensorState).not.toHaveBeenCalled();
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

    expect(changeBatteryVoltageReading).toHaveBeenCalledWith(3300);
  });

  test('outputs dew point state on message', () => {
    wrapper.instance().onMessage({
      target: {
        value: generateDataView(Buffer.from('dewpoint-sens:24')),
      },
    });

    expect(write).toHaveBeenCalledWith('Dew Point Sensor - 24 C');
  });

  test('connects to rover', (done) => {
    wrapper.instance().connect().then(() => {
      expect(scanForRover).toHaveBeenCalled();
      expect(rover.addEventListener).toHaveBeenCalled();
      expect(connectToRover).toHaveBeenCalledWith(rover, wrapper.instance().onMessage);
      done();
    });
  });

  test('disconnects from rover', () => {
    wrapper.find('WithStyles(WithStyles(ForwardRef(Button)))').simulate('click');

    expect(changeExecutionState).toHaveBeenCalledWith(EXECUTION_STOP);
    expect(disconnectFromRover).toHaveBeenCalledWith(rover);
  });
});

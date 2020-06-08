import reducer from '../sensor';
import {
  CHANGE_LEFT_SENSOR_STATE,
  CHANGE_RIGHT_SENSOR_STATE,
  CHANGE_LIGHT_SENSOR_READINGS,
  CHANGE_BATTERY_VOLTAGE_READING,
  COVERED,
  NOT_COVERED,
} from '../../actions/sensor';

describe('The sensor reducer', () => {
  test('should handle CHANGE_LEFT_SENSOR_STATE', () => {
    expect(
      reducer({}, {
        type: CHANGE_LEFT_SENSOR_STATE,
        payload: COVERED,
      }),
    ).toEqual({
      left: COVERED,
    });
  });

  test('should handle CHANGE_RIGHT_SENSOR_STATE', () => {
    expect(
      reducer({}, {
        type: CHANGE_RIGHT_SENSOR_STATE,
        payload: NOT_COVERED,
      }),
    ).toEqual({
      right: NOT_COVERED,
    });
  });

  test('should handle CHANGE_LIGHT_SENSOR_READINGS', () => {
    expect(
      reducer({}, {
        type: CHANGE_LIGHT_SENSOR_READINGS,
        payload: { leftReading: 1, rightReading: 2 },
      }),
    ).toEqual({
      leftLightSensorReading: 1,
      rightLightSensorReading: 2,
    });
  });

  test('should handle CHANGE_BATTERY_VOLTAGE_READING', () => {
    expect(
      reducer({}, {
        type: CHANGE_BATTERY_VOLTAGE_READING,
        payload: 42,
      }),
    ).toEqual({
      batteryVoltageReading: 42,
    });
  });

  test('should return unmodified state for an unhandled action type', () => {
    const state = { hello: 'world' };
    expect(reducer(state, { type: 'FAKE_ACTION' })).toEqual(state);
  });
});

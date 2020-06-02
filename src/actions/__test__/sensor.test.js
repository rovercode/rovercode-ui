import {
  changeLeftSensorState,
  changeRightSensorState,
  changeLightSensorReadings,
  COVERED,
  NOT_COVERED,
} from '../sensor';


describe('Sensor actions', () => {
  test('changeLeftSensor', () => {
    const action = changeLeftSensorState(COVERED);
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_LEFT_SENSOR_STATE');
    expect(payload).toEqual(COVERED);
  });

  test('changeRightSensor', () => {
    const action = changeRightSensorState(NOT_COVERED);
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_RIGHT_SENSOR_STATE');
    expect(payload).toEqual(NOT_COVERED);
  });

  test('changeLightSensorReadings', () => {
    const action = changeLightSensorReadings(1, 2);
    const { type, payload } = action;

    expect(type).toEqual('CHANGE_LIGHT_SENSOR_READINGS');
    expect(payload).toEqual({ leftReading: 1, rightReading: 2 });
  });
});

import {
  changeLeftSensorState,
  changeRightSensorState,
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
});

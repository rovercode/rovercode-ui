import SumoLogger from 'sumo-logger';
import logger from '../logger';

jest.mock('sumo-logger');

describe('Logger', () => {
  test('sends message to logger', () => {
    logger.log('test message');
    expect(SumoLogger).toHaveBeenCalled();
    expect(SumoLogger.mock.instances[0].log).toHaveBeenCalledWith('test message');
  });
});

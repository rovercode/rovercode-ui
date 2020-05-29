import SumoLogger from 'sumo-logger';
import logger, { Logger } from '../logger';

jest.mock('sumo-logger');

describe('Logger', () => {
  afterEach(() => {
    SumoLogger.mockClear();
  });

  test('sends message to logger', () => {
    logger.log('test message');
    expect(SumoLogger).toHaveBeenCalled();
    expect(SumoLogger.mock.instances[0].log).toHaveBeenCalledWith('test message');
  });

  test('does nothing when no endpoint is provided', () => {
    const localLogger = new Logger('');
    localLogger.log('test message');
    expect(SumoLogger).not.toHaveBeenCalled();
  });
});

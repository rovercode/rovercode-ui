import SumoLogger from 'sumo-logger';

const opts = {
  endpoint: LOGGER_ENDPOINT, // eslint-disable-line no-undef
  returnPromise: true,
};

class Logger {
  constructor() {
    this.logger = new SumoLogger(opts);
  }

  log = message => this.logger.log(message)
}

export default new Logger();

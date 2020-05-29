import SumoLogger from 'sumo-logger';


export class Logger {
  constructor(endpoint) {
    if (!endpoint) {
      this.logger = null;
      return;
    }
    const opts = {
      endpoint,
      returnPromise: true,
    };
    this.logger = new SumoLogger(opts);
  }

  log = (message) => (this.logger ? this.logger.log(message) : null);
}

export default new Logger(LOGGER_ENDPOINT); // eslint-disable-line no-undef

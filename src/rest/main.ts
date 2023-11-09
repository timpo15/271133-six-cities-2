import { AppComponents } from '../types/appComponents.js';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../core/logger.js';
import { ConfigInterface } from './config.js';
import { RestSchema } from './schema.js';

@injectable()
export default class Application {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
  ) {}

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}

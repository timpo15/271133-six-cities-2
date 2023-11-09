import { config } from 'dotenv';
import { configRestSchema, RestSchema } from './schema.js';
import { inject, injectable } from 'inversify';
import { AppComponents } from '../types/appComponents.js';
import { LoggerInterface } from '../core/logger.js';
export interface ConfigInterface<U> {
    get<T extends keyof U>(key: T): U[T];
}
@injectable()
export default class ConfigService implements ConfigInterface<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can not read .env file. Perhaps the file does not exists.');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}

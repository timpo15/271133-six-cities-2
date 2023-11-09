import { AppComponents } from '../types/appComponents.js';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../core/logger.js';
import { ConfigInterface } from './config.js';
import { RestSchema } from './schema.js';
import { DatabaseClientInterface } from '../core/dbInterface.js';

@injectable()
export default class Application {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
        @inject(AppComponents.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,

  ) {}

  private getMongoConnectionString = (
    username: string,
    password: string,
    host: string,
    port: string,
    databaseName: string,
  ): string => `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=admin`;

  private async _initDatabase() {
    const connectionString = this.getMongoConnectionString(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );
    return this.databaseClient.connect(connectionString);
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    this.logger.info('Init database...');
    await this._initDatabase();
    this.logger.info('Init database completed');
  }
}

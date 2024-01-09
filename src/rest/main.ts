import { AppComponents } from '../types/appComponents.js';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../core/logger.js';
import { ConfigInterface } from './config.js';
import { RestSchema } from './schema.js';
import { DatabaseClientInterface } from '../core/dbInterface.js';
// import { BaseController } from './controller/baseController.js';
import express, { Express } from 'express';
import cors from 'cors';
import { AuthenticateMiddleware } from './middleware/authenticate.js';
import { ControllerInterface } from './controller/controllerInterface.js';

@injectable()
export default class Application {
  private server: Express;

  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
        @inject(AppComponents.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
        // @inject(AppComponents.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
        @inject(AppComponents.UserController) private readonly userController: ControllerInterface,
        @inject(AppComponents.OfferController) private readonly offerController: ControllerInterface,
        @inject(AppComponents.CommentController) private readonly commentController: ControllerInterface,
  ) {
    this.server = express();
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Init database...');
    await this._initDatabase();
    this.logger.info('Init database completed');

    this.logger.info('Try to init server...');
    await this._initMiddlewares();
    await this._initRoutes();
    await this._initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}`);
  }

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

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  private async _initRoutes() {
    this.server.use('/', this.userController.router);
    this.server.use('/', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
    this.server.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }
}

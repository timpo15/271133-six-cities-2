import 'reflect-metadata';
import { Container } from 'inversify';
import Application from './main.js';
import PinoService, { LoggerInterface } from '../core/logger.js';
import { AppComponents } from '../types/appComponents.js';
import { RestSchema } from './schema.js';
import ConfigService, { ConfigInterface } from './config.js';

async function bootstrap() {
  const container = new Container();
  container.bind<Application>(AppComponents.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(AppComponents.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponents.ConfigInterface).to(ConfigService).inSingletonScope();

  const application = container.get<Application>(AppComponents.Application);
  await application.init();
}

bootstrap();

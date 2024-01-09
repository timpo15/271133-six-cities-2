import 'reflect-metadata';
import { Container } from 'inversify';
import Application from './main.js';
import PinoService, { LoggerInterface } from '../core/logger.js';
import { AppComponents } from '../types/appComponents.js';
import { RestSchema } from './schema.js';
import ConfigService, { ConfigInterface } from './config.js';
import { DatabaseClientInterface } from '../core/dbInterface.js';
import MongoClientService from '../core/db.js';
import { ControllerInterface } from './controller/controllerInterface.js';
import CommentController from '../core/comments/controller.js';
import UserController from '../core/users/controller.js';
import OfferController from '../core/offers/controller.js';
import { UserServiceInterface } from '../core/users/userServiceInterface.js';
import UserService from '../core/users/userService.js';
import { BaseController } from './controller/baseController.js';
import { UserEntity, UserModel } from '../core/users/userEntity.js';
import { types } from '@typegoose/typegoose';
import { OfferServiceInterface } from '../core/offers/offerServiceInterface.js';
import { OfferEntity, OfferModel } from '../core/offers/offerEntity.js';
import OfferService from '../core/offers/offerService.js';
import CommentService from '../core/comments/commentService.js';
import { CommentEntity, CommentModel } from '../core/comments/commentEntity.js';
import { CommentServiceInterface } from '../core/comments/commentServiceInterface.js';

export function createRestApplicationContainer() {
  const container = new Container();
  container.bind<ConfigInterface<RestSchema>>(AppComponents.ConfigInterface).to(ConfigService).inSingletonScope();
  container.bind<LoggerInterface>(AppComponents.LoggerInterface).to(PinoService).inSingletonScope();

  container.bind<ControllerInterface>(AppComponents.CommentController).to(CommentController).inSingletonScope();
  container.bind<ControllerInterface>(AppComponents.OfferController).to(OfferController).inSingletonScope();

  container.bind<Application>(AppComponents.Application).to(Application).inSingletonScope();
  container
    .bind<DatabaseClientInterface>(AppComponents.DatabaseClientInterface)
    .to(MongoClientService)
    .inSingletonScope();
  return container;
}

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer
    .bind<CommentServiceInterface>(AppComponents.CommentServiceInterface)
    .to(CommentService)
    .inSingletonScope();

  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponents.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<ControllerInterface>(AppComponents.CommentController).to(CommentController).inSingletonScope();
  return commentContainer;
}

export function createOfferContainer() {
  const offerController = new Container();
  offerController.bind<OfferServiceInterface>(AppComponents.OfferServiceInterface).to(OfferService).inSingletonScope();
  offerController.bind<types.ModelType<OfferEntity>>(AppComponents.OfferModel).toConstantValue(OfferModel);
  offerController.bind<BaseController>(AppComponents.OfferController).to(OfferController).inSingletonScope();

  return offerController;
}

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(AppComponents.UserServiceInterface).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(AppComponents.UserModel).toConstantValue(UserModel);
  userContainer.bind<BaseController>(AppComponents.UserController).to(UserController).inSingletonScope();

  return userContainer;
}

async function bootstrap() {
  const container = Container.merge(
    createOfferContainer(),
    createUserContainer(),
    createRestApplicationContainer(),
    createCommentContainer(),
  );

  const application = container.get<Application>(AppComponents.Application);
  await application.init();
}

bootstrap();

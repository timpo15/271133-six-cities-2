import chalk from 'chalk';
import { ICliCommand } from './ICliCommand.js';
import FileReader from '../helpers/fileReader.js';
import { parseOffer } from '../helpers/offers.js';
import { UserServiceInterface } from '../../core/users/userServiceInterface.js';
import { OfferServiceInterface } from '../../core/offers/offerServiceInterface.js';
import { DatabaseClientInterface } from '../../core/dbInterface.js';
import PinoService, { LoggerInterface } from '../../core/logger.js';
import ConfigService, { ConfigInterface } from '../../rest/config.js';
import { RestSchema } from '../../rest/schema.js';
import OfferService from '../../core/offers/offerService.js';
import UserService from '../../core/users/userService.js';
import MongoClientService from '../../core/db.js';
import { OfferModel } from '../../core/offers/offerEntity.js';
import { UserModel } from '../../core/users/userEntity.js';
import { Offer } from '../../types/offer.js';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';
  private readonly userService: UserServiceInterface;
  private readonly offerService: OfferServiceInterface;
  private readonly databaseService: DatabaseClientInterface;
  private readonly logger: LoggerInterface;
  private readonly config: ConfigInterface<RestSchema>;

  constructor() {
    this.logger = new PinoService();
    this.config = new ConfigService(this.logger);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, this.config, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  public async execute(filename: string, connectionString: string): Promise<void> {
    this.logger.error(connectionString);
    await this.databaseService.connect(connectionString);
    const fileReader = new FileReader(filename.trim());

    fileReader.on('fileEnd', (count: number) => console.log(`${count} rows successfully imported`));

    fileReader.on('rowEnd', (line: string) => {
      const offer = parseOffer(line);
      this.saveOffer(offer);
      console.log(offer);
    });

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }

  private async saveOffer(offer: Offer): Promise<void> {
    const user = await this.userService.findOrCreate(offer.author);
    await this.offerService.create({
      ...offer,
      author: user.id
    });
  }
}

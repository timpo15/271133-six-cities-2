import chalk from 'chalk';
import { ICliCommand } from './ICliCommand.js';
import FileReader from '../helpers/fileReader.js';
import { parseOffer } from '../helpers/offers.js';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  public async execute(filename: string): Promise<void> {
    const fileReader = new FileReader(filename.trim());

    fileReader.on('fileEnd', (count: number) => console.log(`${count} rows successfully imported`));

    fileReader.on('rowEnd', (line: string) => {
      const offer = parseOffer(line);
      console.log(offer);
    });

    try {
      await fileReader.read();
    } catch (err) {
      console.log(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }
}

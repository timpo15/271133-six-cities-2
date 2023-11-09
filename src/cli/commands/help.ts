import { ICliCommand } from './ICliCommand.js';
import chalk from 'chalk';

export default class HelpCommand implements ICliCommand {
  public readonly name = '--help';

  public async execute(): Promise<void> {
    console.log(`Программа для подготовки данных для REST API сервера.
Пример:
    ts-node cli.ts --<${chalk.blueBright('command')}> ${chalk.cyanBright('[--arguments]')}
 ${chalk.bold('Команды')}
      ${chalk.cyanBright('--version:')}                  ${chalk.magenta('# выводит номер версии')}
      ${chalk.cyanBright('--help:')}                     ${chalk.magenta('# печатает этот текст')}
      ${chalk.cyanBright('--import')} ${chalk.blueBright('<path>')}:            ${chalk.magenta('# импортирует данные из TSV')}
      ${chalk.cyanBright('--generate')} ${chalk.blueBright('<n> <path> <url>')} ${chalk.magenta('# генерирует произвольное количество тестовых данных')}
`);
  }
}

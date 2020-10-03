import commander from 'commander';

export function main() {
  const program = new commander.Command();

  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<filepath1> <filepath2>')

  program.parse(process.argv);
}

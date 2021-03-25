import commander from 'commander';
import genDiff from './gendiff.js';

export default function run() {
  const program = new commander.Command();

  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format', 'tree')
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2, params) => {
      const diff = genDiff(filepath1, filepath2, params.format);
      console.log(diff);
    });

  program.parse(process.argv);
}

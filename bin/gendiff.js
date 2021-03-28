#!/usr/bin/env node
import commander from 'commander';
import genDiff from '../index.js';

const program = new commander.Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, params) => {
    const diff = genDiff(filepath1, filepath2, params.format);
    console.log(diff);
  })
  .parse(process.argv);

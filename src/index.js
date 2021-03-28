import fs from 'fs';
import path from 'path';
import parseData from './parsers.js';
import getFormatter from './formatting/index.js';
import buildDiffTree from './diff-tree.js';

const getFormat = (filepath) => path.extname(filepath).slice(1);
const getRawData = (filepath) => fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf8');
const getData = (filepath) => parseData(getRawData(filepath), getFormat(filepath));

export default function generateDiff(filepath1, filepath2, formatType = 'stylish') {
  const data1 = getData(filepath1);
  const data2 = getData(filepath2);

  const diff = buildDiffTree(data1, data2);
  const format = getFormatter(formatType);

  return format(diff);
}

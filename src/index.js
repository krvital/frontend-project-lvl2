import fs from 'fs';
import path from 'path';
import parseData from './parsers.js';
import getFormatter from './formatting/index.js';
import buildDiffTree from './diff-tree';

function getFileData(filepath) {
  let rawData;
  const filetype = path.extname(filepath).slice(1);

  try {
    rawData = fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf8');
  } catch (e) {
    throw new Error(`Incorrect filepath provided: ${filepath}`);
  }

  return parseData(rawData, filetype);
}

export default function generateDiff(filepath1, filepath2, formatType = 'stylish') {
  const data1 = getFileData(filepath1);
  const data2 = getFileData(filepath2);

  const diff = buildDiffTree(data1, data2);
  const format = getFormatter(formatType);

  return format(diff);
}

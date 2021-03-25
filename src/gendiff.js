import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parseData from './parsers.js';
import { NODE_TYPE } from './common.js';
import getFormatter from './formatting/index.js';

export function buildDiff(data1, data2) {
  const uniqueKeys = _.union(Object.keys(data1), Object.keys(data2));
  const sortedKeys = _.sortBy(uniqueKeys);

  return sortedKeys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (!_.has(data1, key)) {
      return { key, type: NODE_TYPE.added, value: value2 };
    }

    if (!_.has(data2, key)) {
      return { key, type: NODE_TYPE.deleted, value: value1 };
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return {
        key,
        type: NODE_TYPE.nested,
        children: buildDiff(value1, value2),
      };
    }

    if (!_.isEqual(value1, value2)) {
      return {
        key,
        type: NODE_TYPE.changed,
        prevValue: value1,
        newValue: value2,
      };
    }

    return { key, type: NODE_TYPE.unchanged, value: value2 };
  });
}

export default function genDiff(filepath1, filepath2, formatType) {
  const rawData1 = fs.readFileSync(
    path.resolve(process.cwd(), filepath1),
    'utf8',
  );
  const rawData2 = fs.readFileSync(
    path.resolve(process.cwd(), filepath2),
    'utf8',
  );

  const filetype1 = path.extname(filepath1).slice(1);
  const filetype2 = path.extname(filepath2).slice(1);
  

  const data1 = parseData(rawData1, filetype1);
  const data2 = parseData(rawData2, filetype2);

  const diff = buildDiff(data1, data2);
  const format = getFormatter(formatType);

  return format({ type: 'root', children: diff});
}

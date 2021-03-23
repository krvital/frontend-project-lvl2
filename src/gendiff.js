import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parseData from './parsers.js';
import { STATUSES } from './common.mjs';
import formatDiff from './formatting.js';

export function calcDiff(data1, data2) {
  const allKeys = _.sortBy(Object.keys({ ...data1, ...data2 }));

  return allKeys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    const isKeyExistsInBoth = _.has(data1, key) && _.has(data2, key);
    const areBothObjects = _.isPlainObject(value1) && _.isPlainObject(value2);
    const areValuesEqual = value1 === value2;

    if (areValuesEqual) {
      return [...acc, { key, value: value1, status: STATUSES.unmodified }];
    }

    if (!isKeyExistsInBoth) {
      return [
        ...acc,
        _.has(data1, key)
          ? { key, value: value1, status: STATUSES.deleted }
          : { key, value: value2, status: STATUSES.added },
      ];
    }

    if (areBothObjects) {
      return [
        ...acc,
        {
          key,
          value: calcDiff(value1, value2),
          status: STATUSES.unmodified,
        },
      ];
    }

    return [
      ...acc,
      { key, value: value1, status: STATUSES.deleted },
      { key, value: value2, status: STATUSES.added },
    ];
  }, []);
}

export default function genDiff(filepath1, filepath2) {
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

  const diff = calcDiff(data1, data2);

  return formatDiff(diff);
}

import _ from 'lodash';
import NODE_TYPE from './node-type.js';

function buildDiffChildren(data1, data2) {
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
        children: buildDiffChildren(value1, value2),
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

export default function buildDiff(data1, data2) {
  return { type: 'root', children: buildDiffChildren(data1, data2) };
}

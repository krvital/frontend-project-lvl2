import _ from 'lodash';
import { STATUSES } from './common.mjs';

const indent = (depth) => ' '.repeat(4 * depth);

const prefix = (status) => ({
  unmodified: indent(1),
  added: '  + ',
  deleted: '  - ',
}[status]);

function formatObject(object, depth) {
  const lines = Object.keys(object).map((key) => {
    const value = object[key];

    return `${indent(depth)}${prefix(STATUSES.unmodified)}${key}: ${
      _.isPlainObject(value) ? formatObject(value, depth + 1) : value
    }`;
  });

  return `{\n${lines.join('\n')}\n${indent(depth)}}`;
}

export default function formatDiff(diff, depth = 0) {
  const lines = diff.map(({ status, key, value }) => {
    let computedValue;

    if (_.isArray(value)) {
      computedValue = formatDiff(value, depth + 1);
    } else if (_.isPlainObject(value)) {
      computedValue = formatObject(value, depth + 1);
    } else {
      computedValue = value;
    }

    return [indent(depth), prefix(status), `${key}: ${computedValue}`].join('');
  });

  return `{\n${lines.join('\n')}\n${indent(depth)}}`;
}

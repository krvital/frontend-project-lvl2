import _ from 'lodash';
import stylish from './stylish.js';
import plain from './plain.js';

export default function getFormatter(type) {
  const formatters = { stylish, plain, json: JSON.stringify };

  if (!_.has(formatters, type)) {
    throw new Error(`Incorrect type ${type} provided`);
  }

  return formatters[type];
}

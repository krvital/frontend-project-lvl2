import stylish from './stylish.js';
import plain from './plain.js';

export default function getFormatter(type) {
  const formatters = { stylish, plain, json: JSON.stringify };
  const formatter = formatters[type];

  if (!formatter) {
    throw new Error(`Incorrect type ${type} provided`);
  }

  return formatter;
}

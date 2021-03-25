import tree from './tree.js';
import plain from './plain.js';

export default function getFormatter(type) {
  const formatters = { tree, plain };
  const formatter = formatters[type];

  if (!formatter) {
    throw new Error(`Incorrect type ${type} provided`);
  }

  return formatter;
}

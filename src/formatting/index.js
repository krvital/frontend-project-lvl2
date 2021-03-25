import tree from './tree.js';
import plain from './plain.js';

const formatters = {
  tree,
  plain,
};

export default function getFormatter(type) {
  return formatters[type];
}

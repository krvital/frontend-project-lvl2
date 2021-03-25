import _ from 'lodash';
import { NODE_TYPE } from '../common';

function indent(depth) {
  const SPACE = ' ';
  return SPACE.repeat(depth * 4 - 2);
}

function stringify(data, depth) {
  if (!_.isPlainObject(data)) {
    return data;
  }

  // eslint-disable-next-line no-use-before-define
  const lines = _.map(data, (value, key) => getFormatter('unchanged')({ key, value }, depth + 1));

  return `{\n${lines.join('\n')}\n${indent(depth)}  }`;
}

function getFormatter(nodeType) {
  const typeToFormatter = {
    [NODE_TYPE.nested]: (node, depth) => {
      const lines = node.children.map((child) => getFormatter(child.type)(child, depth + 1));
      return `${indent(depth)}  ${node.key}: {\n${lines.join('\n')}\n${indent(depth)}  }`;
    },
    [NODE_TYPE.added]: (node, depth) => `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth)}`,
    [NODE_TYPE.deleted]: (node, depth) => `${indent(depth)}- ${node.key}: ${stringify(node.value, depth)}`,
    [NODE_TYPE.unchanged]: (node, depth) => `${indent(depth)}  ${node.key}: ${stringify(node.value, depth)}`,
    [NODE_TYPE.changed]: (node, depth) =>
      [
        `${indent(depth)}- ${node.key}: ${stringify(node.prevValue, depth)}`,
        `${indent(depth)}+ ${node.key}: ${stringify(node.newValue, depth)}`,
      ].join('\n'),
  };

  return typeToFormatter[nodeType];
}

function formatRoot(root, depth) {
  const lines = root.children.map((node) => getFormatter(node.type)(node, depth + 1));
  return `{\n${lines.join('\n')}\n}`;
}

export default function formatToTree(diff) {
  return formatRoot(diff, 0);
}

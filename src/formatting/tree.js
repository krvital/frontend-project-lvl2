import _ from 'lodash';
import { NODE_TYPE } from '../node-type.js';

function indent(depth) {
  const SPACE = ' ';
  return SPACE.repeat(depth * 4 - 2);
}

function stringify(data, depth) {
  if (!_.isPlainObject(data)) {
    return data;
  }

  const lines = _.map(data, (value, key) =>
    typeToFormatter[NODE_TYPE.unchanged]({ key, value }, depth + 1)); // eslint-disable-line

  return `{\n${lines.join('\n')}\n${indent(depth)}  }`;
}

const typeToFormatter = {
  [NODE_TYPE.root]: (node, depth) => {
    const lines = node.children.flatMap((child) => typeToFormatter[child.type](child, depth + 1));
    return `{\n${lines.join('\n')}\n}`;
  },
  [NODE_TYPE.nested]: (node, depth) => {
    const lines = node.children.flatMap((child) => typeToFormatter[child.type](child, depth + 1));
    return `${indent(depth)}  ${node.key}: {\n${lines.join('\n')}\n${indent(depth)}  }`;
  },
  [NODE_TYPE.added]: (node, depth) => `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth)}`,
  [NODE_TYPE.deleted]: (node, depth) => `${indent(depth)}- ${node.key}: ${stringify(node.value, depth)}`,
  [NODE_TYPE.unchanged]: (node, depth) => `${indent(depth)}  ${node.key}: ${stringify(node.value, depth)}`,
  [NODE_TYPE.changed]: (node, depth) => [
    `${indent(depth)}- ${node.key}: ${stringify(node.prevValue, depth)}`,
    `${indent(depth)}+ ${node.key}: ${stringify(node.newValue, depth)}`,
  ].join('\n'),
};

export default function formatToTree(diff) {
  const iter = (node, depth) => typeToFormatter[node.type](node, depth, iter);
  return iter(diff, 0);
}

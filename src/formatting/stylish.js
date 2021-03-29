import _ from 'lodash';
import NODE_TYPE from '../node-type.js';

function indent(depth) {
  const SPACE = ' ';
  return SPACE.repeat(depth * 4 - 2);
}

function formatLines(lines, depth) {
  return depth > 0
    ? `{\n${lines.join('\n')}\n${indent(depth)}  }`
    : `{\n${lines.join('\n')}\n}`;
}

function formatObject(data, depth, format) {
  return _.map(data, (value, key) => format({ key, value }, depth + 1));
}

function formatChildren(children, depth, typeToFormatter) {
  return formatLines(
    children.flatMap((child) => typeToFormatter[child.type](child, depth + 1)),
    depth,
  );
}

function formatValue(data, depth, typeToFormatter) {
  if (_.isPlainObject(data)) {
    return formatLines(
      formatObject(data, depth, typeToFormatter[NODE_TYPE.unchanged]),
      depth,
    );
  }

  return data;
}

const typeToFormatter = {
  [NODE_TYPE.root]: (node, depth) => formatChildren(node.children, depth, typeToFormatter),
  [NODE_TYPE.nested]: (node, depth) => `${indent(depth)}  ${node.key}: ${formatChildren(node.children, depth, typeToFormatter)}`,
  [NODE_TYPE.added]: (node, depth) => `${indent(depth)}+ ${node.key}: ${formatValue(node.value, depth, typeToFormatter)}`,
  [NODE_TYPE.deleted]: (node, depth) => `${indent(depth)}- ${node.key}: ${formatValue(node.value, depth, typeToFormatter)}`,
  [NODE_TYPE.unchanged]: (node, depth) => `${indent(depth)}  ${node.key}: ${formatValue(node.value, depth, typeToFormatter)}`,
  [NODE_TYPE.changed]: (node, depth) => [
    `${indent(depth)}- ${node.key}: ${formatValue(node.prevValue, depth, typeToFormatter)}`,
    `${indent(depth)}+ ${node.key}: ${formatValue(node.newValue, depth, typeToFormatter)}`,
  ].join('\n'),
};

export default function formatToTree(diff) {
  const iter = (node, depth) => typeToFormatter[node.type](node, depth, iter);
  return iter(diff, 0);
}

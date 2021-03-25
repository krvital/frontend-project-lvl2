import _ from 'lodash';
import { NODE_TYPE } from '../common';

function getPropertyName(property, parents) {
  return [...parents, property].join('.');
}

function stringify(value) {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }

  if (_.isString(value)) {
    return `'${value}'`;
  }

  return value;
}

const nodeTypeToPrefix = {
  [NODE_TYPE.unchanged]: () => [],
  [NODE_TYPE.root]: (node, path, iter) => node.children.flatMap((child) => iter(child, path, iter)),
  // eslint-disable-next-line max-len
  [NODE_TYPE.nested]: (node, path, iter) => node.children.flatMap((child) => iter(child, [...path, node.key])),
  [NODE_TYPE.added]: (node, path) => `Property '${getPropertyName(node.key, path)}' was added with value: ${stringify(node.value)}`,
  [NODE_TYPE.deleted]: (node, path) => `Property '${getPropertyName(node.key, path)}' was removed`,
  [NODE_TYPE.changed]: ({ key, prevValue, newValue }, path) => {
    const name = getPropertyName(key, path);
    return `Property '${name}' was updated. From ${stringify(prevValue)} to ${stringify(newValue)}`;
  },
};

export default function formatToPlain(diff) {
  const iter = (node, currentPath) => nodeTypeToPrefix[node.type](node, currentPath, iter);
  return iter(diff, []).join('\n');
}

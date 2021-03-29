import _ from 'lodash';
import yaml from 'js-yaml';

function getParser(format) {
  const formatsToParsers = {
    yml: yaml.safeLoad,
    yaml: yaml.safeLoad,
    json: JSON.parse,
  };

  if (!_.has(formatsToParsers, format)) {
    throw new Error('Unexpected format');
  }

  return formatsToParsers[format];
}

export default function parseData(data, format) {
  const parse = getParser(format);

  try {
    return parse(data);
  } catch (e) {
    throw new Error('Unable to parse files');
  }
}

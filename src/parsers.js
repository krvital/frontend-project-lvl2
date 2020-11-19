import yaml from 'js-yaml';

function getParser(filetype) {
  switch (filetype) {
    case 'yml':
    case 'yaml':
      return yaml.safeLoad;
    case 'json':
      return JSON.parse;
    default:
      throw new Error('unexpected filetype');
  }
}

export default function parseData(data, filetype) {
  const parse = getParser(filetype);
  let result;

  try {
    result = parse(data);
  } catch (e) {
    throw new Error('Unable to parse files');
  }

  return result;
}

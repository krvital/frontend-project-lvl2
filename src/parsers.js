import yaml from 'js-yaml';

function getParser(fileType) {
  switch (fileType) {
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

  try {
    return parse(data);
  } catch (e) {
    throw new Error('Unable to parse files');
  }
}

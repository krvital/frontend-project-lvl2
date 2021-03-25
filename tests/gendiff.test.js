import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import genDiff from '../src/gendiff';

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = dirname(__filename); // eslint-disable-line no-underscore-dangle
const getFixturePath = (filename) => path.join(__dirname, '.', '__fixtures__', filename);

let diff;
let plainDiff;

beforeAll(() => {
  diff = readFileSync(getFixturePath('diff.txt'), 'utf-8');
  plainDiff = readFileSync(getFixturePath('diff-plain.txt'), 'utf-8');
});

test('tree diff of two nested files', () => {
  const filepath1 = getFixturePath('file1.yml');
  const filepath2 = getFixturePath('file2.json');

  expect(genDiff(filepath1, filepath2, 'tree')).toMatch(diff);
});

test('plain diff of two nested files', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.yml');

  expect(genDiff(filepath1, filepath2, 'plain')).toMatch(plainDiff);
});


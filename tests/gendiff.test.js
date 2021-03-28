import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import genDiff from '../src/gendiff';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, '.', '__fixtures__', filename);

const diff = readFileSync(getFixturePath('diff.txt'), 'utf-8');
const plainDiff = readFileSync(getFixturePath('diff-plain.txt'), 'utf-8');
const jsonDiff = readFileSync(getFixturePath('diff-json.txt'), 'utf-8');

test('diff of two nested files with default format', () => {
  const filepath1 = getFixturePath('file1.yml');
  const filepath2 = getFixturePath('file2.json');

  expect(genDiff(filepath1, filepath2)).toMatch(diff);
});

test('tree diff of two nested files', () => {
  const filepath1 = getFixturePath('file1.yml');
  const filepath2 = getFixturePath('file2.json');

  expect(genDiff(filepath1, filepath2, 'stylish')).toMatch(diff);
});

test('plain diff of two nested files', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.yml');

  expect(genDiff(filepath1, filepath2, 'plain')).toMatch(plainDiff);
});

test('json diff of two nested files', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.yml');

  expect(genDiff(filepath1, filepath2, 'json')).toMatch(jsonDiff);
});

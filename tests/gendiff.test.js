import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import genDiff, { calcDiff } from '../src/gendiff';

const __filename = fileURLToPath(import.meta.url); // eslint-disable-line no-underscore-dangle
const __dirname = dirname(__filename); // eslint-disable-line no-underscore-dangle
const getFixturePath = (filename) => path.join(__dirname, '.', '__fixtures__', filename);

const o1 = { a: 1 };
const o2 = { b: 2 };
const o4 = { a: 5, b: 2 };

let diff;
let nestedDiff;

beforeAll(() => {
  diff = readFileSync(getFixturePath('diff.txt'), 'utf-8');
  nestedDiff = readFileSync(getFixturePath('diff_nested.txt'), 'utf-8');
});

test('diff for equal objects', () => {
  expect(calcDiff(o1, o1)).toEqual([
    { key: 'a', value: 1, status: 'unmodified' },
  ]);
});

test('diff for objects without intersection', () => {
  expect(calcDiff(o1, o2)).toEqual([
    { key: 'a', value: 1, status: 'deleted' },
    { key: 'b', value: 2, status: 'added' },
  ]);
});

test('diff where value of same key has been modified', () => {
  expect(calcDiff(o1, o4)).toEqual([
    { key: 'a', value: 1, status: 'deleted' },
    { key: 'a', value: 5, status: 'added' },
    { key: 'b', value: 2, status: 'added' },
  ]);
});

test('diff value for empty objects', () => {
  expect(calcDiff({}, {})).toEqual([]);
});

test('diff of two json files', () => {
  const filepath1 = getFixturePath('file1.json');
  const filepath2 = getFixturePath('file2.json');

  expect(genDiff(filepath1, filepath2)).toMatch(diff);
});

test('diff of two yaml files', () => {
  const filepath1 = getFixturePath('file1.yml');
  const filepath2 = getFixturePath('file2.yml');

  expect(genDiff(filepath1, filepath2)).toMatch(diff);
});

test('diff of two nested files', () => {
  const filepath1 = getFixturePath('nested1.yml');
  const filepath2 = getFixturePath('nested2.yml');

  expect(genDiff(filepath1, filepath2)).toMatch(nestedDiff);
});

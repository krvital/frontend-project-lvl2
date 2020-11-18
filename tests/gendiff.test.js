import { test, expect } from '@jest/globals';
import { calcDiff } from '../src/gendiff';

const o1 = { a: 1 };
const o2 = { b: 2 };
const o4 = { a: 5, b: 2 };

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

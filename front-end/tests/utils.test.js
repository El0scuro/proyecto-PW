import test from 'node:test';
import assert from 'node:assert/strict';
import { minutesBetween, normalize } from './support/mock-api.js';

test('normaliza texto con tildes para las búsquedas', () => {
  assert.equal(normalize('  Álgebra  '), 'algebra');
});

test('calcula la duración de un bloque de clase', () => {
  assert.equal(minutesBetween('08:30', '10:00'), 90);
});

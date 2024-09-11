import { expect } from 'bun:test'
import { test } from 'bun:test'

import type { Assert } from '.'
import { isValid } from '.'
import { invalid } from '.'
import { assert } from '.'
import { lift } from '.'
import { valid } from '.'
import { fold } from '.'
import { fmap } from '.'
import { map } from '.'

test('map', () => {
  const v = valid("string")
  const f = (a: string) => parseInt(a, 10)
  const n = map(v, f)
  expect(isValid(n)).toBeTrue()
  expect(assert(n)).toBeNumber()

  const err = invalid("Invalid value")
  const res = map(err, f)
  expect(isValid(res)).toBeFalse()
  expect(() => assert(res)).toThrowError("Invalid value")
})

test('fmap', () => {
  const v = ["a", "b"]
  const f = (xs: unknown) : Assert<Array<string>> => Array.isArray(xs) ?
    valid(xs) :
    invalid("Not a string[]")
  const x = fmap(f(v), xs => valid(xs.join()))
  expect(isValid(x)).toBeTrue()
  expect(assert(x)).toBeString()
})

test('fold', () => {
  const sum = (a: number, b: number) => a + b

  const resultsA = [
    valid(1),
    valid(2),
    valid(3),
    valid(4),
  ]
  const resA = assert(fold(resultsA, valid(0), sum))
  expect(resA).toStrictEqual(10)

  const resultsB = [
    valid(25),
    invalid("ErrA"),
    valid(12.5),
  ]
  expect(() => assert(fold(resultsB, valid(0), sum)))
    .toThrowError("ErrA")
})

test('lift', () => {
  type Sex = 'm' | 'f'
  const Person = class {
    constructor(public age: number, public sex: Sex) {}
    static of(age: number, sex: Sex) {
      return new Person(age, sex)
    }
  }
  expect(assert(lift(Person.of, valid(25), valid('m' as Sex))))
    .toBeInstanceOf(Person)
  expect(() => assert(lift(Person.of, invalid("Age was NaN"), valid('m' as Sex))))
    .toThrowError("Age was NaN")
})

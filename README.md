# ts-valid-assert

Dead simple applicative validation tools with a few simplifications
making for more idiomatic TypeScript/JavaScript usage.

```typescript
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
```

## Usage
Create `Valid<T>` and `Invalid` types and combine them with
function application combinators.

### `type Assert<T> = Valid<T> | Invalid`
The union type that forms the basis for our combinators

### `valid: <T>(x: T) => Valid<T>`
Cast a type to a valid kind

### `invalid: (...errs: string[]) => Invalid`
Create an invalid kind by passing validation messages

### `map: <A,B>(a: Assert<A>, f: (a: A) => B) => Assert<B>`
Map the valid kind of a type to another type or else get the
err back.

### `fold: <A,B>(xs: Assert<A>[], acc: Assert<B>, f: (acc: B, x: A) => B) => Assert<B>`
Reduce a list of valid kinds of `A` to valid kinds of `B` or else
exclusively get back the errors in that original list

### `lift: <T extends unknown[], R>(f: (...xs: [...T]) => R, ...args: Validate<T>) => Assert<R>`
The primary tool, accepts a function and the `Assert` kind of its
argument types, and returns the `Assert` kind of its return type

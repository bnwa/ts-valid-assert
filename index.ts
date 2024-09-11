export type Valid<T> = readonly [ undefined, T ]
export type Invalid = readonly [ readonly string[] ]
export type Assert<T> = Valid<T> | Invalid

type Validate<T extends unknown[]> =
  {[K in keyof T]: Assert<T[K]>}

const append: <T>(xs: T[], x: T) => T[] =
  (xs, x) => (xs.push(x), xs)

export const valid: <T>(x: T) => Valid<T> =
  x => [ undefined, x ]

export const invalid: (...errs: string[]) => Invalid =
  (...errs) => [ errs ]

export const isValid: <T>(x: Assert<T>) => x is Valid<T> =
  x => x[0] === undefined

export const map: <A,B>(a: Assert<A>, f: (a: A) => B) => Assert<B> =
  (a, f) => isValid(a) ?
    valid(f(a[1])) :
    a

export const fmap: <A,B>(a: Assert<A>, f: (a: A) => Assert<B>) => Assert<B> =
  (a, f) => {
    if (!isValid(a)) return a
    else return f(a[1])
}

export const fold: <A,B>(xs: Assert<A>[], acc: Assert<B>, f: (acc: B, x: A) => B) => Assert<B>=
  ([ head, ...rest], acc, f) =>
    head ?
      isValid(acc) ?
        isValid(head) ?
          fold(rest, valid(f(acc[1], head[1])), f) :
          invalid(...head[0]) :
        acc :
      acc

export const apply: <A,B>(f: Assert<(a: A) => B>, a: Assert<A>) => Assert<B> =
  (f, a) =>
    isValid(f) ?
      isValid(a) ?
        valid(f[1](a[1])) :
        a :
      f

export const lift: <T extends unknown[], R>(f: (...xs: [...T]) => R, ...args: Validate<T>) => Assert<R> =
  <T extends unknown[], R>(f: (...xs: [...T]) => R, ...args: Validate<T>) : Assert<R> => {
    const res = fold(args, valid([] as T[number][]), append)
    if (isValid(res)) return valid(f(...res[1] as T))
    else return res
}

export const assert: <T>(x: Assert<T>, f?: (errs: readonly string[]) => never) => T =
  (x, f) => {
    if (isValid(x)) return x[1]
    else if (f instanceof Function) throw f(x[0])
    else throw new Error(x[0].join('\n'))
  }

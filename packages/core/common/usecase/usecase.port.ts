export interface Port<T, O> {
  _as: 'port',
  _i: T | null,
  _o: O | null
}

export const makePort = <T, O = any>(): Port<T, O> => ({
  _as: 'port',
  _o: null,
  _i: null 
})

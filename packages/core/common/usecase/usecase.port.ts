export interface Port<I, O> {
  _as: 'port',
  _i: I,
  _o: O
}

export const makePort = <I, O = any>(): Port<I, O> => ({
  _as: 'port',
  _o: null as any,
  _i: null as any
})

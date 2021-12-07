import { isEmpty, size } from 'fp-ts/lib/Map';
import { pipe } from 'fp-ts/lib/pipeable';
import { flow } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Reader';
import * as O from 'fp-ts/lib/Option';
import { createContextToken } from './context.token.factory'
import {
  BoundDependency,
  Context,
  lookup,
  createContext,
  register,
  registerAll,
  bindTo,
  bindEagerlyTo,
  resolve,
  DerivedContextToken,
  reader
} from './context'
import {
  constructContext,
  contextFactory
} from './context.helper'
describe('context', () => {
  test('createContextToken', () => {
    console.log(createContextToken('token'));
  }),

    test('asks context for a lazy reader dependency and bootstraps it only once', async () => {
      // given
      const spy = jest.fn();
      const token = createContextToken<string>();
      const dependency = pipe(reader, R.map(() => { spy(); return 'test'; }));

      // when
      const context = await flow(
        registerAll([
          bindTo(token)(dependency),
        ]),
        resolve,
      )(createContext());
      console.log(context)

      // then
      expect(lookup(context)(token)).toEqual(O.some('test'));
      expect(lookup(context)(token)).toEqual(O.some('test'));
      expect(lookup(context)(token)).toEqual(O.some('test'));
      expect(spy).toHaveBeenCalledTimes(1);
    });

  test('asks context for a derived context dependency', async () => {
    // given
    const unknownToken = createContextToken<unknown>();

    // given - derived context
    const derivedDependency_1 = () => 'test_1';
    const derivedDependency_2 = () => 'test_2';
    const derivedDependencyToken_1 = createContextToken();
    const derivedDependencyToken_2 = createContextToken();

    const derivedContext = await contextFactory(
      bindTo(derivedDependencyToken_1)(derivedDependency_1),
      bindTo(derivedDependencyToken_2)(derivedDependency_2),
    );

    // given - new context
    const dependency_3 = () => 'test_3';
    const dependencyToken_3 = createContextToken();

    const context = await contextFactory(
      bindEagerlyTo(DerivedContextToken)(() => derivedContext),
      bindTo(dependencyToken_3)(dependency_3),
    );

    // when, then
    expect(lookup(context)(derivedDependencyToken_1)).toEqual(O.some('test_1'));
    expect(lookup(context)(derivedDependencyToken_2)).toEqual(O.some('test_2'));
    expect(lookup(context)(dependencyToken_3)).toEqual(O.some('test_3'));
    expect(lookup(context)(unknownToken)).toEqual(O.none);
  });
});

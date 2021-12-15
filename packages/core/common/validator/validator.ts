import * as TE from 'fp-ts/TaskEither'
import * as t from 'io-ts'
import {CoreErrorTag} from '../error/core.error'
import {CoreError} from '../error';
import {validator} from 'io-ts-validator'
import * as F from 'fp-ts/function'

const URI = 'Validator'

type URI = typeof URI;

// declare module 'fp-ts/HKT' {
//   interface URItoKind<T> {
//     validate: Validate
//   }
// }



interface Validator<I,O> {
  validate: (value:I) => TE.TaskEither<CoreError,O>;
}

export const fromType = <I, O, A>(type: t.Type<I, O, A>): Validator<A,I> => {
  return {
    validate: (value: A) => F.pipe(
      TE.fromEither(validator(type).decodeEither(value)),
      TE.mapLeft((v) => CoreError.new(CoreErrorTag.VALIDATION)({
        code: 'Validation Error',
        message: v[0]
      }))
    )
  }
}
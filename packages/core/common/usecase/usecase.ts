import { ContextToken, createContextToken } from '../context/context.token.factory'
import * as Eq from 'fp-ts/Eq'
import * as F from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import {Port} from './usecase.port'

import {Observable} from 'rxjs'

export declare const URI = 'usecase'

export type ResultType<T> = Observable<T>

export interface UseCase<T,O,R = any> {
  token: ContextToken<R>,
  port: Port<T,O>,
  _as: 'usecase'
}



export type UseCaseCreator<T,O, R = any> =
  (inputPort: T) => UseCase<T,O,R>;



export const createUseCase = <T, O, R = any >(name: string, _config: Port<T, O>): UseCaseCreator<T,O,R> => {
  const token = createContextToken<R>(name);
  return (inputPort: T): UseCase<T,O,R> => {
    return {
      token,
      port: {
        ..._config,
        _i: inputPort
      },
      _as: 'usecase'
    }
  }
}



// export const isUseCase = F.flow(
//   O.fromNullable,
//   O.map((v: UseCase<any, any>) => v._as === 'usecase'),
//   O.getOrElse(() => false)
// )



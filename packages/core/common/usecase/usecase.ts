import { ContextToken, createContextToken } from '../context/context.token.factory'
import * as Eq from 'fp-ts/Eq'
import * as F from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import {Port} from './usecase.port'


export declare const URI = 'usecase'

export interface UseCase<T> {
  token: ContextToken,
  port: T,
  _as: 'usecase'
}



export type UseCaseCreator<T,O> =
  (inputPort: T) => UseCase<Port<T,O>>;



export const createUseCase = <T, O>(name: string, _config: Port<T, O>): UseCaseCreator<T,O> => {
  const token = createContextToken(name);
  return (inputPort: T): UseCase<Port<T,O>> => {
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



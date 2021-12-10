import { Observable } from 'rxjs'
// import { concatMap, map, tap } from 'rxjs/operators'
import { UseCase, UseCaseCreator } from './usecase'
import {Port} from './usecase.port'
// import * as R from 'fp-ts/Reader'
// import { of, Subject } from 'rxjs'
// import { createContextToken } from '../context/context.token.factory'
import { bindTo, ContextReader, lookup } from '../context/context'
// import * as F from 'fp-ts/function'
// import * as O from 'fp-ts/Option'
// import * as IO from 'fp-ts/IO'
// import moduleName from 'fp-ts/'
// import {Context} from '../context'



export interface UseCaseResolver<T, R> {
  resolve: UseCaseResolve<T, R>
}

export type UseCaseResolve<T, R> = (usecase: UseCase<Port<T,R>>) => Observable<R>


export const fromResolve = <T, R>(resolve: UseCaseResolve<T, R>): UseCaseResolver<T, R> => ({
  resolve
})

export const createResolver =
  <T, R, C = ContextReader>(creator: UseCaseCreator<T, R>, resolve: (ctx: C, usecase: UseCase<Port<T,R>>) => Observable<R>) => {
      const token = creator({} as any).token
      return bindTo(
        token,
      )(() => (ctx:C) => fromResolve<T, R>((usecase) => resolve(ctx, usecase)));
    }

// export const useResolver = <T, R>(usecase: UseCase<T, R>) => {
//   return of(usecase).pipe(
//     concatMap(usecase => {
//       return F.pipe(
//         lookup(core.ctx)(usecase.token),
//         O.map(v => {
//           return v(core).resolve(usecase)
//         }),
//         O.getOrElse(() => of())
//       ) as Observable<R>
//     }),
//     // tap(console.log)
//   )
// };


// export const useResolver = <T, R>(resolver: UseCaseResolver<T, R>) =>
//   concatMap((usecase: UseCase<T>) => {
//     // logger.log('info', JSON.stringify({
//     //   ...usecase,
//     //   usecase: String(usecase.token).match(/\((\w+)\)/)[1],
//     //   time: Date.now()
//     // }));
//     return resolver.resolve(usecase)
//   }
//   )
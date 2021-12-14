import { Observable } from 'rxjs'
import { concatMap, map, tap } from 'rxjs/operators'
import { UseCase, UseCaseCreator } from './usecase'
import {Port} from './usecase.port'
// import * as R from 'fp-ts/Reader'
import { of, Subject } from 'rxjs'
// import { createContextToken } from '../context/context.token.factory'
import { bindTo, ContextReader, createContext, lookup } from '../context/context'
// import * as F from 'fp-ts/function'
import * as O from 'fp-ts/Option'
// import * as IO from 'fp-ts/IO'
// import moduleName from 'fp-ts/'
// import {Context} from '../context'
import * as F from 'fp-ts/function'
import * as R from 'fp-ts/Reader'
import {IO} from 'fp-ts/IO'
import { Context, contextFactory } from '../context'


export type Resolve<I, O, R> = (usecase: UseCase<I,O,R>) => Observable<O>
export interface UseCaseResolver<I, O> {
  resolve: Resolve<I, O,UseCaseResolver<I, O>>
}

type ResolverReader<I, O, R extends UseCaseResolver<I, O> = UseCaseResolver<I, O> > = R.Reader<Context.Context, R>;


export const fromResolve = <I, O>(resolve: Resolve<I, O,UseCaseResolver<I, O>>): UseCaseResolver<I, O> => ({
  resolve
})


export const createResolver =
  <I,O>(creator: UseCaseCreator<I, O, ResolverReader<I,O>>, resolve: (ctx: Context.Context, usecase: UseCase<I, O, UseCaseResolver<I,O>>) => Observable<O>) =>
  {
    const token = creator({} as any).token;
    
    return bindTo(token)(():ResolverReader<I, O> => (ctx:Context.Context) => fromResolve<I, O>((usecase) => resolve(ctx, usecase)))
  }


export const useResolver = <I, O>(usecase: UseCase<I,O,ResolverReader<I, O>>) => (ctx:Context.Context) => {
  return of(usecase).pipe(
    concatMap(usecase => {
      return F.pipe(
        lookup(ctx)(usecase.token),
        O.map(v => {
          return v(ctx).resolve(usecase as any)
        }),
        O.getOrElse(() => of() as Observable<O>)
      ) 
    }),
    // tap(console.log)
  )
};


// export const useResolver = <I, O>(resolver: UseCaseResolver<I, O>) =>
//   concatMap((usecase: UseCase<T>) => {
//     // logger.log('info', JSON.stringify({
//     //   ...usecase,
//     //   usecase: String(usecase.token).match(/\((\w+)\)/)[1],
//     //   time: Date.now()
//     // }));
//     return resolver.resolve(usecase)
//   }
//   )
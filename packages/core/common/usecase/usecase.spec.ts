import { UseCaseResolver,createResolver,useResolver } from './usecase.resolver'
import {UseCase, URI,createUseCase} from './usecase'
import { makePort } from './usecase.port'
import {of,combineLatest, from, concatMap} from 'rxjs'
import * as S from 'fp-ts/State'
import {tuple,pipe} from 'fp-ts/function'
import { contextFactory, createContextToken,Context } from '../context'
import * as R from 'fp-ts/Reader'
import { lookup } from 'fp-ts/lib/ReadonlyRecord'
import * as F from 'fp-ts/function'
import * as O from 'fp-ts/Option'

type InputType = {
  input: number
};

type OutputType = {
  output: number
};


describe("UseCase", () => {
  test("createUseCase", () => {

    const usecaseCreator = createUseCase('usecaseName', makePort<InputType, OutputType>());
    
    const usecase = usecaseCreator({
      input: 10
    })

    expect(usecase).toHaveProperty('port');
    expect(usecase).toHaveProperty('token');
    expect(usecase).toHaveProperty('_as', 'usecase');
    
  })

  test('usecaseResolver',  done => {
    const usecaseCreator = createUseCase('usecaseName', makePort<InputType, OutputType>());
    const usecaseCreator2 = createUseCase('usecaseName2', makePort<InputType, OutputType>());


    const resolver = createResolver(
      usecaseCreator,
      (ctx, usecase) => {
        return of({
          output: usecase.port._i.input * 2
        });
      })
    
    const resolver2 = createResolver(
      usecaseCreator2,
      (ctx, usecase) => {
        return useResolver(usecaseCreator(usecase.port._i))(ctx);
      }
    )
    
    const context = from(contextFactory(
      resolver,
      resolver2
    ))

    context.pipe(
      concatMap((context) => {
          const res2 = useResolver((usecaseCreator2(
            {
              input: 20
            }
          )))(context);
        
          const res1 = useResolver(usecaseCreator({
            input: 10
          }))(context)

          return combineLatest([res1, res2])
      })
    ).subscribe({
      next: ([val1, val2]) => {
        expect(val1).toHaveProperty('output', 20);
        expect(val2).toHaveProperty('output', 40);
      },
      complete: () => done()
    })

  });
})
import { UseCaseResolve } from './usecase.resolver'
import {UseCase, URI,createUseCase} from './usecase'
import {makePort} from './usecase.port'

type InputType = {
  input: number
};

type OutputType = {
  output: string
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

  // test('createUseCaseResolver', () => {
    

  // });
 
})
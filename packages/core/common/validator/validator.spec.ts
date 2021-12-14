import { fromType } from './validator'
import { email } from '../types/email.type'
import * as F from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { CoreError } from '../error'

describe('validator', () => {
  
  test('fromType', async () => {
    const emailString = 'email@email.com'
    const res = await F.pipe(
      fromType(email).validate(emailString),
      TE.toUnion
    )()
    
    expect(res).toBe(emailString)
    
  })
})
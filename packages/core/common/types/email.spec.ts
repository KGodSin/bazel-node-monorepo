import { email } from './email.type'
import {validator} from 'io-ts-validator'
import * as F from 'fp-ts/function'
import {
  either as E
} from 'fp-ts'
describe('email', () => {
  test('is not email', () => {
    expect(F.pipe(
      'email.com',
      validator(email).decodeEither,
      E.fold(
        () => false,
        () => true
      )
    )).toBe(false);
  })

  test('is email', () => {
    expect(F.pipe(
      'kim@naver.com',
      validator(email).decodeEither,
      E.fold(
        () => false,
        () => true
      )
    )).toBe(true);
  })
})
import * as t from 'io-ts'
import {
  function as F, string
} from 'fp-ts'



const isString = (u: unknown): u is string => typeof u === "string";
const isEmail = (s: string) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(s);

export const email = new t.Type<string, string, string>(
  "email",
  isString,
  (input, context) => isEmail(input) ? t.success(input):t.failure(input,context),
  t.identity
)
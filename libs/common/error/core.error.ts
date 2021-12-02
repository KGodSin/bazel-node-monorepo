import {
  option as O,
  function as F,
  eq as EQ,
  string as S,
  identity as ID,
  boolean as B
} from 'fp-ts'

export enum CoreErrorTag {
  UNAUTHORIZED= 'unauthorized',
  UNKNOWN= 'unknown',
  VALIDATION= 'validation',
  DATABASE= 'database',
  FORBIDDEN= 'forbidden'
}
export type OfParam<T extends CoreError> = Partial<T> & Required<Pick<T, "code">>;

export class CoreError extends Error {
  code: string;
  detail: string;
  _tag: CoreErrorTag;
  stack?: any;
  static new(tag: CoreErrorTag) {
    return (error: Omit<OfParam<CoreError>,"tag">) => {
      return new CoreError({
        ...error,
        _tag:tag
      });
    }
  }

  private constructor(error: OfParam<CoreError>) {
    super(error.message);
    this._tag = error._tag;
    this.code = error.code;
    this.detail = error.detail;
    this.name = error.name;
    this.stack = error.stack;
    this.message = error.message
  }
}


const tagIs = (tag: CoreErrorTag) => (error: CoreError) => error?._tag === tag;

export const optionOf = (error: OfParam<CoreError>): O.Option<CoreError> =>
  F.pipe(
    O.fromNullable(error),
    O.map(err => CoreError.new(error._tag)({
      code: err.code,
      message: error.message,
      detail: err.detail ?? err.message,
      stack: err.stack
    })),
  )


export const createOrElse = <T extends CoreError>(name: string, tag:CoreErrorTag) => () => CoreError.new(tag)({
    code: name,
    message: `${name} error`,
    detail: `${name} error`,
    _tag:tag,
}) as T

export const map = <T,E>(f: (error: T) => E) => (error: T) => error instanceof CoreError ? f(error) : error;

export const mapUnauthorized = <T extends CoreError,E>(f: (error: T) => E) => 
  (error: T) => F.pipe(
    error,
    tagIs(CoreErrorTag.UNAUTHORIZED),
    B.fold(
      () => ID.of(error),
      () => map(f)(error)
    ) 
  )

export const mapUnknown = <T extends CoreError,E>(f: (error: T) => E) =>
  (error: T) => F.pipe(
    error,
    tagIs(CoreErrorTag.UNKNOWN),
    B.fold(
      () => ID.of(error),
      () => map(f)(error)
    ) 
  )

export const mapValidation = <T extends CoreError,E>(f: (error: T) => E) =>
  (error: T) => F.pipe(
    error,
    tagIs(CoreErrorTag.VALIDATION),
    B.fold(
      () => ID.of(error),
      () => map(f)(error)
    ) 
  )

export const mapDatabase = <T extends CoreError,E>(f: (error: T ) => E) =>
  (error: T) => F.pipe(
    error,
    tagIs(CoreErrorTag.DATABASE),
    B.fold(
      () => ID.of(error),
      () => map(f)(error)
    ) 
  )

export const mapForbidden = <T extends CoreError,E>(f: (error: T) => E) =>
  (error: T) => F.pipe(
    error,
    tagIs(CoreErrorTag.FORBIDDEN),
    B.fold(
      () => ID.of(error),
      () => map(f)(error)
    ) 
  )
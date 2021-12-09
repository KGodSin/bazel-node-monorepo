

export declare const URI = 'Validator'

export interface Validator<T> {
  validate: (value:T) => boolean;
}
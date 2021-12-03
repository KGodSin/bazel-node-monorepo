
import {CoreError, CoreErrorTag} from '@snowball/common'
console.log('run');
console.log('hello world!!')

const core = CoreError.new(CoreErrorTag.VALIDATION)({
  code: 'd'
});
export const createVal = (val: number) => {
  return val;
}

console.log('good',core);
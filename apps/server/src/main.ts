
import { CoreError, CoreErrorTag } from '@packages/core/common'
import {domain} from '@packages/core/domain'
import {service} from '@packages/core/service'

console.log(domain);
console.log(service);
console.log('run');
console.log('hello world!!')

const core = CoreError.new(CoreErrorTag.VALIDATION)({
  code: 'd'
});
export const createVal = (val: number) => {
  return val;
}

console.log('good',core);
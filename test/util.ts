import {Model} from '../src/compiler/Model';
import {Spec} from '../src/schema/schema';

/**
 * Call new Model without worrying about type.
 * We use this in test to allow using raw JSON.
 */
export function parseModel(spec) {
  return new Model(spec as Spec);
}

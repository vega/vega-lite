import {Model} from '../src/compile/Model';
import {Spec} from '../src/schema/schema';

/**
 * Call new Model without worrying about types.
 * We use this in tests to allow using raw JSON.
 */
export function parseModel(spec) {
  return new Model(spec as Spec);
}

import {DataComponent} from '../../../src/compile/data/data';

// FIXME refactor signature of assemble methods()

export function mockDataComponent(): DataComponent {
  return {
    formatParse: null,
    nullFilter: null,
    transforms: null,
    nonPositiveFilter: null,
    pathOrder: null,

    source: null,
    bin: null,
    timeUnit: null,
    summary: null,
    stack: null
  };
}

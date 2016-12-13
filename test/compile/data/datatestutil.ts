import {DataComponent} from '../../../src/compile/data/data';

// FIXME refactor signature of assemble methods()

export function mockDataComponent(): DataComponent {
  return {
    formatParse: null,
    nullFilter: null,
    filter: null,
    nonPositiveFilter: null,

    source: null,
    bin: null,
    calculate: null,
    timeUnit: null,
    summary: null,
    stack: null,
    stackScale: null
  };
}

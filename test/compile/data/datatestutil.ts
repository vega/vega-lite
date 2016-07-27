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
    timeUnitDomain: null,
    summary: null,
    stackScale: null,
    colorRank: null
  };
}

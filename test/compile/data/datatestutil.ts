import {DataComponent} from '../../../src/compile/data/data';
import {Model} from '../../../src/compile/model';
import {DataTable} from '../../../src/data';

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
    aggregate: null,
    stackScale: null,
    colorRank: null
  };
}

export function mockRenameModel(from: DataTable = null, to: string = null): Model {
  return {
    dataName: function(name) {
      if (from && name === from) {
        return to;
      }
      return name;
    }
  } as Model;
}

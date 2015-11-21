import {MAXBINS_DEFAULT} from '../bin';
import {QUANTITATIVE} from '../type';
import {toMap} from '../util';

// TODO: add other bin properties

export interface Bin {
  maxbins: number;
}

export var bin = {
  type: ['boolean', 'object'],
  default: false,
  properties: {
    maxbins: {
      type: 'integer',
      default: MAXBINS_DEFAULT,
      minimum: 2,
      description: 'Maximum number of bins.'
    }
  },
  supportedTypes: toMap([QUANTITATIVE]) // TODO: add O after finishing #81
};

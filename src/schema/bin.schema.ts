import {QUANTITATIVE} from '../type';
import {toMap} from '../util';

export interface Bin {
  min?: number;
  max?: number;
  base?: number;
  step?: number;
  steps?: number[];
  minstep?: number;
  div?: number[];
  maxbins?: number;
}

export var bin = {
  type: ['boolean', 'object'],
  default: false,
  properties: {
    min: {
      type: 'number',
      default: undefined,
      description: 'The minimum bin value to consider. If unspecified, the minimum value of the specified field is used.'
    },
    max: {
      type: 'number',
      default: undefined,
      description: 'The maximum bin value to consider. If unspecified, the maximum value of the specified field is used.'
    },
    base: {
      type: 'number',
      default: undefined,
      description: 'The number base to use for automatic bin determination (default is base 10).'
    },
    step: {
      type: 'number',
      default: undefined,
      description: 'An exact step size to use between bins. If provided, options such as maxbins will be ignored.'
    },
    steps: {
      type: 'array',
      default: undefined,
      description: 'An array of allowable step sizes to choose from.'
    },
    minstep: {
      type: 'number',
      default: undefined,
      description: 'A minimum allowable step size (particularly useful for integer values).'
    },
    div: {
      type: 'array',
      default: undefined,
      description: 'Scale factors indicating allowable subdivisions. The default value is [5, 2], which indicates that for base 10 numbers (the default base), the method may consider dividing bin sizes by 5 and/or 2. For example, for an initial step size of 10, the method can check if bin sizes of 2 (= 10/5), 5 (= 10/2), or 1 (= 10/(5*2)) might also satisfy the given constraints.'
    },
    maxbins: {
      type: 'integer',
      default: undefined,
      minimum: 2,
      description: 'Maximum number of bins.'
    }
  },
  supportedTypes: toMap([QUANTITATIVE]) // TODO: add O after finishing #81
};

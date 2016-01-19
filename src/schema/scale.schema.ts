import {toMap, duplicate as clone} from '../util';
import {mergeDeep} from './schemautil';
import {QUANTITATIVE, TEMPORAL} from '../type';

export interface Scale {
  type?: string;
  domain?: any; // TODO: declare vgDataDomain
  range?: any; // TODO: declare vgRangeDomain
  round?: boolean;

  // ordinal
  bandWidth?: number;
  outerPadding?: number;
  padding?: number;

  // typical
  clamp?: boolean;
  nice?: boolean|string;
  exponent?: number;
  zero?: boolean;

  // color channel only
  quantitativeRange? : string[];

  // Vega-Lite only
  useRawDomain?: boolean;
}

var scale = {
  type: 'object',
  // TODO: refer to Vega's scale schema
  properties: {
    /* Common Scale Properties */
    type: {
      type: 'string',
      enum: ['linear', 'log', 'pow', 'sqrt', 'quantile', 'ordinal'],
      default: undefined,
      supportedTypes: toMap([QUANTITATIVE])
    },
    domain: {
      default: undefined,
      type: ['array', 'object'],
      description: 'The domain of the scale, representing the set of data values. For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. The domain may also be specified by a reference to a data source.'
    },
    range: {
      default: undefined,
      type: ['array', 'object', 'string'],
      description: 'The range of the scale, representing the set of visual values. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain. For ordinal scales only, the range can be defined using a DataRef: the range values are then drawn dynamically from a backing data set.'
    },
    round: {
      default: undefined, // TODO: revise default
      type: 'boolean',
      description: 'If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.'
    }
  }
};


var ordinalScaleMixin = {
  properties: {
    bandWidth: {
      type: 'integer',
      minimum: 0,
      default: undefined
    },
    /* Ordinal Scale Properties */
    outerPadding: {
      type: 'number',
      default: undefined
      // TODO: add description once it is documented in Vega
    },
    padding: {
      type: 'number',
      default: undefined,
      description: 'Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).'
    }
  }
};

var typicalScaleMixin = {
  properties: {
    /* Quantitative and temporal Scale Properties */
    clamp: {
      type: 'boolean',
      default: true,
      description: 'If true, values that exceed the data domain are clamped to either the minimum or maximum range value'
    },
    nice: {
      default: undefined,
      oneOf: [
        {
          type: 'boolean',
          description: 'If true, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96).'
        },{
          type: 'string',
          enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'],
          description: 'If specified, modifies the scale domain to use a more human-friendly value range. For time and utc scale types only, the nice value should be a string indicating the desired time interval; legal values are "second", "minute", "hour", "day", "week", "month", or "year".'
        }
      ],
      // FIXME this part might break polestar
      supportedTypes: toMap([QUANTITATIVE, TEMPORAL]),
      description: ''
    },

    /* Quantitative Scale Properties */
    exponent: {
      type: 'number',
      default: undefined,
      description: 'Sets the exponent of the scale transformation. For pow scale types only, otherwise ignored.'
    },
    zero: {
      type: 'boolean',
      description: 'If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.',
      default: undefined,
      supportedTypes: toMap([QUANTITATIVE, TEMPORAL])
    },

    /* Vega-lite only Properties */
    useRawDomain: {
      type: 'boolean',
      default: false,
      description: 'Uses the source data range as scale domain instead of ' +
                   'aggregated data for aggregate axis. ' +
                   'This option does not work with sum or count aggregate' +
                   'as they might have a substantially larger scale range.'
    }
  }
};

export var ordinalOnlyScale = mergeDeep(clone(scale), ordinalScaleMixin);
export var typicalScale = mergeDeep(clone(scale), ordinalScaleMixin, typicalScaleMixin);

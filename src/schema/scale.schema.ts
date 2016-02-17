import {toMap, duplicate as clone} from '../util';
import {mergeDeep} from './schemautil';
import {QUANTITATIVE, TEMPORAL} from '../type';

export interface ScaleConfig {
  round?: boolean;
  textBandWidth?: number;
  bandWidth?: number;
  padding?: number;
  useRawDomain?: boolean;

  // nice should depends on type (quantitative or temporal), so
  // let's not make a config.
}

export const defaultScaleConfig: ScaleConfig = {
  round: true,
  textBandWidth: 90,
  bandWidth: 21,
  padding: 1,
  useRawDomain: false
};

export const scaleConfig = {
  type: 'object',
  properties: {
    round: {
      type: 'boolean',
      description: 'If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.'
    },
    textBandWidth: {
      type: 'integer',
      minimum: 0,
    },
    bandWidth: {
      type: 'integer',
      minimum: 0,
    },
    padding: {
      type: 'number',
      description: 'Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).'
    },
    useRawDomain: {
      type: 'boolean',
      description: 'Uses the source data range as scale domain instead of ' +
                   'aggregated data for aggregate axis. ' +
                   'This option does not work with sum or count aggregate' +
                   'as they might have a substantially larger scale range.'
    }
  }
};

export interface FacetScaleConfig {
  round?: boolean;
  padding?: number;
}

export const defaultFacetScaleConfig: FacetScaleConfig = {
  round: true,
  padding: 16
};

export const facetScaleConfig = {
  type: 'object',
  properties: {
    round: {
      type: 'boolean',
      description: 'If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.'
    },
    padding: {
      type: 'number',
      description: 'Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).'
    }
  }
};


export interface Scale {
  /**
   * @enum ["linear", "log", "pow", "sqrt", "quantile", "ordinal"]
   */
  type?: string;
  /**
   * The domain of the scale, representing the set of data values. For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. The domain may also be specified by a reference to a data source.
   */
  domain?: any; // TODO: declare vgDataDomain
  /**
   * The range of the scale, representing the set of visual values. For numeric values, the range can take the form of a two-element array with minimum and maximum values. For ordinal or quantized data, the range may by an array of desired output values, which are mapped to elements in the specified domain. For ordinal scales only, the range can be defined using a DataRef: the range values are then drawn dynamically from a backing data set.
   */
  range?: string | number[] | string[]; // TODO: declare vgRangeDomain
  /**
   * If true, rounds numeric output values to integers. This can be helpful for snapping to the pixel grid.
   */
  round?: boolean;

  // ordinal
  /**
   * @minimum 0
   */
  bandWidth?: number;
  /**
   * Applies spacing among ordinal elements in the scale range. The actual effect depends on how the scale is configured. If the __points__ parameter is `true`, the padding value is interpreted as a multiple of the spacing between points. A reasonable value is 1.0, such that the first and last point will be offset from the minimum and maximum value by half the distance between points. Otherwise, padding is typically in the range [0, 1] and corresponds to the fraction of space in the range interval to allocate to padding. A value of 0.5 means that the range band width will be equal to the padding width. For more, see the [D3 ordinal scale documentation](https://github.com/mbostock/d3/wiki/Ordinal-Scales).
   */
  padding?: number;

  // typical
  /**
   * If true, values that exceed the data domain are clamped to either the minimum or maximum range value
   */
  clamp?: boolean;
  /**
   * If specified, modifies the scale domain to use a more human-friendly value range. If specified as a true boolean, modifies the scale domain to use a more human-friendly number range (e.g., 7 instead of 6.96). If specified as a string, modifies the scale domain to use a more human-friendly value range. For time and utc scale types only, the nice value should be a string indicating the desired time interval; legal values are "second", "minute", "hour", "day", "week", "month", or "year".
   */
  nice?: boolean|string;
  /**
   * Sets the exponent of the scale transformation. For pow scale types only, otherwise ignored.
   */
  exponent?: number;
  /**
   * If true, ensures that a zero baseline value is included in the scale domain. This option is ignored for non-quantitative scales.
   */
  zero?: boolean;

  // Vega-Lite only
  /**
   * Uses the source data range as scale domain instead of aggregated data for aggregate axis. This option does not work with sum or count aggregate as they might have a substantially larger scale range.
   */
  useRawDomain?: boolean;
}

var scale = {
  type: 'object',
  // TODO: refer to Vega's scale schema
  properties: {
    /* Common Scale Properties */
    type: {
      type: 'string',
      default: undefined,
      supportedTypes: toMap([QUANTITATIVE])
    },
    domain: {
      default: undefined,
      type: ['array', 'object']
    },
    range: {
      default: undefined,
      type: ['array', 'object', 'string']
    },
    round: {
      default: undefined, // TODO: revise default
      type: 'boolean'
    }
  }
};


var ordinalScaleMixin = {
  properties: {
    bandWidth: {
      type: 'integer',
      default: undefined
    },
    /* Ordinal Scale Properties */
    padding: {
      type: 'number',
      default: undefined
    }
  }
};

var typicalScaleMixin = {
  properties: {
    /* Quantitative and temporal Scale Properties */
    clamp: {
      type: 'boolean',
      default: undefined
    },
    nice: {
      oneOf: [
        {
          type: 'boolean'
        },{
          type: 'string',
          enum: ['second', 'minute', 'hour', 'day', 'week', 'month', 'year']
        }
      ],
      // FIXME this part might break polestar
      supportedTypes: toMap([QUANTITATIVE, TEMPORAL])
    },

    /* Quantitative Scale Properties */
    exponent: {
      type: 'number',
      default: undefined
    },
    zero: {
      type: 'boolean',
      default: undefined,
      supportedTypes: toMap([QUANTITATIVE, TEMPORAL])
    },

    /* Vega-lite only Properties */
    useRawDomain: {
      type: 'boolean',
      default: false
    }
  }
};

export var ordinalOnlyScale = mergeDeep(clone(scale), ordinalScaleMixin);
export var typicalScale = mergeDeep(clone(scale), ordinalScaleMixin, typicalScaleMixin);

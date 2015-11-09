// Package of defining Vega-lite Specification's json schema

/// <reference path="../typings/vega.d.ts"/>
/// <reference path="../typings/colorbrewer.d.ts"/>

import * as colorbrewer from 'colorbrewer';
import * as util from '../util';
import {toMap} from '../util';
import * as schemaUtil from './schemautil';
import {Q, N, O, T} from '../consts';



import {VALID_OPS as VALID_AGG_OPS} from 'vega/src/transforms/Aggregate';

// TODO(#620) refer to vega schema
// var vgStackSchema = require('vega/src/transforms/Stack').schema;

export var marktype = {
  type: 'string',
  enum: ['point', 'tick', 'bar', 'line', 'area', 'circle', 'square', 'text']
};

export var aggregate = {
  type: 'string',
  enum: VALID_AGG_OPS,
  supportedEnums: {
    Q: VALID_AGG_OPS,
    O: ['median','min','max'],
    N: [],
    T: ['mean', 'median', 'min', 'max'], // TODO: revise what should time support
    '': ['count']
  },
  supportedTypes: toMap([Q, N, O, T, ''])
};

export function getSupportedRole(encType) {
  return schema.properties.encoding.properties[encType].supportedRole;
};

export var timeUnits = ['year', 'month', 'day', 'date', 'hours', 'minutes', 'seconds'];

export var defaultTimeFn = 'month';

export var timeUnit = {
  type: 'string',
  enum: timeUnits,
  supportedTypes: toMap([T])
};

export var scale_type = {
  type: 'string',
  // TODO(kanitw) read vega's schema here, add description
  enum: ['linear', 'log', 'pow', 'sqrt', 'quantile'],
  default: 'linear',
  supportedTypes: toMap([Q])
};

export var field = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  }
};

var clone = util.duplicate;
var merge = schemaUtil.merge;

export var MAXBINS_DEFAULT = 15;

var bin = {
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
  supportedTypes: toMap([Q]) // TODO: add O after finishing #81
};

var scale = {
  type: 'object',
  // TODO: refer to Vega's scale schema
  properties: {
    /* Common Scale Properties */
    type: scale_type,
    domain: {
      default: undefined,
      type: ['array', 'object'],
      description: 'The domain of the scale, representing the set of data values. For quantitative data, this can take the form of a two-element array with minimum and maximum values. For ordinal/categorical data, this may be an array of valid input values. The domain may also be specified by a reference to a data source.'
    },
    range: {
      default: undefined,
      type: ['array', 'object'],
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
        },
    points: {
      type: 'boolean',
      default: undefined,
      description: 'If true, distributes the ordinal values over a quantitative range at uniformly spaced points. The spacing of the points can be adjusted using the padding property. If false, the ordinal scale will construct evenly-spaced bands, rather than points.'
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
      supportedTypes: toMap([Q, T]),
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
      supportedTypes: toMap([Q, T])
    },

    /* Vega-lite only Properties */
    useRawDomain: {
      type: 'boolean',
      default: undefined,
      description: 'Uses the source data range as scale domain instead of ' +
                   'aggregated data for aggregate axis. ' +
                   'This option does not work with sum or count aggregate' +
                   'as they might have a substantially larger scale range.' +
                   'By default, use value from config.useRawDomain.'
    }
  }
};

var ordinalOnlyScale = merge(clone(scale), ordinalScaleMixin);
var typicalScale = merge(clone(scale), ordinalScaleMixin, typicalScaleMixin);

var typicalField = merge(clone(field), {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: [N, O, Q, T]
    },
    aggregate: aggregate,
    timeUnit: timeUnit,
    bin: bin,
    scale: typicalScale
  }
});

var onlyOrdinalField = merge(clone(field), {
  type: 'object',
  supportedRole: {
    dimension: true
  },
  properties: {
    type: {
      type: 'string',
      enum: [N, O, Q, T] // ordinal-only field supports Q when bin is applied and T when time unit is applied.
    },
    timeUnit: timeUnit,
    bin: bin,
    aggregate: {
      type: 'string',
      enum: ['count'],
      supportedTypes: toMap([N, O]) // FIXME this looks weird to me
    },
    scale: ordinalOnlyScale
  }
});

var axisMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true},
  properties: {
    axis: {
      type: 'object',
      properties: {
        /* Vega Axis Properties */
        format: {
          type: 'string',
          default: undefined,  // auto
          description: 'The formatting pattern for axis labels. '+
                       'If not undefined, this will be determined by ' +
                       'the max value ' +
                       'of the field.'
        },
        grid: {
          type: 'boolean',
          default: undefined,
          description: 'A flag indicate if gridlines should be created in addition to ticks. If `grid` is unspecified, the default value is `true` for ROW and COL. For X and Y, the default value is `true` for quantitative and time fields and `false` otherwise.'
        },
        layer: {
          type: 'string',
          default: 'back',
          description: 'A string indicating if the axis (and any gridlines) should be placed above or below the data marks. One of "front" (default) or "back".'
        },
        orient: {
          type: 'string',
          default: undefined,
          enum: ['top', 'right', 'left', 'bottom'],
          description: 'The orientation of the axis. One of top, bottom, left or right. The orientation can be used to further specialize the axis type (e.g., a y axis oriented for the right edge of the chart).'
        },
        ticks: {
          type: 'integer',
          default: undefined,
          minimum: 0,
          description: 'A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale\'s range.'
        },
        /* Vega Axis Properties that are automatically populated by Vega-lite */
        title: {
          type: 'string',
          default: undefined,
          description: 'A title for the axis. (Shows field name and its function by default.)'
        },
        /* Vega-lite only */
        labelMaxLength: {
          type: 'integer',
          default: 25,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        },
        titleMaxLength: {
          type: 'integer',
          default: undefined,
          minimum: 0,
          description: 'Max length for axis title if the title is automatically generated from the field\'s description'
        },
        titleOffset: {
          type: 'integer',
          default: undefined,  // auto
          description: 'A title offset value for the axis.'
        },
      }
    }
  }
};

var sortMixin = {
  type: 'object',
  properties: {
    sort: {
      default: 'ascending',
      supportedTypes: toMap([N, O]),
      oneOf: [
        {
          type: 'string',
          enum: ['ascending', 'descending', 'unsorted']
        },
        { // sort by aggregation of another field
          type: 'object',
          required: ['field', 'op'],
          properties: {
            field: {
              type: 'string',
              description: 'The field name to aggregate over.'
            },
            op: {
              type: 'string',
              enum: VALID_AGG_OPS,
              description: 'The field name to aggregate over.'
            },
            order: {
              type: 'string',
              enum: ['ascending', 'descending']
            }
          }
        }
      ]

    }
  }
};

var legendMixin = {
  type: 'object',
  properties: {
    legend: {
      type: 'object',
      description: 'Properties of a legend.',
      properties: {
        title: {
          type: 'string',
          default: undefined,
          description: 'A title for the legend. (Shows field name and its function by default.)'
        },
        orient: {
          type: 'string',
          default: 'right',
          description: 'The orientation of the legend. One of "left" or "right". This determines how the legend is positioned within the scene. The default is "right".'
        }
      }
    }
  }
};

var textMixin = {
  type: 'object',
  supportedMarktypes: {'text': true},
  properties: {
    align: {
      type: 'string',
      default: 'right'
    },
    baseline: {
      type: 'string',
      default: 'middle'
    },
    color: {
      type: 'string',
      role: 'color',
      default: '#000000'
    },
    margin: {
      type: 'integer',
      default: 4,
      minimum: 0
    },
    placeholder: {
      type: 'string',
      default: 'Abc'
    },
    font: {
      type: 'object',
      properties: {
        weight: {
          type: 'string',
          enum: ['normal', 'bold'],
          default: 'normal'
        },
        size: {
          type: 'integer',
          default: 10,
          minimum: 0
        },
        family: {
          type: 'string',
          default: 'Helvetica Neue'
        },
        style: {
          type: 'string',
          default: 'normal',
          enum: ['normal', 'italic']
        }
      }
    },
    format: {
      type: 'string',
      default: undefined,  // auto
      description: 'The formatting pattern for text value.'+
                   'If not defined, this will be determined automatically'
    },
  }
};

var sizeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, bar: true, circle: true, square: true, text: true},
  properties: {
    value: {
      type: 'integer',
      default: 30,
      minimum: 0,
      description: 'Size of marks.'
    }
  }
};

var colorMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, 'text': true},
  properties: {
    value: {
      type: 'string',
      role: 'color',
      default: '#4682b4',
      description: 'Color to be used for marks.'
    },
    opacity: {
      type: 'number',
      default: undefined,  // auto
      minimum: 0,
      maximum: 1
    },
    scale: {
      type: 'object',
      properties: {
        range: {
          type: ['string', 'array'],
          default: undefined,
          description:
            'Color palette, if undefined vega-lite will use data property' +
            'to pick one from c10palette, c20palette, or ordinalPalette.'
            //FIXME
        },
        c10palette: {
          type: 'string',
          default: 'category10',
          enum: [
            // Tableau
            'category10', 'category10k',
            // Color Brewer
            'Pastel1', 'Pastel2', 'Set1', 'Set2', 'Set3'
          ]
        },
        c20palette: {
          type: 'string',
          default: 'category20',
          enum: ['category20', 'category20b', 'category20c']
        },
        ordinalPalette: {
          type: 'string',
          default: undefined,
          description: 'Color palette to encode ordinal variables.',
          enum: util.keys(colorbrewer)
        },
        quantitativeRange: {
          type: 'array',
          default: ['#AFC6A3', '#09622A'], // tableau greens
          // default: ['#ccece6', '#00441b'], // BuGn.9 [2-8]
          description: 'Color range to encode quantitative variables.',
          minItems: 2,
          maxItems: 2,
          items: {
            type: 'string',
            role: 'color'
          }
        }
      }
    }
  }
};

var stackMixin = {
  type: 'object',
  properties: {
    stack: {
      type: ['boolean', 'object'],
      default: true,
      description: 'Enable stacking (for bar and area marks only).',
      properties: {
        reverse: {
          type: 'boolean',
          default: false,
          description: 'Whether to reverse the stack\'s sortby.'
        },
        offset: {
          type: 'string',
          default: undefined,
          enum: ['zero', 'center', 'normalize']
          // TODO(#620) refer to Vega spec once it doesn't throw error
          // enum: vgStackSchema.properties.offset.oneOf[0].enum
        }
      }
    }
  }
};

var shapeMixin = {
  type: 'object',
  supportedMarktypes: {point: true, circle: true, square: true},
  properties: {
    value: {
      type: 'string',
      enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
      default: 'circle',
      description: 'Mark to be used.'
    },
    filled: {
      type: 'boolean',
      default: false,
      description: 'Whether the shape\'s color should be used as fill color instead of stroke color.'
    }
  }
};

var detailMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, line: true, circle: true, square: true}
};

var rowMixin = {
  properties: {
    height: {
      type: 'number',
      minimum: 0,
      default: 150
    }
  }
};

var colMixin = {
  properties: {
    width: {
      type: 'number',
      minimum: 0,
      default: 150
    },
    axis: {
      properties: {
        labelMaxLength: {
          type: 'integer',
          default: 12,
          minimum: 0,
          description: 'Truncate labels that are too long.'
        }
      }
    }
  }
};

var facetMixin = {
  type: 'object',
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, text: true},
  properties: {
    padding: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.1
    }
  }
};

var requiredNameType = {
  required: ['name', 'type']
};

var multiRoleField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: true
  }
});

var quantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true,
    dimension: 'ordinal-only' // using size to encoding category lead to order interpretation
  }
});

var onlyQuantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true
  }
});

var x = merge(clone(multiRoleField), axisMixin, requiredNameType, sortMixin);
var y = clone(x);

var facet = merge(clone(onlyOrdinalField), requiredNameType, facetMixin, sortMixin);
var row = merge(clone(facet), axisMixin, rowMixin);
var col = merge(clone(facet), axisMixin, colMixin);

var size = merge(clone(quantitativeField), legendMixin, sizeMixin, sortMixin);
var color = merge(clone(multiRoleField), legendMixin, colorMixin, stackMixin, sortMixin);

var shape = merge(clone(onlyOrdinalField), legendMixin, shapeMixin, sortMixin);
var detail = merge(clone(onlyOrdinalField), detailMixin, stackMixin, sortMixin);

// we only put aggregated measure in pivot table
var text = merge(clone(onlyQuantitativeField), textMixin, sortMixin);

// TODO add label

var data = {
  type: 'object',
  properties: {
    // data source
    formatType: {
      type: 'string',
      enum: ['json', 'csv', 'tsv'],
      default: 'json'
    },
    url: {
      type: 'string',
      default: undefined
    },
    values: {
      type: 'array',
      default: undefined,
      description: 'Pass array of objects instead of a url to a file.',
      items: {
        type: 'object',
        additionalProperties: true
      }
    },
    // we generate a vega filter transform
    filter: {
      type: 'string',
      default: undefined,
      description: 'A string containing the filter Vega expression. Use `datum` to refer to the current data object.'
    },
    // we generate a vega formula transform
    formulas: {
      type: 'array',
      default: undefined,
      description: 'Array of formula transforms. Formulas are applied before filter.',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            description: 'The property name in which to store the computed formula value.'
          },
          expr: {
            type: 'string',
            description: 'A string containing an expression for the formula. Use the variable `datum` to to refer to the current data object.'
          }
        }
      }
    }
  }
};

var config = {
  type: 'object',
  properties: {
    // template
    width: {
      type: 'integer',
      default: undefined
    },
    height: {
      type: 'integer',
      default: undefined
    },
    viewport: {
      type: 'array',
      items: {
        type: 'integer'
      },
      default: undefined
    },
    gridColor: {
      type: 'string',
      role: 'color',
      default: '#000000'
    },
    gridOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.08
    },

    // filter null
    // TODO(#597) revise this config
    filterNull: {
      type: 'object',
      properties: {
        N: {type:'boolean', default: false},
        O: {type:'boolean', default: false},
        Q: {type:'boolean', default: true},
        T: {type:'boolean', default: true}
      }
    },
    autoSortLine: {
      type: 'boolean',
      default: true
    },

    // single plot
    singleHeight: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    singleWidth: {
      // will be overwritten by bandWidth * (cardinality + padding)
      type: 'integer',
      default: 200,
      minimum: 0
    },
    // band size
    largeBandWidth: {
      type: 'integer',
      default: 21,
      minimum: 0
    },
    smallBandWidth: {
      //small multiples or single plot with high cardinality
      type: 'integer',
      default: 12,
      minimum: 0
    },
    largeBandMaxCardinality: {
      type: 'integer',
      default: 10
    },
    padding: {
      type: 'number',
      default: 1,
      description: 'default scale padding for ordinal x/y scales.'
    },
    // small multiples
    cellPadding: {
      type: 'number',
      default: 0.1,
      description: 'default scale padding for row/column scales.'
    },
    cellGridColor: {
      type: 'string',
      role: 'color',
      default: '#000000'
    },
    cellGridOpacity: {
      type: 'number',
      minimum: 0,
      maximum: 1,
      default: 0.25
    },
    cellGridOffset: {
      type: 'number',
      default: 6 // equal to tickSize
    },
    cellBackgroundColor: {
      type: 'string',
      role: 'color',
      default: 'rgba(0,0,0,0)'
    },
    textCellWidth: {
      type: 'integer',
      default: 90,
      minimum: 0
    },

    // marks
    strokeWidth: {
      type: 'integer',
      default: 2,
      minimum: 0
    },
    singleBarOffset: {
      type: 'integer',
      default: 5,
      minimum: 0
    },
    // scales
    timeScaleLabelLength: {
      type: 'integer',
      default: 3,
      minimum: 0,
      description: 'Max length for values in dayScaleLabel and monthScaleLabel.  Zero means using full names in dayScaleLabel/monthScaleLabel.'
    },
    dayScaleLabel: {
      type: 'array',
      items: {
        type: 'string'
      },
      default: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      description: 'Axis labels for day of week, starting from Sunday.' +
        '(Consistent with Javascript -- See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getDay.'
    },
    monthScaleLabel: {
      type: 'array',
      items: {
        type: 'string'
      },
      default: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      description: 'Axis labels for month.'
    },
    // other
    characterWidth: {
      type: 'integer',
      default: 6
    },
    numberFormat: {
      type: 'string',
      default: 's',
      description: 'D3 Number format for axis labels and text tables.'
    },
    timeFormat: {
      type: 'string',
      default: '%Y-%m-%d',
      description: 'Date format for axis labels.'
    },
    useRawDomain: {
      type: 'boolean',
      default: false,
      description: 'Use the source data range as scale domain instead of ' +
                   'aggregated data for aggregate axis. ' +
                   'This option does not work with sum or count aggregate' +
                   'as they might have a substantially larger scale range.' +
                   'By default, use value from config.useRawDomain.'
    }
  }
};

/** @type Object Schema of a vega-lite specification */
export var schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: 'Schema for Vega-lite specification',
  type: 'object',
  required: ['marktype', 'encoding', 'data'],
  properties: {
    data: data,
    marktype: marktype,
    encoding: {
      type: 'object',
      properties: {
        x: x,
        y: y,
        row: row,
        col: col,
        size: size,
        color: color,
        shape: shape,
        text: text,
        detail: detail
      }
    },
    config: config
  }
};

export var encTypes = util.keys(schema.properties.encoding.properties);

/** Instantiate a verbose vl spec from the schema */
export function instantiate() {
  return schemaUtil.instantiate(schema);
};

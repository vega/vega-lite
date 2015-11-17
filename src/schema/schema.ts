// Package of defining Vega-lite Specification's json schema

/// <reference path="../../typings/vega.d.ts"/>
/// <reference path="../../typings/colorbrewer.d.ts"/>

import * as colorbrewer from 'colorbrewer';
import * as vlUtil from '../util';
import {toMap} from '../util';
import * as schemaUtil from './schemautil';
import {merge} from './schemautil';
import {Type, AGGREGATE_OPS} from '../consts';
import {marktype} from './marktype.schema';
import {data} from './data.schema';
import {config} from './config.schema';
import {aggregate, bin, sort, stack, timeUnit} from './fielddef.schema';
import {axis} from './fielddef.axis.schema';
import {typicalScale, ordinalOnlyScale} from './fielddef.scale.schema';
import {legend} from './fielddef.legend.schema';

// TODO(#620) refer to vega schema
// var vgStackSchema = require('vega/src/transforms/Stack').schema;

export function getSupportedRole(encType) {
  return schema.properties.encoding.properties[encType].supportedRole;
};

export var util = schemaUtil;

// TODO move to VLUI
export var defaultTimeFn = 'month';

export var field = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    type: {
      type: 'string',
      enum: [Type.NOMINAL, Type.ORDINAL, Type.QUANTITATIVE, Type.TEMPORAL]
    },
    timeUnit: timeUnit,
    bin: bin,
  }
};

var clone = vlUtil.duplicate;

var typicalField = merge(clone(field), {
  properties: {
    aggregate: aggregate,
    scale: typicalScale
  }
});

var onlyOrdinalField = merge(clone(field), {
  supportedRole: {
    dimension: true
  },
  properties: {
    aggregate: {
      type: 'string',
      enum: ['count'],
      supportedTypes: toMap([Type.NOMINAL, Type.ORDINAL])
    },
    scale: ordinalOnlyScale
  }
});

// TODO: remove if possible
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
    // TODO: revise if this is considered
    dimension: 'ordinal-only' // using size to encoding category lead to order interpretation
  }
});

var onlyQuantitativeField = merge(clone(typicalField), {
  supportedRole: {
    measure: true
  }
});

var x = merge(clone(multiRoleField), requiredNameType, {
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true},
  properties: {
    axis: axis,
    sort: sort
  }
});
var y = clone(x);

var facet = merge(clone(onlyOrdinalField), requiredNameType, {
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, text: true},
  properties: {
    axis: axis,
    sort: sort
  }
});

var row = merge(clone(facet), {
  properties: {
    // FIXME use this over config
    height: {
      type: 'number',
      minimum: 0,
      default: 150
    }
  }
});

var col = merge(clone(facet), {
  properties: {
    // FIXME use this over config
    width: {
      type: 'number',
      minimum: 0,
      default: 150
    }
  }
});

var size = merge(clone(quantitativeField), {
  supportedMarktypes: {point: true, bar: true, circle: true, square: true, text: true},
  properties: {
    legend: legend,
    sort: sort,
    value: {
      type: 'integer',
      default: 30,
      minimum: 0,
      description: 'Size of marks.'
    }
  }
});

var color = merge(clone(multiRoleField), {
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, 'text': true},
  properties: {
    legend: legend,
    sort: sort,
    stack: stack,
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
          enum: vlUtil.keys(colorbrewer)
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
});

var shape = merge(clone(onlyOrdinalField), {
  supportedMarktypes: {point: true, circle: true, square: true},
  properties: {
    legend: legend,
    sort: sort,
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
});

var detail = merge(clone(onlyOrdinalField), {
  supportedMarktypes: {point: true, tick: true, line: true, circle: true, square: true},
  properties: {
    sort: sort,
    stack: stack
  }
});

// we only put aggregated measure in pivot table
var text = merge(clone(onlyQuantitativeField), {
  supportedMarktypes: {'text': true},
  properties: {
    sort: sort,

    // TODO: consider if these properties should be under 'marks.'
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
});

// TODO add label

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

/** Instantiate a verbose vl spec from the schema */
export function instantiate() {
  return schemaUtil.instantiate(schema);
};

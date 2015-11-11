// Package of defining Vega-lite Specification's json schema

/// <reference path="../../typings/vega.d.ts"/>
/// <reference path="../../typings/colorbrewer.d.ts"/>

import * as colorbrewer from 'colorbrewer';
import * as util from '../util';
import {toMap} from '../util';
import * as schemaUtil from './schemautil';
import {merge} from './schemautil';
import {Type, ValidAggregateOps} from '../consts';
import {marktype} from './marktype.schema';
import {data} from './data.schema';
import {config} from './config.schema';
import {aggregate, bin, timeUnit, sort} from './encdef.schema';
import {axis} from './encdef.axis.schema';
import {typicalScale, ordinalOnlyScale} from './encdef.scale.schema';

// TODO: remove these when we know how to generate a schema
var Q = 'Q';
var O = 'O';
var N = 'N';
var T = 'T';

// TODO(#620) refer to vega schema
// var vgStackSchema = require('vega/src/transforms/Stack').schema;

export function getSupportedRole(encType) {
  return schema.properties.encoding.properties[encType].supportedRole;
};

// TODO move to VLUI
export var defaultTimeFn = 'month';

export var field = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    }
  }
};

var clone = util.duplicate;

var typicalField = merge(clone(field), {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: [N, O, Q, T]
    },
    aggregate: aggregate, // TODO: make reference
    timeUnit: timeUnit, // TODO: make reference
    bin: bin, // TODO: make reference
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
    timeUnit: timeUnit, // TODO: make reference
    bin: bin, // TODO: make reference
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
    axis: axis
  }
};

var sortMixin = {
  type: 'object',
  properties: {
    sort: sort
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

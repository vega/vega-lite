/// <reference path="../../typings/colorbrewer.d.ts"/>
import * as colorbrewer from 'colorbrewer';

import {merge} from './schemautil';
import {duplicate} from '../util';
import * as vlUtil from '../util';


import {axis} from './axis.schema';
import {FieldDef} from './fielddef.schema';
import {legend} from './legend.schema';
import {sort} from './sort.schema';
import {typicalField, onlyOrdinalField, stack} from './fielddef.schema';

export interface Encoding {
  x?: FieldDef;
  y?: FieldDef;
  row?: FieldDef;
  column?: FieldDef;
  color?: FieldDef;
  size?: FieldDef;
  shape?: FieldDef;
  detail?: FieldDef;
  text?: FieldDef;
}

// TODO: remove if possible
var requiredNameType = {
  required: ['name', 'type']
};

var x = merge(duplicate(typicalField), requiredNameType, {
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true},
  properties: {
    axis: axis,
    sort: sort
  }
});
var y = duplicate(x);

var facet = merge(duplicate(onlyOrdinalField), requiredNameType, {
  supportedMarktypes: {point: true, tick: true, bar: true, line: true, area: true, circle: true, square: true, text: true},
  properties: {
    axis: axis,
    sort: sort
  }
});

var row = merge(duplicate(facet), {
  properties: {
    // FIXME use this over config
    height: {
      type: 'number',
      minimum: 0,
      default: 150
    }
  }
});

var column = merge(duplicate(facet), {
  properties: {
    // FIXME use this over config
    width: {
      type: 'number',
      minimum: 0,
      default: 150
    }
  }
});

var size = merge(duplicate(typicalField), {
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

var color = merge(duplicate(typicalField), {
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

var shape = merge(duplicate(onlyOrdinalField), {
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

var detail = merge(duplicate(onlyOrdinalField), {
  supportedMarktypes: {point: true, tick: true, line: true, circle: true, square: true},
  properties: {
    sort: sort,
    stack: stack
  }
});

// we only put aggregated measure in pivot table
var text = merge(duplicate(typicalField), {
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
      default: '',  // auto
      description: 'The formatting pattern for text value.'+
                   'If not defined, this will be determined automatically'
    },
  }
});

export var encoding = {
  type: 'object',
  properties: {
    x: x,
    y: y,
    row: row,
    column: column,
    size: size,
    color: color,
    shape: shape,
    text: text,
    detail: detail
  }
};

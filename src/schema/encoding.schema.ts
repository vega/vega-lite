import {merge} from './schemautil';
import {duplicate} from '../util';
import * as vlUtil from '../util';


import {axis} from './axis.schema';
import {FieldDef} from './fielddef.schema';
import {legend} from './legend.schema';
import {sort} from './sort.schema';
import {typicalField, onlyOrdinalField} from './fielddef.schema';

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
  required: ['field', 'type']
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

var row = merge(duplicate(facet));
var column = merge(duplicate(facet));

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
    sort: sort
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

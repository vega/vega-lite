import {merge} from './schemautil';
import {duplicate} from '../util';


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
  properties: {
    scale: {// replacing default values for just these two axes
      properties: {
        padding: {default: 1},
        bandWidth: {default: 21}
      }
    },
    axis: axis,
    sort: sort
  }
});

var y = duplicate(x);

var facet = merge(duplicate(onlyOrdinalField), requiredNameType, {
  properties: {
    axis: axis,
    sort: sort
  }
});

var row = merge(duplicate(facet));
var column = merge(duplicate(facet));

var size = merge(duplicate(typicalField), {
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
  properties: {
    legend: legend,
    sort: sort,
    value: {
      type: 'string',
      role: 'color',
      default: '#4682b4',
      description: 'Color to be used for marks.'
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
  properties: {
    legend: legend,
    sort: sort,
    value: {
      type: 'string',
      enum: ['circle', 'square', 'cross', 'diamond', 'triangle-up', 'triangle-down'],
      default: 'circle',
      description: 'Mark to be used.'
    }
  }
});

var detail = merge(duplicate(onlyOrdinalField), {
  properties: {
    sort: sort
  }
});

// we only put aggregated measure in pivot table
var text = merge(duplicate(typicalField), {
  properties: {
    sort: sort,
    value: {
      type: 'string',
      default: 'Abc'
    }
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

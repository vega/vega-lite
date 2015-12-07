import {Model} from './Model';
import {X, Y, COLOR, TEXT, SIZE, SHAPE, DETAIL} from '../channel';
import {AREA, BAR, LINE, TEXT as TEXTMARKS} from '../mark';
import {QUANTITATIVE} from '../type';
import {imputeTransform, stackTransform} from './stack';

/* mapping from vega-lite's mark types to vega's mark types */
const MARKTYPES_MAP = {
  bar: 'rect',
  tick: 'rect',
  point: 'symbol',
  line: 'line',
  area: 'area',
  text: 'text',
  circle: 'symbol',
  square: 'symbol'
};

export function compileMarks(model: Model): any[] {
  const mark = model.mark();
  if (mark === LINE || mark === AREA) {
    // For Line and Area, we sort values based on dimension by default
    // For line, a special config "sortLineBy" is allowed
    let sortBy = mark === LINE ? model.config('sortLineBy') : undefined;
    if (!sortBy) {
      const sortField = (model.isMeasure(X) && model.isDimension(Y)) ? Y : X;
      sortBy = '-' + model.field(sortField);
    }

    let pathMarks: any = {
      type: MARKTYPES_MAP[mark],
      from: {
        // from.data might be added later for non-facet, single group line/area
        transform: [{ type: 'sort', by: sortBy }]
      },
      properties: {
        update: properties[mark](model)
      }
    };

    // FIXME is there a case where area requires impute without stacking?

    const details = detailFields(model);
    if (details.length > 0) { // have level of details - need to facet line into subgroups
      const facetTransform = { type: 'facet', groupby: details };
      const transform = mark === AREA && model.stack() ?
        // For stacked area, we need to impute missing tuples and stack values
        [imputeTransform(model), stackTransform(model), facetTransform] :
        [facetTransform];

      return [{
        name: mark + '-facet',
        type: 'group',
        from: {
          // from.data might be added later for non-facet charts
          transform: transform
        },
        properties: {
          update: {
            width: { field: { group: 'width' } },
            height: { field: { group: 'height' } }
          }
        },
        marks: [pathMarks]
      }];
    } else {
      return [pathMarks];
    }
  } else { // other mark type
    let marks = []; // TODO: vgMarks
    if (mark === TEXTMARKS && model.has(COLOR)) {
      // add background to 'text' marks if has color
      marks.push({
        type: 'rect',
        properties: { update: properties.textBackground(model) }
      });
    }

    let mainDef: any = {
      // TODO add name
      type: MARKTYPES_MAP[mark],
      properties: {
        update: properties[mark](model)
      }
    };
    const stack = model.stack();
    if (mark === BAR && stack) {
      mainDef.from = {
        transform: [stackTransform(model)]
      };
    }
    marks.push(mainDef);

    // if (model.has(LABEL)) {
    //   // TODO: add label by type here
    // }

    return marks;
  }
}



function applyMarksConfig(marksProperties, marksConfig, propsList) {
  propsList.forEach(function(property) {
    const value = marksConfig[property];
    if (value !== undefined) {
      marksProperties[property] = { value: value };
    }
  });
}

/**
 * Returns list of detail fields (for 'color', 'shape', or 'detail' channels)
 * that the model's spec contains.
 */
function detailFields(model: Model): string[] {
  return [COLOR, DETAIL, SHAPE].reduce(function(details, channel) {
    if (model.has(channel) && !model.fieldDef(channel).aggregate) {
      details.push(model.field(channel));
    }
    return details;
  }, []);
}

export namespace properties {
  export function bar(model: Model) {
    const stack = model.stack();

    // FIXME(#724) apply orient from config if applicable
    // TODO Use Vega's marks properties interface
    var p: any = {};

    // x's and width
    if (stack && X === stack.fieldChannel) {
      p.x = {
        scale: X,
        field: model.field(X) + '_start'
      };
      p.x2 = {
        scale: X,
        field: model.field(X) + '_end'
      };
    } else if (model.fieldDef(X).bin) {
      p.x = {
        scale: X,
        field: model.field(X, { binSuffix: '_start' }),
        offset: 1
      };
      p.x2 = {
        scale: X,
        field: model.field(X, { binSuffix: '_end' })
      };
    } else if (model.isMeasure(X)) {
      p.x = {
        scale: X,
        field: model.field(X)
      };
      if (!model.has(Y) || model.isDimension(Y)) {
        p.x2 = { value: 0 };
      }
    } else {
      if (model.has(X)) { // is ordinal
        p.xc = {
          scale: X,
          field: model.field(X)
        };
      } else {
        p.x = { value: 0, offset: model.config('singleBarOffset') };
      }
    }

    // width
    if (!p.x2) {
      if (!model.has(X) || model.isOrdinalScale(X)) { // no X or X is ordinal
        if (model.has(SIZE)) {
          p.width = {
            scale: SIZE,
            field: model.field(SIZE)
          };
        } else {
          // FIXME consider using band: true here
          p.width = {
            value: model.fieldDef(X).scale.bandWidth,
            offset: -1
          };
        }
      } else { // X is Quant or Time Scale
        p.width = { value: 2 };
      }
    }

    // y's & height
    if (stack && Y === stack.fieldChannel) {
      p.y = {
        scale: Y,
        field: model.field(Y) + '_start'
      };
      p.y2 = {
        scale: Y,
        field: model.field(Y) + '_end'
      };
    } else if (model.fieldDef(Y).bin) {
      p.y = {
        scale: Y,
        field: model.field(Y, { binSuffix: '_start' })
      };
      p.y2 = {
        scale: Y,
        field: model.field(Y, { binSuffix: '_end' }),
        offset: 1
      };
    } else if (model.isMeasure(Y)) {
      p.y = {
        scale: Y,
        field: model.field(Y)
      };
      p.y2 = { field: { group: 'height' } };
    } else {
      if (model.has(Y)) { // is ordinal
        p.yc = {
          scale: Y,
          field: model.field(Y)
        };
      } else {
        p.y2 = {
          field: { group: 'height' },
          offset: -model.config('singleBarOffset')
        };
      }

      if (model.has(SIZE)) {
        p.height = {
          scale: SIZE,
          field: model.field(SIZE)
        };
      } else {
        // FIXME: band:true?
        p.height = {
          value: model.fieldDef(Y).scale.bandWidth,
          offset: -1
        };
      }
    }

    // fill
    if (model.has(COLOR)) {
      p.fill = {
        scale: COLOR,
        field: model.field(COLOR)
      };
    } else {
      p.fill = { value: model.fieldDef(COLOR).value };
    }

    // opacity
    var opacity = model.markOpacity();
    if (opacity) { p.opacity = { value: opacity }; };

    return p;
  }

  export function point(model: Model) {
    // TODO Use Vega's marks properties interface
    var p: any = {};
    const marksConfig = model.config('marks');

    // x
    if (model.has(X)) {
      p.x = {
        scale: X,
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else if (!model.has(X)) {
      p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: Y,
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else if (!model.has(Y)) {
      p.y = { value: model.fieldDef(Y).scale.bandWidth / 2 };
    }

    // size
    if (model.has(SIZE)) {
      p.size = {
        scale: SIZE,
        field: model.field(SIZE)
      };
    } else if (!model.has(SIZE)) {
      p.size = { value: model.fieldDef(SIZE).value };
    }

    // shape
    if (model.has(SHAPE)) {
      p.shape = {
        scale: SHAPE,
        field: model.field(SHAPE)
      };
    } else if (!model.has(SHAPE)) {
      p.shape = { value: model.fieldDef(SHAPE).value };
    }

    // fill or stroke
    if (marksConfig.filled) {
      if (model.has(COLOR)) {
        p.fill = {
          scale: COLOR,
          field: model.field(COLOR)
        };
      } else if (!model.has(COLOR)) {
        p.fill = { value: model.fieldDef(COLOR).value };
      }
    } else {
      if (model.has(COLOR)) {
        p.stroke = {
          scale: COLOR,
          field: model.field(COLOR)
        };
      } else if (!model.has(COLOR)) {
        p.stroke = { value: model.fieldDef(COLOR).value };
      }
      p.strokeWidth = { value: model.config('marks').strokeWidth };
    }

    // opacity
    const opacity = model.markOpacity();
    if (opacity) { p.opacity = { value: opacity }; };

    return p;
  }

  export function line(model: Model) {
    // TODO Use Vega's marks properties interface
    var p: any = {};

    // x
    if (model.has(X)) {
      p.x = {
        scale: X,
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else if (!model.has(X)) {
      p.x = { value: 0 };
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: Y,
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else if (!model.has(Y)) {
      p.y = { field: { group: 'height' } };
    }

    // stroke
    if (model.has(COLOR)) {
      p.stroke = {
        scale: COLOR,
        field: model.field(COLOR)
      };
    } else if (!model.has(COLOR)) {
      p.stroke = { value: model.fieldDef(COLOR).value };
    }

    // opacity
    var opacity = model.markOpacity();
    if (opacity) { p.opacity = { value: opacity }; };

    p.strokeWidth = { value: model.config('marks').strokeWidth };

    applyMarksConfig(p, model.config('marks'), ['interpolate', 'tension']);

    return p;
  }

  // TODO(#694): optimize area's usage with bin
  export function area(model: Model) {
    const stack = model.stack();

    // FIXME(#724): apply orient properties

    // TODO Use Vega's marks properties interface
    var p: any = {};

    // x
    if (stack && X === stack.fieldChannel) {
      p.x = {
        scale: X,
        field: model.field(X) + '_start'
      };
      p.x2 = {
        scale: X,
        field: model.field(X) + '_end'
      };
    } else if (model.isMeasure(X)) {
      p.x = { scale: X, field: model.field(X) };
      if (model.isDimension(Y)) {
        p.x2 = {
          scale: X,
          value: 0
        };
        p.orient = { value: 'horizontal' };
      }
    } else if (model.has(X)) {
      p.x = {
        scale: X,
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else {
      p.x = { value: 0 };
    }

    // y
    if (stack && Y === stack.fieldChannel) {
      p.y = {
        scale: Y,
        field: model.field(Y) + '_start'
      };
      p.y2 = {
        scale: Y,
        field: model.field(Y) + '_end'
      };
    } else if (model.isMeasure(Y)) {
      p.y = {
        scale: Y,
        field: model.field(Y)
      };
      p.y2 = {
        scale: Y,
        value: 0
      };
    } else if (model.has(Y)) {
      p.y = {
        scale: Y,
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else {
      p.y = { field: { group: 'height' } };
    }

    // fill
    if (model.has(COLOR)) {
      p.fill = {
        scale: COLOR,
        field: model.field(COLOR)
      };
    } else if (!model.has(COLOR)) {
      p.fill = { value: model.fieldDef(COLOR).value };
    }

    // opacity
    var opacity = model.markOpacity();
    if (opacity) { p.opacity = { value: opacity }; };

    applyMarksConfig(p, model.config('marks'), ['interpolate', 'tension']);

    return p;
  }

  export function tick(model: Model) {
    // TODO Use Vega's marks properties interface
    // FIXME are /3 , /1.5 divisions here correct?
    var p: any = {};

    // x
    if (model.has(X)) {
      p.x = {
        scale: X,
        field: model.field(X, { binSuffix: '_mid' })
      };
      if (model.isDimension(X)) {
        p.x.offset = -model.fieldDef(X).scale.bandWidth / 3;
      }
    } else if (!model.has(X)) {
      p.x = { value: 0 };
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: Y,
        field: model.field(Y, { binSuffix: '_mid' })
      };
      if (model.isDimension(Y)) {
        p.y.offset = -model.fieldDef(Y).scale.bandWidth / 3;
      }
    } else if (!model.has(Y)) {
      p.y = { value: 0 };
    }

    // width
    if (!model.has(X) || model.isDimension(X)) {
      // TODO(#694): optimize tick's width for bin
      p.width = { value: model.fieldDef(X).scale.bandWidth / 1.5 };
    } else {
      p.width = { value: 1 };
    }

    // height
    if (!model.has(Y) || model.isDimension(Y)) {
      // TODO(#694): optimize tick's height for bin
      p.height = { value: model.fieldDef(Y).scale.bandWidth / 1.5 };
    } else {
      p.height = { value: 1 };
    }

    // fill
    if (model.has(COLOR)) {
      p.fill = {
        scale: COLOR,
        field: model.field(COLOR)
      };
    } else {
      p.fill = { value: model.fieldDef(COLOR).value };
    }

    // opacity
    var opacity = model.markOpacity();
    if (opacity) { p.opacity = { value: opacity }; };

    return p;
  }

  function filled_point_props(shape) {
    return function(model: Model) {
      // TODO Use Vega's marks properties interface
      var p: any = {};

      // x
      if (model.has(X)) {
        p.x = {
          scale: X,
          field: model.field(X, { binSuffix: '_mid' })
        };
      } else if (!model.has(X)) {
        p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
      }

      // y
      if (model.has(Y)) {
        p.y = {
          scale: Y,
          field: model.field(Y, { binSuffix: '_mid' })
        };
      } else if (!model.has(Y)) {
        p.y = { value: model.fieldDef(Y).scale.bandWidth / 2 };
      }

      // size
      if (model.has(SIZE)) {
        p.size = {
          scale: SIZE,
          field: model.field(SIZE)
        };
      } else if (!model.has(X)) {
        p.size = { value: model.fieldDef(SIZE).value };
      }

      // shape
      p.shape = { value: shape };

      // fill
      if (model.has(COLOR)) {
        p.fill = {
          scale: COLOR,
          field: model.field(COLOR)
        };
      } else if (!model.has(COLOR)) {
        p.fill = { value: model.fieldDef(COLOR).value };
      }

      // opacity
      var opacity = model.markOpacity();
      if (opacity) { p.opacity = { value: opacity }; };

      return p;
    };
  }

  export const circle = filled_point_props('circle');
  export const square = filled_point_props('square');

  export function textBackground(model: Model) {
    return {
      x: { value: 0 },
      y: { value: 0 },
      width: { field: { group: 'width' } },
      height: { field: { group: 'height' } },
      fill: { scale: COLOR, field: model.field(COLOR) }
    };
  }

  export function text(model: Model) {
    // TODO Use Vega's marks properties interface
    let p: any = {};
    const fieldDef = model.fieldDef(TEXT);
    const marksConfig = model.config('marks');

    // x
    if (model.has(X)) {
      p.x = {
        scale: X,
        field: model.field(X, { binSuffix: '_mid' })
      };
    } else if (!model.has(X)) {
      if (model.has(TEXT) && model.fieldDef(TEXT).type === QUANTITATIVE) {
        // TODO: make this -5 offset a config
        p.x = { field: { group: 'width' }, offset: -5 };
      } else {
        p.x = { value: model.fieldDef(X).scale.bandWidth / 2 };
      }
    }

    // y
    if (model.has(Y)) {
      p.y = {
        scale: Y,
        field: model.field(Y, { binSuffix: '_mid' })
      };
    } else if (!model.has(Y)) {
      p.y = { value: model.fieldDef(Y).scale.bandWidth / 2 };
    }

    // size
    if (model.has(SIZE)) {
      p.fontSize = {
        scale: SIZE,
        field: model.field(SIZE)
      };
    } else if (!model.has(SIZE)) {
      p.fontSize = { value: marksConfig.fontSize };
    }

    // fill
    // TODO: consider if color should just map to fill instead?

    // opacity
    var opacity = model.markOpacity();
    if (opacity) { p.opacity = { value: opacity }; };

    // text
    if (model.has(TEXT)) {
      if (model.fieldDef(TEXT).type === QUANTITATIVE) {
        // TODO: revise this line
        var numberFormat = marksConfig.format !== undefined ?
          marksConfig.format : model.numberFormat(TEXT);

        p.text = {
          template: '{{' + model.field(TEXT, { datum: true }) +
          ' | number:\'' + numberFormat + '\'}}'
        };
      } else {
        p.text = { field: model.field(TEXT) };
      }
    } else {
      p.text = { value: fieldDef.value };
    }

    applyMarksConfig(p, marksConfig,
      ['angle', 'align', 'baseline', 'dx', 'dy', 'fill', 'font', 'fontWeight',
        'fontStyle', 'radius', 'theta']);

    return p;
  }
}

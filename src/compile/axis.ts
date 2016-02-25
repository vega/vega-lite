import {AxisOrient} from '../axis';
import {COLUMN, ROW, X, Y, Channel} from '../channel';
import {title as fieldDefTitle, isDimension} from '../fielddef';
import {NOMINAL, ORDINAL, TEMPORAL} from '../type';
import {contains, extend, truncate} from '../util';

import {formatMixins} from './common';
import {Model} from './Model';

// https://github.com/Microsoft/TypeScript/blob/master/doc/spec.md#11-ambient-declarations
declare let exports;

/**
 * Make an inner axis for showing grid for shared axis.
 */
export function compileInnerAxis(channel: Channel, model: Model) {
  const isCol = channel === COLUMN,
    isRow = channel === ROW,
    type = isCol ? 'x' : isRow ? 'y': channel;

  // TODO: support adding ticks as well

  // TODO: replace any with Vega Axis Interface
  let def = {
    type: type,
    scale: model.scaleName(channel),
    grid: true,
    tickSize: 0,
    properties: {
      labels: {
        text: {value:''}
      },
      axis: {
        stroke: {value: 'transparent'}
      }
    }
  };

  const axis = model.axis(channel);

  ['layer', 'ticks', 'values', 'subdivide'].forEach(function(property) {
    let method: (model: Model, channel: Channel, def:any)=>any;

    const value = (method = exports[property]) ?
                  // calling axis.format, axis.grid, ...
                  method(model, channel, def) :
                  axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  return def;
}

export function compileAxis(channel: Channel, model: Model) {
  const isCol = channel === COLUMN,
    isRow = channel === ROW,
    type = isCol ? 'x' : isRow ? 'y': channel;

  const axis = model.axis(channel);

  // TODO: replace any with Vega Axis Interface
  let def: any = {
    type: type,
    scale: model.scaleName(channel)
  };

  // format mixins (add format and formatType)
  extend(def, formatMixins(model, channel, model.axis(channel).format));

  // 1.2. Add properties
  [
    // a) properties with special rules (so it has axis[property] methods) -- call rule functions
    'grid', 'layer', 'offset', 'orient', 'tickSize', 'ticks', 'title',
    // b) properties without rules, only produce default values in the schema, or explicit value if specified
    'tickPadding', 'tickSize', 'tickSizeMajor', 'tickSizeMinor', 'tickSizeEnd',
    'titleOffset', 'values', 'subdivide'
  ].forEach(function(property) {
    let method: (model: Model, channel: Channel, def:any)=>any;

    const value = (method = exports[property]) ?
                  // calling axis.format, axis.grid, ...
                  method(model, channel, def) :
                  axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const props = model.axis(channel).properties || {};

  [
    'axis', 'labels', // have special rules
    'grid', 'title', 'ticks', 'majorTicks', 'minorTicks' // only default values
  ].forEach(function(group) {
    const value = properties[group] ?
      properties[group](model, channel, props[group] || {}, def) :
      props[group];
    if (value !== undefined) {
      def.properties = def.properties || {};
      def.properties[group] = value;
    }
  });

  return def;
}

export function offset(model: Model, channel: Channel) {
  return model.axis(channel).offset;
}

// TODO: we need to refactor this method after we take care of config refactoring
/**
 * Default rules for whether to show a grid should be shown for a channel.
 * If `grid` is unspecified, the default value is `true` for ordinal scales that are not binned
 */
export function gridShow(model: Model, channel: Channel) {
  const grid = model.axis(channel).grid;
  if (grid !== undefined) {
    return grid;
  }

  return !model.isOrdinalScale(channel) && !model.fieldDef(channel).bin;
}

export function grid(model: Model, channel: Channel) {
  if (channel === ROW || channel === COLUMN) {
    // never apply grid for ROW and COLUMN since we manually create rule-group for them
    return undefined;
  }

  return gridShow(model, channel) && (
    // TODO refactor this cleanly -- essentially the condition below is whether
    // the axis is a shared / union axis.
    (channel === Y || channel === X) && !(model.has(COLUMN) || model.has(ROW))
  );
}

export function layer(model: Model, channel: Channel, def) {
  const layer = model.axis(channel).layer;
  if (layer !== undefined) {
    return layer;
  }
  if (def.grid) {
    // if grid is true, need to put layer on the back so that grid is behind marks
    return 'back';
  }
  return undefined; // otherwise return undefined and use Vega's default.
};

export function orient(model: Model, channel: Channel) {
  const orient = model.axis(channel).orient;
  if (orient) {
    return orient;
  } else if (channel === COLUMN) {
    // FIXME test and decide
    return AxisOrient.TOP;
  } else if (channel === ROW) {
    if (model.has(Y) && model.axis(Y).orient !== AxisOrient.RIGHT) {
      return AxisOrient.RIGHT;
    }
  }
  return undefined;
}

export function ticks(model: Model, channel: Channel) {
  const ticks = model.axis(channel).ticks;
  if (ticks !== undefined) {
    return ticks;
  }

  // FIXME depends on scale type too
  if (channel === X && !model.fieldDef(channel).bin) {
    // Vega's default ticks often lead to a lot of label occlusion on X without 90 degree rotation
    return 5;
  }

  return undefined;
}

export function tickSize(model: Model, channel: Channel) {
  const tickSize = model.axis(channel).tickSize;
  if (tickSize !== undefined) {
    return tickSize;
  }
  return undefined;
}


export function title(model: Model, channel: Channel) {
  const axis = model.axis(channel);
  if (axis.title !== undefined) {
    return axis.title;
  }

  // if not defined, automatically determine axis title from field def
  const fieldTitle = fieldDefTitle(model.fieldDef(channel));

  let maxLength;
  if (axis.titleMaxLength) {
    maxLength = axis.titleMaxLength;
  } else if (channel === X && !model.isOrdinalScale(X)) {
    // For non-ordinal scale, we know cell size at compile time, we can guess max length
    maxLength = model.cellWidth() / model.axis(X).characterWidth;
  } else if (channel === Y && !model.isOrdinalScale(Y)) {
    // For non-ordinal scale, we know cell size at compile time, we can guess max length
    maxLength = model.cellHeight() / model.axis(Y).characterWidth;
  }
  // FIXME: we should use template to truncate instead
  return maxLength ? truncate(fieldTitle, maxLength) : fieldTitle;
}

export namespace properties {
  export function axis(model: Model, channel: Channel, axisPropsSpec, def) {
    const axis = model.axis(channel);

    return extend(
      axis.axisWidth !== undefined ?
        { strokeWidth: {value: axis.axisWidth} } :
        {},
      axisPropsSpec || {}
    );
  }

  export function labels(model: Model, channel: Channel, labelsSpec, def) {
    const fieldDef = model.fieldDef(channel);
    const axis = model.axis(channel);

    if (!axis.labels) {
      return extend({
        text: ''
      }, labelsSpec);
    }

    if (contains([NOMINAL, ORDINAL], fieldDef.type) && axis.labelMaxLength) {
      // TODO replace this with Vega's labelMaxLength once it is introduced
      labelsSpec = extend({
        text: {
          template: '{{ datum.data | truncate:' + axis.labelMaxLength + '}}'
        }
      }, labelsSpec || {});
    }

    // Label Angle
    if (axis.labelAngle !== undefined) {
      labelsSpec.angle = {value: axis.labelAngle};
    } else {
      // auto rotate for X and Row
      if (channel === X && (isDimension(fieldDef) || fieldDef.type === TEMPORAL)) {
        labelsSpec.angle = {value: 270};
      } else if (channel === ROW && model.has(X)) {
        labelsSpec.angle = {value: def.orient === 'left' ? 270 : 90};
      }
    }

    if (axis.labelAlign !== undefined) {
      labelsSpec.align = {value: axis.labelAlign};
    } else {
      // Auto set align if rotated
      // TODO: consider other value besides 270, 90
      if (labelsSpec.angle) {
        if (labelsSpec.angle.value === 270) {
          labelsSpec.align = {
            value: def.orient === 'top' ? 'left':
                   def.type === 'x' ? 'right' :
                   'center'
          };
        } else if (labelsSpec.angle.value === 90) {
          labelsSpec.align = {value: 'center'};
        }
      }
    }

    if (axis.labelBaseline !== undefined) {
      labelsSpec.baseline = {value: axis.labelBaseline};
    } else {
      if (labelsSpec.angle) {
        // Auto set baseline if rotated
        // TODO: consider other value besides 270, 90
        if (labelsSpec.angle.value === 270) {
          labelsSpec.baseline = {value: def.type === 'x' ? 'middle' : 'bottom'};
        } else if (labelsSpec.angle.value === 90) {
          labelsSpec.baseline = {value: 'bottom'};
        }
      }
    }

    return labelsSpec || undefined;
  }
}

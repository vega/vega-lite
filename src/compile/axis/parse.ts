import {Axis} from '../../axis';
import {Channel} from '../../channel';
import {VgAxis} from '../../vega.schema';

import * as encode from './encode';
import * as rules from './rules';

import {Model} from '../model';
import {Dict, contains, keys} from '../../util';

export function parseAxisComponent(model: Model, axisChannels: Channel[]): Dict<VgAxis[]> {
  return axisChannels.reduce(function(axis, channel) {
    const axes: VgAxis[] = [];
    if (model.axis(channel)) {
      const main = parseMainAxis(channel, model);
      if (main && isVisibleAxis(main)) {
        axes.push(main);
      }

      const grid = parseGridAxis(channel, model);
      if (grid && isVisibleAxis(grid)) {
        axes.push(grid);
      }

      if (axes.length > 0) {
        axis[channel] = axes;
      }
    }
    return axis;
  }, {});
}

/**
 * Return if an axis is visible (shows at least one part of the axis).
 */
function isVisibleAxis(axis: VgAxis) {
  if (axis.domain !== false || axis.grid !== false || axis.label !== false || axis.tick !== false || axis.title) {
    return true;
  }
  return false;
}

/**
 * Make an inner axis for showing grid for shared axis.
 */
export function parseGridAxis(channel: Channel, model: Model): VgAxis {
  // FIXME: support adding ticks for grid axis that are inner axes of faceted plots.
  return parseAxis(channel, model, true);
}

const axisPartFlag = {
  domain: 'domain',
  grid: 'grid',
  labels: 'label',
  ticks: 'tick',
  title: 'title'
};

export function parseMainAxis(channel: Channel, model: Model) {
  return parseAxis(channel, model, false);
}

function parseAxis(channel: Channel, model: Model, isGridAxis: boolean): VgAxis {
  const axis = model.axis(channel);

  let def: VgAxis = {
    scale: model.scaleName(channel)
  };

  // 1.2. Add properties
  [
    // a) properties with special rules (so it has axis[property] methods) -- call rule functions
    'domain', 'format', 'label', 'grid', 'gridScale', 'orient', 'tick', 'tickSize', 'tickCount',  'title', 'values', 'zindex',
    // b) properties without rules, only produce default values in the schema, or explicit value if specified
     'offset', 'subdivide', 'tickPadding', 'tickSize', 'tickSizeEnd', 'tickSizeMajor', 'tickSizeMinor', 'titleOffset'
  ].forEach(function(property) {
    const value = getSpecifiedOrDefaultValue(property, axis, channel, model, isGridAxis);
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add guide encode definition groups
  const encodeSpec = model.axis(channel).encode || {};
  [
    'domain', 'grid', 'labels', 'ticks', 'title'
  ].forEach(function(part) {
    if (contains([false, null], def[axisPartFlag[part]])) {
      // No need to create encode for a disabled part.
      return;
    }
    const value = encode[part](model, channel, encodeSpec[part] || {}, def);
    if (value !== undefined && keys(value).length > 0) {
      def.encode = def.encode || {};
      def.encode[part] = {update: value};
    }
  });

  return def;
}

function getSpecifiedOrDefaultValue(property: string, specifiedAxis: Axis, channel: Channel, model: Model, isGridAxis: boolean) {
  const fieldDef = model.fieldDef(channel);
  const config = model.config();

  switch (property) {
    case 'domain':
    case 'label':
    case 'tick':
      return isGridAxis ? false : specifiedAxis[property];
    case 'format':
      return rules.format(specifiedAxis, channel, fieldDef, config);
    case 'grid':
      return rules.grid(model, channel, isGridAxis); // FIXME: refactor this
    case 'gridScale':
      return rules.gridScale(model, channel, isGridAxis);
    case 'orient':
      return rules.orient(specifiedAxis, channel);
    case 'tickCount':
      return rules.tickCount(specifiedAxis, channel, fieldDef); // TODO: scaleType
    case 'title':
      return rules.title(specifiedAxis, fieldDef, config, isGridAxis);
    case 'values':
      return rules.values(specifiedAxis);
    case 'zindex':
      return rules.zindex(specifiedAxis, isGridAxis);
  }
  // Otherwise, return specified property.
  return specifiedAxis[property];
}

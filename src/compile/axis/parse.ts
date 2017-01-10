import {Channel} from '../../channel';
import {VgAxis} from '../../vega.schema';

import * as encode from './encode';
import * as rules from './rules';

import {Model} from '../model';
import {Dict, keys} from '../../util';

export function parseAxisComponent(model: Model, axisChannels: Channel[]): Dict<VgAxis> {
  return axisChannels.reduce(function(axis, channel) {
    if (model.axis(channel)) {
      axis[channel] = parseAxis(channel, model);
    }
    return axis;
  }, {} as Dict<VgAxis>);
}

/**
 * Make an inner axis for showing grid for shared axis.
 */
export function parseInnerAxis(channel: Channel, model: Model): VgAxis {
  // TODO: support adding ticks as well

  let def: VgAxis = {
    orient: channel === 'x' ? 'bottom' : 'left',
    scale: model.scaleName(channel),
    grid: true,
    domain: false,
    tick: false,
    label: false
  };

  const axis = model.axis(channel);

  // FIXME: audit if we have checked all relevant properties here.
  ['gridScale', 'tickCount', 'values', 'subdivide', 'zindex'].forEach(function(property) {
    let method: (model: Model, channel: Channel, def:any)=>any;

    const value = (method = rules[property]) ?
                  // calling axis.format, axis.grid, ...
                  method(model, channel, def) :
                  axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  const props = model.axis(channel).encode || {};

  // For now, only need to add grid properties here because innerAxis is only for rendering grid.
  // TODO: support add other properties for innerAxis
  ['grid'].forEach(function(group) {
    const value = encode[group] ?
      encode[group](model, channel, props[group] || {}, def) :
      props[group];
    if (value !== undefined && keys(value).length > 0) {
      def.encode = def.encode || {};
      def.encode[group] = {update: value};
    }
  });

  return def;
}

export function parseAxis(channel: Channel, model: Model): VgAxis {
  const axis = model.axis(channel);

  let def: VgAxis = {
    scale: model.scaleName(channel)
  };

  // 1.2. Add properties
  [
    // a) properties with special rules (so it has axis[property] methods) -- call rule functions
    'format', 'grid', 'gridScale', 'orient', 'tickSize', 'tickCount',  'title', 'values', 'zindex',
    // b) properties without rules, only produce default values in the schema, or explicit value if specified
    'domain', 'offset', 'subdivide', 'tick', 'tickPadding', 'tickSize', 'tickSizeEnd', 'tickSizeMajor', 'tickSizeMinor', 'titleOffset'
  ].forEach(function(property) {
    let method: (model: Model, channel: Channel, def:any)=>any;

    const value = (method = rules[property]) ?
                  // calling axis.format, axis.grid, ...
                  method(model, channel, def) :
                  axis[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const props = model.axis(channel).encode || {};

  [
    'domain', 'labels', // have special rules
    'grid', 'title', 'tickCount', 'majorTicks', 'minorTicks' // only default values
  ].forEach(function(group) {
    const value = encode[group] ?
      encode[group](model, channel, props[group] || {}, def) :
      props[group];
    if (value !== undefined && keys(value).length > 0) {
      def.encode = def.encode || {};
      def.encode[group] = {update: value};
    }
  });

  return def;
}

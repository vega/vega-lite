import {COLOR, SIZE, SHAPE, OPACITY, Channel} from '../../channel';
import {hasContinuousDomain} from '../../scale';
import {keys, Dict} from '../../util';
import {VgLegend} from '../../vega.schema';

import {numberFormat} from '../common';
import {BIN_LEGEND_SUFFIX} from '../scale/scale';
import {UnitModel} from '../unit';

import * as encode from './encode';
import * as rules from './rules';

/* tslint:disable:no-unused-variable */
// These imports exist so the TS compiler can name publicly exported members in
// The automatically created .d.ts correctly
import {Bin} from '../../bin';
/* tslint:enable:no-unused-variable */

export function parseLegendComponent(model: UnitModel): Dict<VgLegend> {
  return [COLOR, SIZE, SHAPE, OPACITY].reduce(function(legendComponent, channel) {
    if (model.legend(channel)) {
      legendComponent[channel] = parseLegend(model, channel);
    }
    return legendComponent;
  }, {} as Dict<VgLegend>);
}

function getLegendDefWithScale(model: UnitModel, channel: Channel): VgLegend {
  // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
  const suffix = model.fieldDef(channel).bin && hasContinuousDomain(model.scale(channel).type) ? BIN_LEGEND_SUFFIX : '';
  switch (channel) {
    case COLOR:
      const scale = model.scaleName(COLOR) + suffix;
      return model.config().mark.filled ? { fill: scale } : { stroke: scale };
    case SIZE:
      return { size: model.scaleName(SIZE) + suffix };
    case SHAPE:
      return { shape: model.scaleName(SHAPE) + suffix };
    case OPACITY:
      return { opacity: model.scaleName(OPACITY) + suffix };
  }
  return null;
}

export function parseLegend(model: UnitModel, channel: Channel): VgLegend {
  const fieldDef = model.fieldDef(channel);
  const legend = model.legend(channel);
  const config = model.config();

  let def: VgLegend = getLegendDefWithScale(model, channel);

  // 1.1 Add properties with special rules
  def.title = rules.title(legend, fieldDef, config);
  const format = numberFormat(fieldDef, legend.format, config, channel);
  if (format) {
    def.format = format;
  }
  const vals = rules.values(legend);
  if (vals) {
    def.values = vals;
  }
  const t = rules.type(legend, fieldDef, channel);
  if (t) {
    def.type = t;
  }

  // 1.2 Add properties without rules
  ['offset', 'orient'].forEach(function(property) {
    const value = legend[property];
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const encodeSpec = legend.encode || {};
  ['title', 'symbols', 'legend', 'labels'].forEach(function(part) {
    let value = encode[part] ?
      encode[part](fieldDef, encodeSpec[part], model, channel) : // apply rule
      encodeSpec[part]; // no rule -- just default values
    if (value !== undefined && keys(value).length > 0) {
      def.encode = def.encode || {};
      def.encode[part] = {update: value};
    }
  });

  return def;
}

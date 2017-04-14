import {Channel, COLOR, OPACITY, SHAPE, SIZE} from '../../channel';
import {Legend, LEGEND_PROPERTIES} from '../../legend';
import {Dict, keys} from '../../util';
import {VgLegend} from '../../vega.schema';

import {numberFormat} from '../common';
import {Model} from '../model';
import {UnitModel} from '../unit';

import * as encode from './encode';
import * as rules from './rules';

export function parseLegendComponent(model: UnitModel): Dict<VgLegend> {
  return [COLOR, SIZE, SHAPE, OPACITY].reduce(function(legendComponent, channel) {
    if (model.legend(channel)) {
      legendComponent[channel] = parseLegend(model, channel);
    }
    return legendComponent;
  }, {});
}

function getLegendDefWithScale(model: UnitModel, channel: Channel): VgLegend {
  // For binned field with continuous scale, use a special scale so we can overrride the mark props and labels
  switch (channel) {
    case COLOR:
      const scale = model.scaleName(COLOR);
      return model.markDef.filled ? {fill: scale} : {stroke: scale};
    case SIZE:
      return {size: model.scaleName(SIZE)};
    case SHAPE:
      return {shape: model.scaleName(SHAPE)};
    case OPACITY:
      return {opacity: model.scaleName(OPACITY)};
  }
  return null;
}

export function parseLegend(model: UnitModel, channel: Channel): VgLegend {
  const fieldDef = model.fieldDef(channel);
  const legend = model.legend(channel);

  const def: VgLegend = getLegendDefWithScale(model, channel);

  LEGEND_PROPERTIES.forEach(function(property) {
    const value = getSpecifiedOrDefaultValue(property, legend, channel, model);
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const encodeSpec = legend.encode || {};
  ['labels', 'legend', 'title', 'symbols'].forEach(function(part) {
    const value = encode[part] ?
      encode[part](fieldDef, encodeSpec[part], model, channel) : // apply rule
      encodeSpec[part]; // no rule -- just default values
    if (value !== undefined && keys(value).length > 0) {
      def.encode = def.encode || {};
      def.encode[part] = {update: value};
    }
  });

  return def;
}

function getSpecifiedOrDefaultValue(property: keyof VgLegend, specifiedLegend: Legend, channel: Channel, model: Model) {
  const fieldDef = model.fieldDef(channel);

  switch (property) {
    case 'format':
      return numberFormat(fieldDef, specifiedLegend.format, model.config, channel);
    case 'title':
      return rules.title(specifiedLegend, fieldDef, model.config);
    case 'values':
      return rules.values(specifiedLegend);
    case 'type':
      return rules.type(specifiedLegend, fieldDef.type, channel, model.scale(channel).type);
  }

  // Otherwise, return specified property.
  return specifiedLegend[property];
}


import {COLOR, SIZE, SHAPE, OPACITY, Channel} from '../../channel';
import {keys, Dict} from '../../util';
import {VgLegend} from '../../vega.schema';
import {Legend, LEGEND_PROPERTIES} from '../../legend';

import {Model} from '../model';
import {numberFormat} from '../common';
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

  let def: VgLegend = getLegendDefWithScale(model, channel);

  LEGEND_PROPERTIES.forEach(function(property) {
    const value = getSpecifiedOrDefaultValue(property, legend, channel, model);
    if (value !== undefined) {
      def[property] = value;
    }
  });

  // 2) Add mark property definition groups
  const encodeSpec = legend.encode || {};
  ['labels', 'legend', 'title', 'symbols'].forEach(function(part) {
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
      rules.type(specifiedLegend, fieldDef, channel);
  }

  // Otherwise, return specified property.
  return specifiedLegend[property];
}


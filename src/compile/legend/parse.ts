import {Channel, COLOR, NonspatialScaleChannel, OPACITY, SHAPE, SIZE} from '../../channel';
import {Legend, LEGEND_PROPERTIES} from '../../legend';
import {Dict, keys} from '../../util';
import {VgLegend, VgLegendEncode} from '../../vega.schema';
import {numberFormat} from '../common';
import {Model} from '../model';
import {UnitModel} from '../unit';
import {LegendComponent, LegendComponentIndex} from './component';
import * as encode from './encode';
import * as rules from './rules';


export function parseUnitLegend(model: UnitModel): LegendComponentIndex {
  return [COLOR, SIZE, SHAPE, OPACITY].reduce(function(legendComponent, channel) {
    if (model.legend(channel)) {
      legendComponent[channel] = parseLegendForChannel(model, channel);
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

export function parseLegendForChannel(model: UnitModel, channel: NonspatialScaleChannel): LegendComponent {
  const fieldDef = model.fieldDef(channel);
  const legend = model.legend(channel);

  const legendCmpt = new LegendComponent({}, getLegendDefWithScale(model, channel));

  LEGEND_PROPERTIES.forEach(function(property) {
    const value = getSpecifiedOrDefaultValue(property, legend, channel, model);
    if (value !== undefined) {
      const explicit = property === 'values' ?
        !!legend.values :  // specified legend.values is already respected, but may get transformed.
        value === legend[property];
      legendCmpt.set(property, value, explicit);
    }
  });

  // 2) Add mark property definition groups
  const legendEncoding = legend.encoding || {};
  const legendEncode = ['labels', 'legend', 'title', 'symbols'].reduce((e: VgLegendEncode, part) => {
    const value = encode[part] ?
      encode[part](fieldDef, legendEncoding[part], model, channel) : // apply rule
      legendEncoding[part]; // no rule -- just default values
    if (value !== undefined && keys(value).length > 0) {
      e[part] = {update: value};
    }
    return e;
  }, {} as VgLegendEncode);

  if (keys(legendEncode).length > 0) {
    legendCmpt.set('encode', legendEncode, !!legend.encoding);
  }

  return legendCmpt;
}

function getSpecifiedOrDefaultValue(property: keyof (Legend | VgLegend), specifiedLegend: Legend, channel: NonspatialScaleChannel, model: UnitModel) {
  const fieldDef = model.fieldDef(channel);

  switch (property) {
    case 'format':
      return numberFormat(fieldDef, specifiedLegend.format, model.config);
    case 'title':
      return rules.title(specifiedLegend, fieldDef, model.config);
    case 'values':
      return rules.values(specifiedLegend);
    case 'type':
      return rules.type(specifiedLegend, fieldDef.type, channel, model.getScaleComponent(channel).get('type'));
  }

  // Otherwise, return specified property.
  return specifiedLegend[property];
}


/**
 * Move legend from child up.
 */
export function moveSharedLegendUp(legendComponents: LegendComponentIndex, child: Model, channel: Channel) {
  // just use the first legend definition for each channel
  if (!legendComponents[channel]) {
    legendComponents[channel] = child.component.legends[channel];
  }
  delete child.component.legends[channel];
}

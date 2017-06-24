import {Channel, COLOR, NonspatialScaleChannel, OPACITY, SHAPE, SIZE} from '../../channel';
import {Legend, LEGEND_PROPERTIES, VG_LEGEND_PROPERTIES} from '../../legend';
import {ResolveMode} from '../../resolve';
import {Dict, keys} from '../../util';
import {VgLegend, VgLegendEncode} from '../../vega.schema';
import {numberFormat, titleMerger} from '../common';
import {Model} from '../model';
import {Explicit, makeImplicit} from '../split';
import {defaultTieBreaker, mergeValuesWithExplicit} from '../split';
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

export function parseNonUnitLegend(model: Model) {
  const legendComponent = model.component.legends = {};
  const legendResolveIndex: {[k in NonspatialScaleChannel]?: ResolveMode} = {};

  for (const child of model.children) {
    child.parseLegend();

    keys(child.component.legends).forEach((channel: NonspatialScaleChannel) => {
      if (model.resolve[channel].legend === 'shared' &&
          legendResolveIndex[channel] !== 'independent' &&
          model.component.scales[channel]) {
        // If default rule says shared and so far there is no conflict and the scale is merged,
        // We will try to merge and see if there is a conflict

        legendComponent[channel] = mergeLegendComponent(legendComponent[channel], child.component.legends[channel]);

        if (legendComponent[channel]) {
          // If merge return something, then there is no conflict.
          // Thus, we can set / preserve the resolve index to be shared.
          legendResolveIndex[channel] = 'shared';
        } else {
          // If merge returns nothing, there is a conflict and thus we cannot make the legend shared.
          legendResolveIndex[channel] = 'independent';
          delete legendComponent[channel];
        }
      } else {
        legendResolveIndex[channel] = 'independent';
      }
    });
  }

  keys(legendResolveIndex).forEach((channel: NonspatialScaleChannel) => {
    for (const child of model.children) {
      if (!child.component.legends[channel]) {
        // skip if the child does not have a particular legend
        return;
      }

      if (legendResolveIndex[channel] === 'shared') {
        // After merging shared legend, make sure to remove legend from child
        delete child.component.legends[channel];
      }
    }
  });
}

export function mergeLegendComponent(mergedLegend: LegendComponent, childLegend: LegendComponent) {
  if (!mergedLegend) {
    return childLegend.clone();
  }
  const mergedOrient = mergedLegend.getWithExplicit('orient');
  const childOrient = childLegend.getWithExplicit('orient');


  if (mergedOrient.explicit && childOrient.explicit && mergedOrient.value !== childOrient.value) {
    // TODO: throw warning if resolve is explicit (We don't have info about explicit/implicit resolve yet.)
    // Cannot merge due to inconsistent orient
    return undefined;
  }
  // Otherwise, let's merge
  for (const prop of VG_LEGEND_PROPERTIES) {
    const mergedValueWithExplicit = mergeValuesWithExplicit<VgLegend, any>(
      mergedLegend.getWithExplicit(prop),
      childLegend.getWithExplicit(prop),
      prop, 'legend',

      // Tie breaker function
      (v1: Explicit<any>, v2: Explicit<any>): any => {
        switch (prop) {
          case 'title':
            return titleMerger(v1, v2);
          case 'type':
            // There are only two types. If we have different types, then prefer symbol over gradient.
            return makeImplicit('symbol');
        }
        return defaultTieBreaker<VgLegend, any>(v1, v2, prop, 'legend');
      }
    );
    mergedLegend.setWithExplicit(prop, mergedValueWithExplicit);
  }
  return mergedLegend;
}

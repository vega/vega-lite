import {Channel, COLOR, NonPositionScaleChannel, OPACITY, SHAPE, SIZE} from '../../channel';
import {isFieldDef, title as fieldDefTitle} from '../../fielddef';
import {Legend, LEGEND_PROPERTIES, VG_LEGEND_PROPERTIES} from '../../legend';
import {GEOJSON} from '../../type';
import {deleteNestedProperty, keys} from '../../util';
import {VgLegend, VgLegendEncode} from '../../vega.schema';
import {getSpecifiedOrDefaultValue, numberFormat, titleMerger} from '../common';
import {isUnitModel, Model} from '../model';
import {parseGuideResolve} from '../resolve';
import {Explicit, makeImplicit} from '../split';
import {defaultTieBreaker, mergeValuesWithExplicit} from '../split';
import {UnitModel} from '../unit';
import {LegendComponent, LegendComponentIndex} from './component';
import * as encode from './encode';
import * as properties from './properties';


export function parseLegend(model: Model) {
  if (isUnitModel(model)) {
    model.component.legends = parseUnitLegend(model);
  } else {
    model.component.legends = parseNonUnitLegend(model);
  }
}

function parseUnitLegend(model: UnitModel): LegendComponentIndex {
  const {encoding} = model;
  return [COLOR, SIZE, SHAPE, OPACITY].reduce(function (legendComponent, channel) {
    const def = encoding[channel];
    if (model.legend(channel) && !(isFieldDef(def) && (channel === SHAPE && def.type === GEOJSON))) {
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

export function parseLegendForChannel(model: UnitModel, channel: NonPositionScaleChannel): LegendComponent {
  const fieldDef = model.fieldDef(channel);
  const legend = model.legend(channel);

  if (!model.getScaleComponent(channel)) {
    return undefined;
  }

  const legendCmpt = new LegendComponent({}, getLegendDefWithScale(model, channel));

  LEGEND_PROPERTIES.forEach(function(property) {
    const value = getProperty(property, legend, channel, model);
    if (value !== undefined) {
      const explicit = property === 'values' ?
        !!legend.values :  // specified legend.values is already respected, but may get transformed.
        value === legend[property];
      if (explicit || model.config.legend[property] === undefined) {
        legendCmpt.set(property, value, explicit);
      }
    }
  });

  // 2) Add mark property definition groups
  const legendEncoding = legend.encoding || {};
  const legendEncode = ['labels', 'legend', 'title', 'symbols', 'gradient'].reduce((e: VgLegendEncode, part) => {
    const value = encode[part] ?
      // TODO: replace legendCmpt with type is sufficient
      encode[part](fieldDef, legendEncoding[part], model, channel, legendCmpt.get('type')) : // apply rule
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

function getProperty(property: keyof (Legend | VgLegend), specifiedLegend: Legend, channel: NonPositionScaleChannel, model: UnitModel) {
  const fieldDef = model.fieldDef(channel);

  switch (property) {
    case 'format':
      // We don't include temporal field here as we apply format in encode block
      return numberFormat(fieldDef, specifiedLegend.format, model.config);
    case 'title':
      return getSpecifiedOrDefaultValue(specifiedLegend.title, fieldDefTitle(fieldDef, model.config));
    case 'values':
      return properties.values(specifiedLegend);
    case 'type':
      return getSpecifiedOrDefaultValue(specifiedLegend.type, properties.type(fieldDef.type, channel, model.getScaleComponent(channel).get('type')));
  }

  // Otherwise, return specified property.
  return specifiedLegend[property];
}

function parseNonUnitLegend(model: Model) {
  const {legends, resolve} = model.component;

  for (const child of model.children) {
    parseLegend(child);

    keys(child.component.legends).forEach((channel: NonPositionScaleChannel) => {
      resolve.legend[channel] = parseGuideResolve(model.component.resolve, channel);

      if (resolve.legend[channel] === 'shared') {
        // If the resolve says shared (and has not been overridden)
        // We will try to merge and see if there is a conflict

        legends[channel] = mergeLegendComponent(legends[channel], child.component.legends[channel]);

        if (!legends[channel]) {
          // If merge returns nothing, there is a conflict so we cannot make the legend shared.
          // Thus, mark legend as independent and remove the legend component.
          resolve.legend[channel] = 'independent';
          delete legends[channel];
        }
      }
    });
  }

  keys(legends).forEach((channel: NonPositionScaleChannel) => {
    for (const child of model.children) {
      if (!child.component.legends[channel]) {
        // skip if the child does not have a particular legend
        continue;
      }

      if (resolve.legend[channel] === 'shared') {
        // After merging shared legend, make sure to remove legend from child
        delete child.component.legends[channel];
      }
    }
  });
  return legends;
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
  let typeMerged = false;
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
            typeMerged = true;
            return makeImplicit('symbol');
        }
        return defaultTieBreaker<VgLegend, any>(v1, v2, prop, 'legend');
      }
    );
    mergedLegend.setWithExplicit(prop, mergedValueWithExplicit);
  }
  if (typeMerged) {
    if(((mergedLegend.implicit || {}).encode || {}).gradient) {
      deleteNestedProperty(mergedLegend.implicit, ['encode', 'gradient']);
    }
    if (((mergedLegend.explicit || {}).encode || {}).gradient) {
      deleteNestedProperty(mergedLegend.explicit, ['encode', 'gradient']);
    }
  }


  return mergedLegend;
}


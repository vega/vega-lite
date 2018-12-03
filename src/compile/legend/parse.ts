import {Legend as VgLegend, LegendEncode} from 'vega';
import {
  COLOR,
  FILL,
  FILLOPACITY,
  NonPositionScaleChannel,
  OPACITY,
  SHAPE,
  SIZE,
  STROKE,
  STROKEOPACITY,
  STROKEWIDTH
} from '../../channel';
import {FieldDef, isFieldDef, title as fieldDefTitle} from '../../fielddef';
import {Legend, LEGEND_PROPERTIES, VG_LEGEND_PROPERTIES} from '../../legend';
import {GEOJSON} from '../../type';
import {deleteNestedProperty, getFirstDefined, keys} from '../../util';
import {guideEncodeEntry, mergeTitleComponent, numberFormat} from '../common';
import {isUnitModel, Model} from '../model';
import {parseGuideResolve} from '../resolve';
import {assembleLegendSelection} from '../selection/assemble';
import {defaultTieBreaker, Explicit, makeImplicit, mergeValuesWithExplicit} from '../split';
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

// export function wrapLegendCondition(
//   model: UnitModel,
//   channelDef: ChannelDef<string>,
//   vgChannel: string,
//   refFn: (cDef: ChannelDef<string>) => VgValueRef
// ): VgEncodeEntry {
//   const condition = channelDef && channelDef.condition;
//   const valueRef = refFn(channelDef);
//   if (condition) {
//     const conditions = isArray(condition) ? condition : [condition];
//     const vgConditions = conditions.map(c => {
//       const conditionValueRef = refFn(c);
//       const test = isConditionalSelection(c)
//         ? assembleSelectionPredicate(model, c.selection)
//         : expression(model, c.test);
//       return {
//         test,
//         ...conditionValueRef
//       };
//     });
//     return {
//       [vgChannel]: [...vgConditions, ...(valueRef !== undefined ? [valueRef] : [])]
//     };
//   } else {
//     return valueRef !== undefined ? {[vgChannel]: valueRef} : {};
//   }
// }

export function wrapLegendCondition() {
  console.log('Heyya new func coming up');
}

function parseUnitLegend(model: UnitModel): LegendComponentIndex {
  const {encoding} = model;
  return [COLOR, FILL, STROKE, STROKEWIDTH, SIZE, SHAPE, OPACITY, FILLOPACITY, STROKEOPACITY].reduce(
    (legendComponent, channel) => {
      const def = encoding[channel];
      if (
        model.legend(channel) &&
        model.getScaleComponent(channel) &&
        !(isFieldDef(def) && (channel === SHAPE && def.type === GEOJSON))
      ) {
        legendComponent[channel] = parseLegendForChannel(model, channel);
      }
      return legendComponent;
    },
    {}
  );
}

function getLegendDefWithScale(model: UnitModel, channel: NonPositionScaleChannel): VgLegend {
  // For binned field with continuous scale, use a special scale so we can override the mark props and labels
  switch (channel) {
    case COLOR:
      const scale = model.scaleName(COLOR);
      return model.markDef.filled ? {fill: scale} : {stroke: scale};
    case FILL:
    case STROKE:
    case STROKEWIDTH:
    case SIZE:
    case SHAPE:
    case OPACITY:
    case FILLOPACITY:
    case STROKEOPACITY:
      return {[channel]: model.scaleName(channel)};
  }
}

function isExplicit<T extends string | number | object | boolean>(
  value: T,
  property: keyof VgLegend,
  legend: Legend,
  fieldDef: FieldDef<string>
) {
  switch (property) {
    case 'values':
      // specified legend.values is already respected, but may get transformed.
      return !!legend.values;
    case 'title':
      // title can be explicit if fieldDef.title is set
      if (property === 'title' && value === fieldDef.title) {
        return true;
      }
  }
  // Otherwise, things are explicit if the returned value matches the specified property
  return value === legend[property];
}

export function parseLegendForChannel(model: UnitModel, channel: NonPositionScaleChannel): LegendComponent {
  const fieldDef = model.fieldDef(channel);
  const legend = model.legend(channel);

  const legendCmpt = new LegendComponent({}, getLegendDefWithScale(model, channel));

  for (const property of LEGEND_PROPERTIES) {
    const value = getProperty(property, legend, channel, model);
    if (value !== undefined) {
      const explicit = isExplicit(value, property, legend, fieldDef);
      if (explicit || model.config.legend[property] === undefined) {
        legendCmpt.set(property, value, explicit);
      }
    }
  }

  const legendEncoding = legend.encoding || {};
  const legendEncode = ['labels', 'legend', 'title', 'symbols', 'gradient'].reduce(
    (e: LegendEncode, part) => {
      const legendEncodingPart = guideEncodeEntry(legendEncoding[part] || {}, model);
      let value = encode[part]
        ? encode[part](fieldDef, legendEncodingPart, model, channel, legendCmpt) // apply rule
        : legendEncodingPart; // no rule -- just default values

      if (value !== undefined && keys(value).length > 0) {
        e[part] = {update: value};
      }
      // Hacky for now
      if (part === 'labels' || (part === 'symbols' && assembleLegendSelection(model))) {
        if (!value) {
          value = {opacity: {value: 1}};
        }
        e[part] = {name: `${part}_legend`, interactive: true, update: value};
      }
      console.log('PART is', part, e[part], value);
      return e;
    },
    {} as LegendEncode
  );
  // Corresponding channel has a condition
  // const selectionName = model['encoding'][channel]['condition']['selection'];
  // if (selectionName) {
  //   // const test = assembleSelectionPredicate(model, selectionName);
  //   const test = `!(length(data("${selectionName}_legend_store"))) || indata("${selectionName}_legend_store", \'value\', datum.value)`;
  //   const opacityPredicate = {test, value: 0.7};
  //   const defaultValue = {value: 0.15};
  //   const newOp = [opacityPredicate, defaultValue];
  //   // const opacityUpdate = legendEncode.symbols.update.opacity;
  //   // legendEncode.symbols.update.opacity = isArray(opacityUpdate) ? opacityUpdate : [opacityUpdate];
  //   legendEncode.symbols.update.opacity = newOp;
  //   console.log(newOp, legendEncode.symbols.update.opacity);
  // }

  if (keys(legendEncode).length > 0) {
    legendCmpt.set('encode', legendEncode, !!legend.encoding);
  }

  return legendCmpt;
}

function getProperty<K extends keyof VgLegend>(
  property: K,
  specifiedLegend: Legend,
  channel: NonPositionScaleChannel,
  model: UnitModel
): VgLegend[K] {
  const fieldDef = model.fieldDef(channel);

  switch (property) {
    case 'format':
      // We don't include temporal field here as we apply format in encode block
      return numberFormat(fieldDef, specifiedLegend.format, model.config);
    case 'title':
      return fieldDefTitle(fieldDef, model.config, {allowDisabling: true}) || undefined;

    // TODO: enable when https://github.com/vega/vega/issues/1351 is fixed
    // case 'clipHeight':
    //   return getFirstDefined(specifiedLegend.clipHeight, properties.clipHeight(model.getScaleComponent(channel).get('type')));
    case 'labelOverlap':
      return getFirstDefined(
        specifiedLegend.labelOverlap,
        properties.labelOverlap(model.getScaleComponent(channel).get('type'))
      );
    case 'values':
      return properties.values(specifiedLegend, fieldDef);
  }

  // Otherwise, return specified property.
  return (specifiedLegend as VgLegend)[property];
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

export function mergeLegendComponent(mergedLegend: LegendComponent, childLegend: LegendComponent): LegendComponent {
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
      prop,
      'legend',

      // Tie breaker function
      (v1: Explicit<any>, v2: Explicit<any>): any => {
        switch (prop) {
          case 'title':
            return mergeTitleComponent(v1, v2);
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
    if (((mergedLegend.implicit || {}).encode || {}).gradient) {
      deleteNestedProperty(mergedLegend.implicit, ['encode', 'gradient']);
    }
    if (((mergedLegend.explicit || {}).encode || {}).gradient) {
      deleteNestedProperty(mergedLegend.explicit, ['encode', 'gradient']);
    }
  }

  return mergedLegend;
}

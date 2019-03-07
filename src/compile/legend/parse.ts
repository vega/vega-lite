import {Legend as VgLegend, LegendEncode, stringValue} from 'vega';
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
import {deleteNestedProperty, getFirstDefined, keys, varName} from '../../util';
import {guideEncodeEntry, mergeTitleComponent, numberFormat} from '../common';
import {isUnitModel, Model} from '../model';
import {parseGuideResolve} from '../resolve';
import {forEachSelection, LEGEND, STORE, VL_SELECTION_TEST} from '../selection';
import {defaultTieBreaker, Explicit, makeImplicit, mergeValuesWithExplicit} from '../split';
import {UnitModel} from '../unit';
import {InteractiveSelections, LegendComponent, LegendComponentIndex} from './component';
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
  let legendEncode = ['labels', 'legend', 'title', 'symbols', 'gradient'].reduce(
    (e: LegendEncode, part) => {
      const legendEncodingPart = guideEncodeEntry(legendEncoding[part] || {}, model);
      const value = encode[part]
        ? encode[part](fieldDef, legendEncodingPart, model, channel, legendCmpt) // apply rule
        : legendEncodingPart; // no rule -- just default values
      if (value !== undefined && keys(value).length > 0) {
        e[part] = {update: value};
      }
      return e;
    },
    {} as LegendEncode
  );

  const interactiveSelections = interactiveLegendExists(model);
  if (interactiveSelections.length) {
    legendEncode = updateInteractiveLegendComponent(model, legendEncode, channel, interactiveSelections);
  }
  if (keys(legendEncode).length > 0) {
    legendCmpt.set('encode', legendEncode, !!legend.encoding);
  }

  return legendCmpt;
}

export function interactiveLegendExists(model: UnitModel) {
  const selections: InteractiveSelections[] = [];
  // Look over all selections
  forEachSelection(model, selCmpt => {
    if (selCmpt['fields']) {
      selections.push({name: selCmpt.name, store: stringValue(selCmpt.name + STORE), fields: selCmpt['fields']});
    }
  });

  // Quit if no selections have projections
  if (!selections.length) {
    return [];
  }

  // Encoding channels should fully populate selections
  let selectionFields: string[] = [].concat.apply([], selections.map(s => s.fields)); // Flatten array
  selectionFields = selectionFields.filter((v, i, a) => a.indexOf(v) === i); // Get unique elements

  let encodingFields: string[] = [];
  [COLOR, OPACITY, SIZE, SHAPE].forEach(channel => {
    const fieldDef = model.fieldDef(channel);
    if (fieldDef) {
      encodingFields.push(fieldDef.field);
    }
  });

  encodingFields = encodingFields.filter((v, i, a) => a.indexOf(v) === i); // Get unique elements
  const differenceFields = selectionFields.filter(x => encodingFields.indexOf(x) === -1);
  if (differenceFields.length) {
    return [];
  }
  return selections;
}

function updateInteractiveLegendComponent(
  model: UnitModel,
  legendEncode: LegendEncode,
  channel: NonPositionScaleChannel,
  interactiveSelections: InteractiveSelections[]
): LegendEncode {
  switch (channel) {
    case COLOR:
    case OPACITY:
    case SIZE:
    case SHAPE:
      break;
    default:
      return legendEncode;
  }
  const field = model.fieldDef(channel).field;

  // Choose the selection with highest specifictiy of projection containing the field
  let selectionIndex: number;
  let maxFields = 0;
  interactiveSelections.forEach((s, i) => {
    if (s.fields.length > maxFields && s.fields.indexOf(field) > -1) {
      maxFields = s.fields.length;
      selectionIndex = i;
    }
  });
  if (!maxFields) {
    return legendEncode;
  }
  const maxProjSelection = interactiveSelections[selectionIndex];

  const updatedLegendEncode = legendEncode;
  let updateValue;
  ['labels', 'symbols'].forEach(part => {
    if (updatedLegendEncode.hasOwnProperty(part)) {
      updateValue = updatedLegendEncode[part].update;
    } else {
      updateValue = {opacity: {value: 0.7}};
    }
    // Replace VlSeclectionTest datapoint to accomodate multiple fields selection
    updateValue.opacity = [
      {
        test: `!(length(data(${maxProjSelection.store}))) || ${VL_SELECTION_TEST}(${
          maxProjSelection.store
        }, {${field}: datum.value})`,
        value: updateValue.opacity.value
      },
      {value: 0.2}
    ];
    updatedLegendEncode[part] = {name: `${part}_${field}${LEGEND}`, interactive: true, update: updateValue};
  });
  // For Opacity-symbols
  // let updatedValue;
  // if (part === 'symbols' && channel === OPACITY) {
  //   updatedValue = value;
  //   if (updatedValue.stroke.value === 'transparent') {
  //     updatedValue.stroke = [
  //       {test: `vlSelectionTest(${maxProjSelection.store}, {${field}: datum.value})`, value: '#000000'},
  //       {value: 'transparent'}
  //     ];
  //   } else {
  //     updatedValue.stroke = [
  //       {
  //         test: `length(data(${maxProjSelection.store}))) && vlSelectionTest(${
  //           maxProjSelection.store
  //           }, {${field}: datum.value})`,
  //         value: '#000000'
  //       },
  //       updatedValue.stroke
  //     ];
  //   }
  // }
  return updatedLegendEncode;
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

import {Signal, SignalRef} from 'vega';
import {parseSelector} from 'vega-event-selector';
import {identity, isArray, stringValue} from 'vega-util';
import {MODIFY, STORE, unitName, VL_SELECTION_RESOLVE, TUPLE, selectionCompilers} from '.';
import {dateTimeToExpr, isDateTime, dateTimeToTimestamp} from '../../datetime';
import {hasContinuousDomain} from '../../scale';
import {SelectionInit, SelectionInitInterval, ParameterExtent} from '../../selection';
import {keys, stringify, vals} from '../../util';
import {VgData, VgDomain} from '../../vega.schema';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {isUnitModel, Model} from '../model';
import {ScaleComponent} from '../scale/component';
import {UnitModel} from '../unit';
import {parseSelectionExtent} from './parse';

export function assembleInit(
  init: readonly (SelectionInit | readonly SelectionInit[] | SelectionInitInterval)[] | SelectionInit,
  isExpr = true,
  wrap: (str: string | number) => string | number = identity
): any {
  if (isArray(init)) {
    const assembled = init.map(v => assembleInit(v, isExpr, wrap));
    return isExpr ? `[${assembled.join(', ')}]` : assembled;
  } else if (isDateTime(init)) {
    if (isExpr) {
      return wrap(dateTimeToExpr(init));
    } else {
      return wrap(dateTimeToTimestamp(init));
    }
  }
  return isExpr ? wrap(stringify(init)) : init;
}

export function assembleUnitSelectionSignals(model: UnitModel, signals: Signal[]) {
  for (const selCmpt of vals(model.component.selection ?? {})) {
    const name = selCmpt.name;
    let modifyExpr = `${name}${TUPLE}, ${selCmpt.resolve === 'global' ? 'true' : `{unit: ${unitName(model)}}`}`;

    for (const c of selectionCompilers) {
      if (!c.defined(selCmpt)) continue;
      if (c.signals) signals = c.signals(model, selCmpt, signals);
      if (c.modifyExpr) modifyExpr = c.modifyExpr(model, selCmpt, modifyExpr);
    }

    signals.push({
      name: name + MODIFY,
      on: [
        {
          events: {signal: selCmpt.name + TUPLE},
          update: `modify(${stringValue(selCmpt.name + STORE)}, ${modifyExpr})`
        }
      ]
    });
  }

  return cleanupEmptyOnArray(signals);
}

export function assembleFacetSignals(model: FacetModel, signals: Signal[]) {
  if (model.component.selection && keys(model.component.selection).length) {
    const name = stringValue(model.getName('cell'));
    signals.unshift({
      name: 'facet',
      value: {},
      on: [
        {
          events: parseSelector('mousemove', 'scope'),
          update: `isTuple(facet) ? facet : group(${name}).datum`
        }
      ]
    });
  }

  return cleanupEmptyOnArray(signals);
}

export function assembleTopLevelSignals(model: UnitModel, signals: Signal[]) {
  let hasSelections = false;
  for (const selCmpt of vals(model.component.selection ?? {})) {
    const name = selCmpt.name;
    const store = stringValue(name + STORE);
    const hasSg = signals.filter(s => s.name === name);
    if (hasSg.length === 0) {
      const resolve = selCmpt.resolve === 'global' ? 'union' : selCmpt.resolve;
      const isPoint = selCmpt.type === 'point' ? ', true, true)' : ')';
      signals.push({
        name: selCmpt.name,
        update: `${VL_SELECTION_RESOLVE}(${store}, ${stringValue(resolve)}${isPoint}`
      });
    }
    hasSelections = true;

    for (const c of selectionCompilers) {
      if (c.defined(selCmpt) && c.topLevelSignals) {
        signals = c.topLevelSignals(model, selCmpt, signals);
      }
    }
  }

  if (hasSelections) {
    const hasUnit = signals.filter(s => s.name === 'unit');
    if (hasUnit.length === 0) {
      signals.unshift({
        name: 'unit',
        value: {},
        on: [{events: 'mousemove', update: 'isTuple(group()) ? group() : unit'}]
      });
    }
  }

  return cleanupEmptyOnArray(signals);
}

export function assembleUnitSelectionData(model: UnitModel, data: readonly VgData[]): VgData[] {
  const dataCopy = [...data];
  for (const selCmpt of vals(model.component.selection ?? {})) {
    const init: VgData = {name: selCmpt.name + STORE};
    if (selCmpt.init) {
      const fields = selCmpt.project.items.map(proj => {
        const {signals, ...rest} = proj;
        return rest;
      });

      init.values = selCmpt.init.map(i => ({
        unit: unitName(model, {escape: false}),
        fields,
        values: assembleInit(i, false)
      }));
    }
    const contains = dataCopy.filter(d => d.name === selCmpt.name + STORE);
    if (!contains.length) {
      dataCopy.push(init);
    }
  }

  return dataCopy;
}

export function assembleUnitSelectionMarks(model: UnitModel, marks: any[]): any[] {
  for (const selCmpt of vals(model.component.selection ?? {})) {
    for (const c of selectionCompilers) {
      if (c.defined(selCmpt) && c.marks) {
        marks = c.marks(model, selCmpt, marks);
      }
    }
  }

  return marks;
}

export function assembleLayerSelectionMarks(model: LayerModel, marks: any[]): any[] {
  for (const child of model.children) {
    if (isUnitModel(child)) {
      marks = assembleUnitSelectionMarks(child, marks);
    }
  }

  return marks;
}

export function assembleSelectionScaleDomain(
  model: Model,
  extent: ParameterExtent,
  scaleCmpt: ScaleComponent,
  domain: VgDomain
): SignalRef {
  const parsedExtent = parseSelectionExtent(model, extent.param, extent);

  return {
    signal:
      hasContinuousDomain(scaleCmpt.get('type')) && isArray(domain) && domain[0] > domain[1]
        ? `isValid(${parsedExtent}) && reverse(${parsedExtent})`
        : parsedExtent
  };
}

function cleanupEmptyOnArray(signals: Signal[]) {
  return signals.map(s => {
    if (s.on && !s.on.length) delete s.on;
    return s;
  });
}

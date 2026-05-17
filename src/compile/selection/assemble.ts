import {Signal, SignalRef} from 'vega';
import {parseSelector} from 'vega-event-selector';
import {identity, isArray, stringValue} from 'vega-util';
import {MODIFY, STORE, unitName, VL_SELECTION_RESOLVE, TUPLE, selectionCompilers, isTimerSelection} from './index.js';
import {dateTimeToExpr, isDateTime, dateTimeToTimestamp} from '../../datetime.js';
import {hasContinuousDomain} from '../../scale.js';
import {SelectionInit, SelectionInitInterval, ParameterExtent, SELECTION_ID} from '../../selection.js';
import {keys, replacePathInField, stringify, vals} from '../../util.js';
import {VgData, VgDomain} from '../../vega.schema.js';
import {FacetModel} from '../facet.js';
import {LayerModel} from '../layer.js';
import {isUnitModel, Model} from '../model.js';
import {ScaleComponent} from '../scale/component.js';
import {UnitModel} from '../unit.js';
import {parseSelectionExtent} from './parse.js';
import {SelectionProjection} from './project.js';
import {CURR} from './point.js';
import {DataSourceType} from '../../data.js';
import {SEGMENT_TUPLES, isSegmentPathSelection, segmentIntersectionExpr, segmentPathSort} from './segment.js';

export function assembleProjection(proj: SelectionProjection) {
  const {signals, hasLegend, index, ...rest} = proj;
  rest.field = replacePathInField(rest.field);
  return rest;
}

export function assembleInit(
  init: readonly (SelectionInit | readonly SelectionInit[] | SelectionInitInterval)[] | SelectionInit,
  isExpr = true,
  wrap: (str: string | number) => string | number = identity,
): any {
  if (isArray(init)) {
    const assembled = init.map((v) => assembleInit(v, isExpr, wrap));
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
          update: `modify(${stringValue(selCmpt.name + STORE)}, ${modifyExpr})`,
        },
      ],
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
          events: parseSelector('pointermove', 'scope'),
          update: `isTuple(facet) ? facet : group(${name}).datum`,
        },
      ],
    });
  }

  return cleanupEmptyOnArray(signals);
}

export function assembleTopLevelSignals(model: UnitModel, signals: Signal[]) {
  let hasSelections = false;
  for (const selCmpt of vals(model.component.selection ?? {})) {
    const name = selCmpt.name;
    const store = stringValue(name + STORE);
    const hasSg = signals.filter((s) => s.name === name);
    if (hasSg.length === 0 && selCmpt.type !== 'segment') {
      const resolve = selCmpt.resolve === 'global' ? 'union' : selCmpt.resolve;
      const isPoint = selCmpt.type === 'point' ? ', true, true)' : ')';
      signals.push({
        name: selCmpt.name,
        update: `${VL_SELECTION_RESOLVE}(${store}, ${stringValue(resolve)}${isPoint}`,
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
    const hasUnit = signals.filter((s) => s.name === 'unit');
    if (hasUnit.length === 0) {
      signals.unshift({
        name: 'unit',
        value: {},
        on: [{events: 'pointermove', update: 'isTuple(group()) ? group() : unit'}],
      });
    }
  }

  return cleanupEmptyOnArray(signals);
}

export function assembleUnitSelectionData(model: UnitModel, data: readonly VgData[]): VgData[] {
  const selectionData: VgData[] = [];
  const derivedSelectionData: VgData[] = [];
  const animationData: VgData[] = [];
  const unit = unitName(model, {escape: false});

  for (const selCmpt of vals(model.component.selection ?? {})) {
    const store: VgData = {name: selCmpt.name + STORE};

    if (selCmpt.project.hasSelectionId) {
      store.transform = [{type: 'collect', sort: {field: SELECTION_ID}}];
    }

    if (selCmpt.init) {
      const fields = selCmpt.project.items.map(assembleProjection);

      store.values = selCmpt.project.hasSelectionId
        ? selCmpt.init.map((i) => ({unit, [SELECTION_ID]: assembleInit(i, false)[0]}))
        : selCmpt.init.map((i) => ({unit, fields, values: assembleInit(i, false)}));
    }

    const contains = [...selectionData, ...data].filter((d) => d.name === selCmpt.name + STORE);
    if (!contains.length) {
      selectionData.push(store);
    }

    const pathFields = selCmpt.type === 'segment' && isSegmentPathSelection(selCmpt) ? selCmpt.segment.fields : [];
    if (pathFields?.length) {
      const source = model.lookupDataSource(model.getDataName(DataSourceType.Main));
      const x = selCmpt.project.hasChannel.x;
      const y = selCmpt.project.hasChannel.y;
      const sort = segmentPathSort(model);
      const xField = model.vgField('x');
      const yField = model.vgField('y');

      if (source && x && y && sort?.length && xField && yField) {
        const nextX = `${selCmpt.name}${SEGMENT_TUPLES}_next_x`;
        const nextY = `${selCmpt.name}${SEGMENT_TUPLES}_next_y`;
        const x0 = `${x.signals.data}[0]`;
        const y0 = `${y.signals.data}[0]`;
        const x1 = `${x.signals.data}[1]`;
        const y1 = `${y.signals.data}[1]`;
        const rowX = `+(datum[${stringValue(xField)}])`;
        const rowY = `+(datum[${stringValue(yField)}])`;
        const leadX = `+(datum[${stringValue(nextX)}])`;
        const leadY = `+(datum[${stringValue(nextY)}])`;
        const fields = pathFields.map((field) => ({type: 'E', field: replacePathInField(field)}));
        const values = `[${pathFields.map((field) => `datum[${stringValue(field)}]`).join(', ')}]`;

        const segmentTuples: VgData = {
          name: selCmpt.name + SEGMENT_TUPLES,
          source,
          transform: [
            {
              type: 'window',
              ops: ['lead', 'lead'],
              fields: [xField, yField],
              params: [1, 1],
              as: [nextX, nextY],
              sort: {
                field: sort.map((sortField) => sortField.field),
                order: sort.map((sortField) => sortField.order ?? 'ascending'),
              },
              groupby: pathFields,
            },
            {
              type: 'filter',
              expr: `${x.signals.data} && ${y.signals.data} && isValid(datum[${stringValue(nextX)}]) && isValid(datum[${stringValue(nextY)}]) && ${segmentIntersectionExpr(x0, y0, x1, y1, rowX, rowY, leadX, leadY)}`,
            },
            {
              type: 'aggregate',
              groupby: pathFields,
              fields: [null],
              ops: ['count'],
              as: ['count'],
            },
            {type: 'formula', expr: unitName(model), as: 'unit'},
            {type: 'formula', expr: stringify(fields), as: 'fields'},
            {type: 'formula', expr: values, as: 'values'},
          ] as any,
        };

        derivedSelectionData.push(segmentTuples);
      }
    }

    if (isTimerSelection(selCmpt) && data.length) {
      // TODO(jzong): eventually uncomment this stuff when we want to support multi-view
      // const sourceName =
      //   model.parent && model.parent.type !== 'unit' // facet, layer, or concat
      //     ? model.parent.lookupDataSource(model.parent.getDataName(DataSourceType.Main))
      //     : model.lookupDataSource(model.getDataName(DataSourceType.Main));
      const sourceName = model.lookupDataSource(model.getDataName(DataSourceType.Main));
      const sourceData = data.find((d) => d.name === sourceName);

      // find the filter transform for the current selection
      const sourceDataFilter = sourceData.transform.find(
        (t) => t.type === 'filter' && t.expr.includes('vlSelectionTest'),
      );

      if (sourceDataFilter) {
        // remove it from the original dataset
        sourceData.transform = sourceData.transform.filter((t) => t !== sourceDataFilter);

        // create dataset to hold current animation frame
        const currentFrame: VgData = {
          name: sourceData.name + CURR,
          source: sourceData.name,
          transform: [sourceDataFilter], // add the selection filter to the animation dataset
        };

        animationData.push(currentFrame);
      }
    }
  }

  return selectionData.concat(data, derivedSelectionData, animationData);
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
  domain: VgDomain,
): SignalRef {
  const parsedExtent = parseSelectionExtent(model, extent.param, extent);

  return {
    signal:
      hasContinuousDomain(scaleCmpt.get('type')) && isArray(domain) && domain[0] > domain[1]
        ? `isValid(${parsedExtent}) && reverse(${parsedExtent})`
        : parsedExtent,
  };
}

function cleanupEmptyOnArray(signals: Signal[]) {
  return signals.map((s) => {
    if (s.on && !s.on.length) delete s.on;
    return s;
  });
}

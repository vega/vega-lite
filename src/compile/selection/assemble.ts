import {Signal, SignalRef} from 'vega';
import {parseSelector} from 'vega-event-selector';
import {isArray, stringValue} from 'vega-util';
import {
  BARE_SIGNAL_NAME,
  MODIFY,
  STORE,
  unitName,
  VL_SELECTION_RESOLVE,
  TUPLE,
  selectionCompilers,
  isTimerSelection,
  sliderName,
  timerFilters,
} from './index.js';
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
import {ANIM_VALUE, CURR, PAUSE_STORE} from './point.js';
import {animationInterpolationData, animationLineInterpolationData, animationLineKey} from '../animation.js';
import {DataSourceType} from '../../data.js';

export function assembleProjection(proj: SelectionProjection) {
  const {signals, hasLegend, index, ...rest} = proj;
  rest.field = replacePathInField(rest.field);
  return rest;
}

export function assembleInit(
  init: readonly (SelectionInit | readonly SelectionInit[] | SelectionInitInterval)[] | SelectionInit,
  isExpr = true,
  wrap: (str: string | number) => string | number = (x) => x,
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

    const modify = `modify(${stringValue(selCmpt.name + STORE)}, ${modifyExpr})`;

    signals.push(
      isTimerSelection(selCmpt)
        ? // an animation's tuple signal is itself an `update` expression, so
          // write the store on the initial pulse too -- otherwise the first
          // frame renders against an empty store. see point.ts.
          {name: name + MODIFY, update: modify}
        : {name: name + MODIFY, on: [{events: {signal: selCmpt.name + TUPLE}, update: modify}]},
    );
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
    if (hasSg.length === 0) {
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

/**
 * Wires scrubbing to the parameters a specification's own timer filters name,
 * so dragging the slider pauses playback through the specification's own
 * switch -- and the widget bound to that switch unchecks, keeping the visible
 * state consistent. Runs over the assembled top-level signals, which is the
 * first place the compiler can see a variable parameter's signal.
 */
export function attachScrubPause(model: Model, signals: Signal[]): void {
  for (const selCmpt of vals(model.component.selection ?? {})) {
    if (!isTimerSelection(selCmpt)) continue;
    const slider = sliderName(selCmpt);
    if (!slider) continue;

    for (const f of timerFilters(selCmpt)) {
      if (!BARE_SIGNAL_NAME.test(f)) continue;
      const target = signals.find((sg) => sg.name === f);
      if (!target) continue;
      ((target as any).on ??= []).push({
        // ignore the slider echoing the current frame during playback
        events: {signal: slider},
        update: `${slider} !== ${ANIM_VALUE} ? false : ${f}`,
      });
    }
  }
}

export function assembleUnitSelectionData(model: UnitModel, data: readonly VgData[]): VgData[] {
  const selectionData: VgData[] = [];
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

    if (selCmpt.pause?.length && isTimerSelection(selCmpt)) {
      // This store holds the current frame's pause entry and nothing else, so
      // the signals reading it need only test whether it is empty.
      animationData.push({
        name: selCmpt.name + PAUSE_STORE,
        values: selCmpt.pause.map(({value, duration}) => ({value: assembleInit(value, false), duration})),
        transform: [{type: 'filter', expr: `datum.value === ${ANIM_VALUE}`}],
      });
    }

    if (isTimerSelection(selCmpt) && data.length) {
      const sourceName = model.lookupDataSource(model.getDataName(DataSourceType.Main));
      const sourceData = data.find((d) => d.name === sourceName);

      // A layer parses the same selection into every child, so a sibling may
      // already have built the frame dataset and removed the filter it was
      // built from. This unit draws from that same dataset.
      const built = new Set([...data, ...animationData].map((d) => d.name));

      if (sourceData && built.has(sourceData.name + CURR)) {
        model.animationFrameSource = sourceData.name;
      } else {
        // Find where the frame filter ended up. It usually sits on the main
        // source, but the dataflow may have pushed it above an aggregate, and
        // it has to move from wherever it landed. Only this unit's own
        // pipeline -- the main source and its ancestors -- may host it: the
        // same selection test also appears on datasets that materialize the
        // selection for other consumers, such as a lookup transform's
        // secondary table or another view's pipeline, and moving one of those
        // filters would sever that consumer. A facet child's main output is
        // the partition its cell defines, which is not a dataset in this
        // array, so its chain starts from the raw source instead.
        const chainHead =
          sourceData ?? data.find((d) => d.name === model.lookupDataSource(model.getDataName(DataSourceType.Raw)));
        const chain: VgData[] = [];
        for (let d: VgData | undefined = chainHead; d; ) {
          chain.push(d);
          const src = d.source;
          d = typeof src === 'string' ? data.find((x) => x.name === src) : undefined;
        }

        const storeRef = stringValue(selCmpt.name + STORE);
        const testsStore = (t: VgData['transform'][number]) =>
          t.type === 'filter' && t.expr.includes(`vlSelectionTest(${storeRef}`);
        const filterHost = chain.find((d) => (d.transform ?? []).some(testsStore));
        const frameFilter = filterHost?.transform.find(testsStore);

        // No frame filter means nothing selects the current frame's rows, so
        // there is no frame dataset to build and marks stay on the full data.
        // An animation may still drive conditional encodings or a bound scale.
        if (frameFilter) {
          // Move the filter down so everything upstream still sees the whole
          // time domain. Scale domains read that domain, and an aggregate over
          // a single frame collapses the animation to that frame.
          filterHost.transform = filterHost.transform.filter((t) => t !== frameFilter);

          // The pipeline's layout transforms (stack) computed positions over
          // the whole time domain, because the filter moved below them. The
          // frame dataset re-applies them so its rows are laid out within the
          // frame, as they would have been with the filter where the author
          // wrote it.
          const layout = chain.flatMap((d) => (d.transform ?? []).filter((t) => t.type === 'stack'));

          if (sourceData) {
            animationData.push({
              name: sourceData.name + CURR,
              source: sourceData.name,
              transform: [frameFilter, ...layout],
            });

            model.animationFrameSource = sourceData.name;

            // Interpolation datasets derive from the frame dataset, so they
            // exist exactly when it does. Their builders ask the model whether
            // it animates, which holds only after the assignment above. A line
            // mark resamples the full series instead of joining frame to
            // frame, because a line is one mark spanning many keyframes.
            if (animationLineKey(model)) {
              animationData.push(...animationLineInterpolationData(model, sourceData));
            } else {
              animationData.push(...animationInterpolationData(model, sourceData));
            }
          } else {
            // A facet's child draws from the partition its cell group defines,
            // which is not a dataset in this array. The frame dataset has to sit
            // inside that group, so hand the filter to the facet, which knows
            // the partition's name once its own data is assembled.
            model.animationFrameFilter = frameFilter;
          }
        }
      }
    }
  }

  return selectionData.concat(data, animationData);
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

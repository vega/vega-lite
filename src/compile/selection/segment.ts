import {isObject, NewSignal, OnEvent, SignalValue, Stream} from 'vega';
import {isArray, stringValue} from 'vega-util';
import {SelectionCompiler, SelectionComponent, STORE, TUPLE, unitName, VL_SELECTION_RESOLVE} from './index.js';
import {ScaleChannel, X, Y} from '../../channel.js';
import {isFieldDef, vgField} from '../../channeldef.js';
import {pathGroupingFields} from '../../encoding.js';
import {warn} from '../../log/index.js';
import {message} from '../../log/index.js';
import {LINE, RULE, TRAIL} from '../../mark.js';
import {hasContinuousDomain} from '../../scale.js';
import {SegmentSelectionConfigWithoutType} from '../../selection.js';
import {internalField, keys} from '../../util.js';
import {isLayerModel, isUnitModel, Model} from '../model.js';
import {UnitModel} from '../unit.js';
import {SelectionProjection} from './project.js';

export const SEGMENT = '_segment';
export const SEGMENT_TUPLES = '_tuples';
const SEGMENT_SCOPE = '_scope';

export function segmentPathGroupingFields(model: UnitModel) {
  return (model.mark === LINE || model.mark === TRAIL) && !model.hasProjection
    ? pathGroupingFields(model.mark, model.encoding)
    : [];
}

export function segmentScopeField(selCmpt: SelectionComponent<'segment'>) {
  return internalField(`${selCmpt.name}${SEGMENT_SCOPE}`);
}

export function segmentScopeValue(model: Model) {
  return (isLayerModel(model.parent) ? model.parent : model).name;
}

export function segmentState(model: UnitModel, selCmpt: SelectionComponent<'segment'>) {
  if (model.mark === LINE || model.mark === TRAIL) {
    const fields = segmentPathGroupingFields(model);
    if (fields.length) {
      return {project: 'path' as const, fields};
    }

    return {
      project: 'path' as const,
      fields: [segmentScopeField(selCmpt)],
      scopeField: segmentScopeField(selCmpt),
    };
  }

  return {project: 'values' as const};
}

export function segmentPathSort(model: UnitModel) {
  const {encoding, markDef} = model;
  const order = array(encoding.order)
    .filter(isFieldDef)
    .map((fieldDef) => ({
      field: vgField(fieldDef),
      order: (fieldDef as any).sort === 'descending' ? 'descending' : 'ascending',
    }))
    .filter((sortField) => sortField.field);

  if (order.length) {
    return order;
  }

  const dimensionChannel = markDef.orient === 'horizontal' ? Y : X;
  const field = model.vgField(dimensionChannel);
  return field ? [{field, order: 'ascending' as const}] : undefined;
}

export function segmentIntersectionExpr(
  ax: string,
  ay: string,
  bx: string,
  by: string,
  cx: string,
  cy: string,
  dx: string,
  dy: string,
) {
  const bbox =
    `max(min(${ax}, ${bx}), min(${cx}, ${dx})) <= min(max(${ax}, ${bx}), max(${cx}, ${dx})) && ` +
    `max(min(${ay}, ${by}), min(${cy}, ${dy})) <= min(max(${ay}, ${by}), max(${cy}, ${dy}))`;
  const cross1 = `((${dx} - ${cx}) * (${ay} - ${cy}) - (${dy} - ${cy}) * (${ax} - ${cx}))`;
  const cross2 = `((${dx} - ${cx}) * (${by} - ${cy}) - (${dy} - ${cy}) * (${bx} - ${cx}))`;
  const cross3 = `((${bx} - ${ax}) * (${cy} - ${ay}) - (${by} - ${ay}) * (${cx} - ${ax}))`;
  const cross4 = `((${bx} - ${ax}) * (${dy} - ${ay}) - (${by} - ${ay}) * (${dx} - ${ax}))`;
  return `(${bbox}) && (${cross1}) * (${cross2}) <= 0 && (${cross3}) * (${cross4}) <= 0`;
}

const segment: SelectionCompiler<'segment'> = {
  defined: (selCmpt) => selCmpt.type === 'segment',

  parse: (model, selCmpt, selDef) => {
    if (model.hasProjection) {
      warn(message.segmentSelectionRequiresCartesianXY());
      return;
    }

    const channels = selCmpt.project?.hasChannel;
    if (!channels?.x || !channels?.y) {
      warn(message.segmentSelectionRequiresXYProjection());
      return;
    }

    const def: SegmentSelectionConfigWithoutType = {...(isObject(selDef.select) ? selDef.select : {})};
    if (def.encodings && (def.encodings.length !== 2 || !def.encodings.includes(X) || !def.encodings.includes(Y))) {
      warn(message.segmentSelectionOnlySupportsXYProjection());
    }

    if (
      !hasContinuousDomain(model.getScaleComponent(X)?.get('type')) ||
      !hasContinuousDomain(model.getScaleComponent(Y)?.get('type'))
    ) {
      warn(message.segmentSelectionRequiresContinuousXY());
      return;
    }

    selCmpt.segment = segmentState(model, selCmpt);
  },

  topLevelSignals: (model, selCmpt, signals) => {
    if (!selCmpt.segment) {
      return signals;
    }

    const store = stringValue(selCmpt.name + STORE);
    const hasSignal = signals.some((s) => s.name === selCmpt.name);
    const hasPathTuples = isUnitModel(model) && selCmpt.segment?.project === 'path';
    const x = isUnitModel(model) ? selCmpt.project.hasChannel.x : undefined;
    const y = isUnitModel(model) ? selCmpt.project.hasChannel.y : undefined;

    if (hasPathTuples) {
      for (const signalName of [x?.signals.data, y?.signals.data]) {
        if (signalName && !signals.some((signal) => signal.name === signalName)) {
          signals.push({name: signalName});
        }
      }
    }

    return hasSignal
      ? signals
      : signals.concat({
          name: selCmpt.name,
          update: hasPathTuples
            ? `${VL_SELECTION_RESOLVE}(${store}, ${stringValue(selCmpt.resolve === 'global' ? 'union' : selCmpt.resolve)}, true, true)`
            : `length(data(${store})) ? data(${store})[0].values : null`,
        });
  },

  signals: (model, selCmpt, signals) => {
    if (model.hasProjection || !selCmpt.segment) {
      return signals;
    }

    const x = selCmpt.project.hasChannel.x;
    const y = selCmpt.project.hasChannel.y;

    if (!x || !y) {
      return signals;
    }

    signals.push(...channelSignals(model, selCmpt, x), ...channelSignals(model, selCmpt, y));

    if (selCmpt.segment?.project === 'path' && model.parent) {
      for (const signalName of [x.signals.data, y.signals.data]) {
        const signal: any = signals.find((entry) => entry.name === signalName);
        signal.push = 'outer';
      }
    }

    const dataSignals = [x.signals.data, y.signals.data];
    return signals.concat({
      name: selCmpt.name + TUPLE,
      on: [
        {
          events: [{signal: dataSignals.join(' || ')}],
          update:
            selCmpt.segment?.project === 'path'
              ? `${dataSignals.join(' && ')} ? data(${stringValue(selCmpt.name + SEGMENT_TUPLES)}) : []`
              : `${dataSignals.join(' && ')} ? {unit: ${unitName(model)}, values: [${x.signals.data}[0], ${y.signals.data}[0], ${x.signals.data}[1], ${y.signals.data}[1]]} : null`,
        },
      ],
    });
  },

  marks: (model, selCmpt, marks) => {
    if (model.hasProjection || !selCmpt.segment) {
      return marks;
    }

    const x = selCmpt.project.hasChannel.x;
    const y = selCmpt.project.hasChannel.y;
    if (!x || !y) {
      return marks;
    }

    const store = `data(${stringValue(selCmpt.name + STORE)})`;
    const update: any = {
      x: {signal: `${x.signals.visual}[0]`},
      y: {signal: `${y.signals.visual}[0]`},
      x2: {signal: `${x.signals.visual}[1]`},
      y2: {signal: `${y.signals.visual}[1]`},
    };

    if (selCmpt.resolve === 'global') {
      for (const key of keys(update)) {
        update[key] = [
          {
            test: `${store}.length && ${store}[0].unit === ${unitName(model)}`,
            ...update[key],
          },
          {value: 0},
        ];
      }
    }

    const {cursor, fill: _fill, fillOpacity: _fillOpacity, ...stroke} = selCmpt.mark;
    const vgStroke = keys(stroke).reduce(
      (def, key) => {
        def[key] = {value: stroke[key]};
        return def;
      },
      {} as Record<string, any>,
    );

    return [
      ...marks,
      {
        name: selCmpt.name + SEGMENT,
        type: 'rule',
        clip: true,
        encode: {
          enter: {
            ...(cursor ? {cursor: {value: cursor}} : {}),
          },
          update: {...update, ...vgStroke},
        },
      },
    ];
  },
};

export default segment;

function channelSignals(
  model: UnitModel,
  selCmpt: SelectionComponent<'segment'>,
  proj: SelectionProjection,
): NewSignal[] {
  const channel = proj.channel as ScaleChannel;
  const vname = proj.signals.visual;
  const dname = proj.signals.data;
  const scaleName = stringValue(model.scaleName(channel));
  const size = model.getSizeSignalRef(channel === X ? 'width' : 'height').signal;
  const coord = `${channel}(unit)`;
  const scale = model.getScaleComponent(channel);
  const scaleType = scale?.get('type');

  const von = selCmpt.events.reduce((def: OnEvent[], evt: Stream) => {
    return [
      ...def,
      {events: evt.between[0], update: `[${coord}, ${coord}]`},
      {events: evt, update: `[${vname}[0], clamp(${coord}, 0, ${size})]`},
    ];
  }, []);

  const vinit: SignalValue = {value: []};

  return [
    {name: vname, ...vinit, on: von},
    {
      name: dname,
      on: [
        {
          events: {signal: vname},
          update:
            hasContinuousDomain(scaleType) && `${vname}[0] !== ${vname}[1]` ? `invert(${scaleName}, ${vname})` : 'null',
        },
      ],
    },
  ];
}

function array<T>(value: T | T[]) {
  return value == null ? [] : isArray(value) ? value : [value];
}

export function isSegmentPathSelection(
  selCmpt: SelectionComponent,
): selCmpt is SelectionComponent<'segment'> & {segment: {project: 'path'; fields: string[]; scopeField?: string}} {
  return selCmpt.segment?.project === 'path';
}

export function supportsSegmentTarget(model: UnitModel) {
  return (
    model.mark === RULE && !!model.vgField(X) && !!model.vgField(Y) && !!model.vgField('x2') && !!model.vgField('y2')
  );
}

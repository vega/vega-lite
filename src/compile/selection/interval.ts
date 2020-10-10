import {isObject, NewSignal, OnEvent, SignalValue, Stream} from 'vega';
import {array, stringValue} from 'vega-util';
import {SelectionCompiler, SelectionComponent, STORE, TUPLE, unitName} from '.';
import {GeoPositionChannel, LATITUDE, LONGITUDE, ScaleChannel, X, Y} from '../../channel';
import {FieldName} from '../../channeldef';
import {warn} from '../../log';
import {hasContinuousDomain} from '../../scale';
import {IntervalSelectionConfigWithoutType, SelectionInitInterval, SELECTION_ID} from '../../selection';
import {keys, vals} from '../../util';
import {UnitModel} from '../unit';
import {assembleInit} from './assemble';
import {SelectionProjection, TUPLE_FIELDS} from './project';
import scales from './scales';

export const BRUSH = '_brush';
export const SCALE_TRIGGER = '_scale_trigger';

// Separate type because the "fields" property is only used internally and we don't want to leak it to the schema.
export type IntervalSelectionConfigWithField = IntervalSelectionConfigWithoutType & {fields?: FieldName[]};

const interval: SelectionCompiler<'interval'> = {
  defined: selCmpt => selCmpt.type === 'interval',

  parse: (model, selCmpt, selDef) => {
    if (model.hasProjection) {
      const def: IntervalSelectionConfigWithField = {...(isObject(selDef.select) ? selDef.select : {})};
      def.fields = [SELECTION_ID];
      if (!def.encodings) {
        // Remap default x/y projection
        def.encodings = selDef.value ? (keys(selDef.value) as GeoPositionChannel[]) : [LONGITUDE, LATITUDE];
      }

      selDef.select = {type: 'interval', ...def};
    }

    if (selCmpt.translate && !scales.defined(selCmpt)) {
      const filterExpr = `!event.item || event.item.mark.name !== ${stringValue(selCmpt.name + BRUSH)}`;
      for (const evt of selCmpt.events) {
        if (!evt.between) {
          warn(`${evt} is not an ordered event stream for interval selections.`);
          continue;
        }

        const filters = array((evt.between[0].filter ??= []));
        if (filters.indexOf(filterExpr) < 0) {
          filters.push(filterExpr);
        }
      }
    }
  },

  signals: (model, selCmpt, signals) => {
    const name = selCmpt.name;
    const tupleSg = name + TUPLE;
    const channels = vals(selCmpt.project.hasChannel).filter(p => p.channel === X || p.channel === Y);
    const init = selCmpt.init ? selCmpt.init[0] : null;

    signals.push(
      ...channels.reduce((arr, proj, i) => arr.concat(channelSignals(model, selCmpt, proj, init && init[i])), [])
    );

    if (!model.hasProjection) {
      // Proxy scale reactions to ensure that an infinite loop doesn't occur
      // when an interval selection filter touches the scale.
      if (!scales.defined(selCmpt)) {
        const triggerSg = name + SCALE_TRIGGER;
        const scaleTriggers = channels.map(proj => {
          const channel = proj.channel as 'x' | 'y';
          const {data: dname, visual: vname} = proj.signals;
          const scaleName = stringValue(model.scaleName(channel));
          const scaleType = model.getScaleComponent(channel).get('type');
          const toNum = hasContinuousDomain(scaleType) ? '+' : '';
          return (
            `(!isArray(${dname}) || ` +
            `(${toNum}invert(${scaleName}, ${vname})[0] === ${toNum}${dname}[0] && ` +
            `${toNum}invert(${scaleName}, ${vname})[1] === ${toNum}${dname}[1]))`
          );
        });

        if (scaleTriggers.length) {
          signals.push({
            name: triggerSg,
            value: {},
            on: [
              {
                events: channels.map(proj => ({scale: model.scaleName(proj.channel)})),
                update: scaleTriggers.join(' && ') + ` ? ${triggerSg} : {}`
              }
            ]
          });
        }
      }

      // Only add an interval to the store if it has valid data extents. Data extents
      // are set to null if pixel extents are equal to account for intervals over
      // ordinal/nominal domains which, when inverted, will still produce a valid datum.
      const dataSignals = channels.map(proj => proj.signals.data);
      const update = `unit: ${unitName(model)}, fields: ${name + TUPLE_FIELDS}, values`;
      return signals.concat({
        name: tupleSg,
        ...(init ? {init: `{${update}: ${assembleInit(init)}}`} : {}),
        ...(dataSignals.length
          ? {
              on: [
                {
                  events: [{signal: dataSignals.join(' || ')}], // Prevents double invocation, see https://github.com/vega/vega/issues/1672.
                  update: `${dataSignals.join(' && ')} ? {${update}: [${dataSignals}]} : null`
                }
              ]
            }
          : {})
      });
    } else {
      const {x, y} = selCmpt.project.hasChannel;
      const xvname = x && x.signals.visual;
      const yvname = y && y.signals.visual;
      const bbox =
        `[` +
        `[${xvname ? xvname + '[0]' : '0'}, ${yvname ? yvname + '[0]' : '0'}],` +
        `[${xvname ? xvname + '[1]' : 'width'}, ${yvname ? yvname + '[1]' : 'height'}]` +
        `]`;

      const intersect = `intersect(${bbox}, {markname: ${stringValue(model.getName('marks'))}}, unit.mark)`;
      const base = `{unit: ${unitName(model)}}`;

      return signals.concat({
        name: tupleSg,
        update: `vlSelectionTuples(${intersect}, ${base})`
      });
    }
  },

  marks: (model, selCmpt, marks) => {
    const name = selCmpt.name;
    const {x, y} = selCmpt.project.hasChannel;
    const xvname = x?.signals.visual;
    const yvname = y?.signals.visual;
    const store = `data(${stringValue(selCmpt.name + STORE)})`;

    // Do not add a brush if we're binding to scales
    // or we don't have a valid interval projection
    if (scales.defined(selCmpt) || (!x && !y)) {
      return marks;
    }

    const update: any = {
      x: x !== undefined ? {signal: `${xvname}[0]`} : {value: 0},
      y: y !== undefined ? {signal: `${yvname}[0]`} : {value: 0},
      x2: x !== undefined ? {signal: `${xvname}[1]`} : {field: {group: 'width'}},
      y2: y !== undefined ? {signal: `${yvname}[1]`} : {field: {group: 'height'}}
    };

    // If the selection is resolved to global, only a single interval is in
    // the store. Wrap brush mark's encodings with a production rule to test
    // this based on the `unit` property. Hide the brush mark if it corresponds
    // to a unit different from the one in the store.
    if (selCmpt.resolve === 'global') {
      for (const key of keys(update)) {
        update[key] = [
          {
            test: `${store}.length && ${store}[0].unit === ${unitName(model)}`,
            ...update[key]
          },
          {value: 0}
        ];
      }
    }

    // Two brush marks ensure that fill colors and other aesthetic choices do
    // not interefere with the core marks, but that the brushed region can still
    // be interacted with (e.g., dragging it around).
    const {fill, fillOpacity, cursor, ...stroke} = selCmpt.mark;
    const vgStroke = keys(stroke).reduce((def, k) => {
      def[k] = [
        {
          test: [x !== undefined && `${xvname}[0] !== ${xvname}[1]`, y !== undefined && `${yvname}[0] !== ${yvname}[1]`]
            .filter(t => t)
            .join(' && '),
          value: stroke[k]
        },
        {value: null}
      ];
      return def;
    }, {});

    return [
      {
        name: `${name + BRUSH}_bg`,
        type: 'rect',
        clip: true,
        encode: {
          enter: {
            fill: {value: fill},
            fillOpacity: {value: fillOpacity}
          },
          update
        }
      },
      ...marks,
      {
        name: name + BRUSH,
        type: 'rect',
        clip: true,
        encode: {
          enter: {
            ...(cursor ? {cursor: {value: cursor}} : {}),
            fill: {value: 'transparent'}
          },
          update: {...update, ...vgStroke}
        }
      }
    ];
  }
};
export default interval;

/**
 * Returns the visual and data signals for an interval selection.
 */
function channelSignals(
  model: UnitModel,
  selCmpt: SelectionComponent<'interval'>,
  proj: SelectionProjection,
  init: SelectionInitInterval
): NewSignal[] {
  const scaledInterval = !model.hasProjection;
  const channel = proj.channel;
  const vname = proj.signals.visual;

  const scaleName = stringValue(scaledInterval ? model.scaleName(channel) : model.projectionName());
  const scaled = (str: string) => `scale(${scaleName}, ${str})`;
  const vinit: SignalValue = init ? {init: assembleInit(init, true, scaled)} : {value: []};

  const size = model.getSizeSignalRef(channel === X ? 'width' : 'height').signal;
  const coord = `${channel}(unit)`;
  const von = selCmpt.events.reduce((def: OnEvent[], evt: Stream) => {
    return [
      ...def,
      {events: evt.between[0], update: `[${coord}, ${coord}]`}, // Brush Start
      {events: evt, update: `[${vname}[0], clamp(${coord}, 0, ${size})]`} // Brush End
    ];
  }, []);

  if (scaledInterval) {
    const dname = proj.signals.data;
    const hasScales = scales.defined(selCmpt);
    const scale = model.getScaleComponent(channel as ScaleChannel);
    const scaleType = scale ? scale.get('type') : undefined;

    // React to pan/zooms of continuous scales. Non-continuous scales
    // (band, point) cannot be pan/zoomed and any other changes
    // to their domains (e.g., filtering) should clear the brushes.
    von.push({
      events: {signal: selCmpt.name + SCALE_TRIGGER},
      update: hasContinuousDomain(scaleType) ? `[${scaled(`${dname}[0]`)}, ${scaled(`${dname}[1]`)}]` : `[0, 0]`
    });

    return hasScales
      ? [{name: dname, on: []}]
      : [
          {name: vname, ...vinit, on: von},
          {
            name: dname,
            ...(init ? {init: assembleInit(init)} : {}), // Cannot be `value` as `init` may require datetime exprs.
            on: [
              {
                events: {signal: vname},
                update: `${vname}[0] === ${vname}[1] ? null : invert(${scaleName}, ${vname})`
              }
            ]
          }
        ];
  } else {
    return [{name: vname, ...vinit, on: von}];
  }
}

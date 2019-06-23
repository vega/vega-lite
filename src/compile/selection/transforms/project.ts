import {array, isArray} from 'vega-util';
import {isSingleDefUnitChannel, ScaleChannel, SingleDefUnitChannel} from '../../../channel';
import * as log from '../../../log';
import {hasContinuousDomain} from '../../../scale';
import {isIntervalSelection, SelectionInitIntervalMapping, SelectionInitMapping} from '../../../selection';
import {Dict, hash, keys, varName} from '../../../util';
import {TimeUnitComponent, TimeUnitNode} from '../../data/timeunit';
import scales from './scales';
import {TransformCompiler} from './transforms';

export const TUPLE_FIELDS = '_tuple_fields';

/**
 * Do the selection tuples hold enumerated or ranged values for a field?
 * Ranged values can be left-right inclusive (R) or left-inclusive, right-exclusive (R-LE).
 */
export type TupleStoreType = 'E' | 'R' | 'R-RE';

export interface SelectionProjection {
  type: TupleStoreType;
  field: string;
  channel?: SingleDefUnitChannel;
  signals?: {data?: string; visual?: string};
}

export class SelectionProjectionComponent {
  public has: {[key in SingleDefUnitChannel]?: SelectionProjection};
  public timeUnit?: TimeUnitNode;
  public items: SelectionProjection[];

  constructor(...items: SelectionProjection[]) {
    this.items = items;
    this.has = {};
  }
}

const project: TransformCompiler = {
  has: () => {
    return true; // This transform handles its own defaults, so always run parse.
  },

  parse: (model, selDef, selCmpt) => {
    const name = selCmpt.name;
    const proj = selCmpt.project || (selCmpt.project = new SelectionProjectionComponent());
    const parsed: Dict<SelectionProjection> = {};
    const timeUnits: Dict<TimeUnitComponent> = {};

    const signals = new Set<string>();
    const signalName = (p: SelectionProjection, range: 'data' | 'visual') => {
      const suffix = range === 'visual' ? p.channel : p.field;
      let sg = varName(`${name}_${suffix}`);
      for (let counter = 1; signals.has(sg); counter++) {
        sg = varName(`${name}_${suffix}_${counter}`);
      }
      signals.add(sg);
      return {[range]: sg};
    };

    // If no explicit projection (either fields or encodings) is specified, set some defaults.
    // If an initial value is set, try to infer projections.
    // Otherwise, use the default configuration.
    if (!selDef.fields && !selDef.encodings) {
      const cfg = model.config.selection[selDef.type];

      if (selDef.init) {
        for (const init of array(selDef.init)) {
          for (const key of keys(init)) {
            if (isSingleDefUnitChannel(key)) {
              (selDef.encodings || (selDef.encodings = [])).push(key as SingleDefUnitChannel);
            } else {
              if (isIntervalSelection(selDef)) {
                log.warn('Interval selections should be initialized using "x" and/or "y" keys.');
                selDef.encodings = cfg.encodings;
              } else {
                (selDef.fields || (selDef.fields = [])).push(key);
              }
            }
          }
        }
      } else {
        selDef.encodings = cfg.encodings;
        selDef.fields = cfg.fields;
      }
    }

    // TODO: find a possible channel mapping for these fields.
    for (const field of selDef.fields || []) {
      const p: SelectionProjection = {type: 'E', field};
      p.signals = {...signalName(p, 'data')};
      proj.items.push(p);
    }

    for (const channel of selDef.encodings || []) {
      const fieldDef = model.fieldDef(channel);
      if (fieldDef) {
        let field = fieldDef.field;
        if (fieldDef.timeUnit) {
          field = model.vgField(channel);

          // Construct TimeUnitComponents which will be combined into a
          // TimeUnitNode. This node may need to be inserted into the
          // dataflow if the selection is used across views that do not
          // have these time units defined.
          const component = {
            as: field,
            field: fieldDef.field,
            timeUnit: fieldDef.timeUnit
          };
          timeUnits[hash(component)] = component;
        }

        // Prevent duplicate projections on the same field.
        // TODO: what if the same field is bound to multiple channels (e.g., SPLOM diag).
        if (!parsed[field]) {
          // Determine whether the tuple will store enumerated or ranged values.
          // Interval selections store ranges for continuous scales, and enumerations otherwise.
          // Single/multi selections store ranges for binned fields, and enumerations otherwise.
          let type: TupleStoreType = 'E';
          if (selCmpt.type === 'interval') {
            const scaleType = model.getScaleComponent(channel as ScaleChannel).get('type');
            if (hasContinuousDomain(scaleType)) {
              type = 'R';
            }
          } else if (fieldDef.bin) {
            type = 'R-RE';
          }

          const p: SelectionProjection = {field, channel, type};
          p.signals = {...signalName(p, 'data'), ...signalName(p, 'visual')};
          proj.items.push((parsed[field] = p));
          proj.has[channel] = parsed[field];
        }
      } else {
        log.warn(log.message.cannotProjectOnChannelWithoutField(channel));
      }
    }

    if (selDef.init) {
      if (scales.has(selCmpt)) {
        log.warn(log.message.NO_INIT_SCALE_BINDINGS);
      } else {
        const parseInit = <T extends SelectionInitMapping | SelectionInitIntervalMapping>(i: T): T['a'][] => {
          return proj.items.map(p => (i[p.channel] !== undefined ? i[p.channel] : i[p.field]));
        };

        if (isIntervalSelection(selDef)) {
          selCmpt.init = parseInit(selDef.init);
        } else {
          const init = isArray(selDef.init) ? selDef.init : [selDef.init];
          selCmpt.init = init.map(parseInit);
        }
      }
    }

    if (keys(timeUnits).length) {
      proj.timeUnit = new TimeUnitNode(null, timeUnits);
    }
  },

  signals: (model, selCmpt, allSignals) => {
    const name = selCmpt.name + TUPLE_FIELDS;
    const hasSignal = allSignals.filter(s => s.name === name);
    return hasSignal.length
      ? allSignals
      : allSignals.concat({
          name,
          value: selCmpt.project.items.map(proj => {
            const {signals, ...rest} = proj;
            return rest;
          })
        });
  }
};

export default project;

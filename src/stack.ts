import {SUM_OPS} from './aggregate';
import {Channel, STACK_BY_CHANNELS, StackByChannel, X, X2, Y, Y2} from './channel';
import {channelHasField, Encoding, isAggregate} from './encoding';
import {Field, FieldDef, getFieldDef, isFieldDef, PositionFieldDef} from './fielddef';
import * as log from './log';
import {AREA, BAR, CIRCLE, isMarkDef, LINE, Mark, MarkDef, POINT, RULE, SQUARE, TEXT, TICK} from './mark';
import {ScaleType} from './scale';
import {contains, isArray} from './util';


export type StackOffset = 'zero' | 'center' | 'normalize' | 'none';

export interface StackProperties {
  /** Dimension axis of the stack. */
  groupbyChannel: 'x' | 'y';

  /** Measure axis of the stack. */
  fieldChannel: 'x' | 'y';

  /** Stack-by fields e.g., color, detail */
  stackBy: {
    fieldDef: FieldDef<string>,
    channel: StackByChannel
  }[];

  /**
   * Modes for stacking marks:
   * - `zero`: stacking with baseline offset at zero value of the scale (for creating typical stacked [bar](mark.html#stacked-bar-chart) and [area](mark.html#stacked-area-chart) chart).
   * - `normalize` - stacking with normalized domain (for creating normalized stacked [bar](mark.html#normalized-stacked-bar-chart) and [area](mark.html#normalized-stacked-area-chart) chart). <br/>
   * -`center` - stacking with center baseline (for [streamgraph](mark.html#streamgraph)).
   * - `none` - No-stacking. This will produce layered [bar](mark.html#layered-bar-chart) and area chart.
   *
   * __Default value:__ `zero` for plots with all of the following conditions: (1) `bar` or `area` marks (2) `color`, `opacity`, `size`, or `detail` channel mapped to a group-by field (3) One ordinal or nominal axis, and (4) one quantitative axis with linear scale and summative aggregation function (e.g., `sum`, `count`).
   */
  offset: StackOffset;

  /**
   * Whether this stack will produce impute transform
   */
  impute: boolean;
}

export const STACKABLE_MARKS = [BAR, AREA, RULE, POINT, CIRCLE, SQUARE, LINE, TEXT, TICK];
export const STACK_BY_DEFAULT_MARKS = [BAR, AREA];

// Note: CompassQL uses this method and only pass in required properties of each argument object.
// If required properties change, make sure to update CompassQL.

export function stack(m: Mark | MarkDef, encoding: Encoding<Field>, stackConfig: StackOffset): StackProperties {
  const mark = isMarkDef(m) ? m.type : m;
  // Should have stackable mark
  if (!contains(STACKABLE_MARKS, mark)) {
    return null;
  }

  // Should be aggregate plot
  if (!isAggregate(encoding)) {
    return null;
  }

  // Should have grouping level of detail
  const stackBy = STACK_BY_CHANNELS.reduce((sc, channel) => {
    if (channelHasField(encoding, channel)) {
      const channelDef = encoding[channel];
      (isArray(channelDef) ? channelDef : [channelDef]).forEach((cDef) => {
        const fieldDef = getFieldDef(cDef);
        if (!fieldDef.aggregate) {
          sc.push({
            channel: channel,
            fieldDef: fieldDef
          });
        }
      });
    }
    return sc;
  }, []);

  if (stackBy.length === 0) {
    return null;
  }

  // Has only one aggregate axis
  const hasXField = isFieldDef(encoding.x);
  const hasYField = isFieldDef(encoding.y);
  const xIsAggregate = isFieldDef(encoding.x) && !!encoding.x.aggregate;
  const yIsAggregate = isFieldDef(encoding.y) && !!encoding.y.aggregate;

  if (xIsAggregate !== yIsAggregate) {
    const fieldChannel = xIsAggregate ? X : Y;
    const fieldDef = encoding[fieldChannel] as PositionFieldDef<string>;
    const fieldChannelAggregate = fieldDef.aggregate;
    const fieldChannelScale = fieldDef.scale;

    let stackOffset: StackOffset = null;
    if (fieldDef.stack !== undefined) {
      stackOffset = fieldDef.stack;
    } else if (contains(STACK_BY_DEFAULT_MARKS, mark)) {
      // Bar and Area with sum ops are automatically stacked by default
      stackOffset = stackConfig === undefined ? 'zero' : stackConfig;
    } else {
      stackOffset = stackConfig;
    }

    if (!stackOffset || stackOffset === 'none') {
      return null;
    }

    // If stacked, check if it qualifies for stacking (and log warning if not qualified.)
    if (fieldChannelScale && fieldChannelScale.type && fieldChannelScale.type !== ScaleType.LINEAR) {
      log.warn(log.message.cannotStackNonLinearScale(fieldChannelScale.type));
      return null;
    }

    if (channelHasField(encoding, fieldChannel === X ? X2 : Y2)) {
      log.warn(log.message.cannotStackRangedMark(fieldChannel));
      return null;
    }

    if (!contains(SUM_OPS, fieldChannelAggregate)) {
      log.warn(log.message.cannotStackNonSummativeAggregate(fieldChannelAggregate));
      return null;
    }

    return {
      groupbyChannel: xIsAggregate ? (hasYField ? Y : null) : (hasXField ? X : null),
      fieldChannel: fieldChannel,
      impute: contains(['area', 'line'], mark),
      stackBy: stackBy,
      offset: stackOffset
    };
  }
  return null;
}

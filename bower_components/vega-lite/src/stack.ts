import {Channel, STACK_GROUP_CHANNELS, X, Y} from './channel';
import {Config} from './config';
import {Encoding, has, isAggregate} from './encoding';
import {Mark, BAR, AREA} from './mark';
import {contains} from './util';

export enum StackOffset {
  ZERO = 'zero' as any,
  CENTER = 'center' as any,
  NORMALIZE = 'normalize' as any,
  NONE = 'none' as any
}

export interface StackProperties {
  /** Dimension axis of the stack ('x' or 'y'). */
  groupbyChannel: Channel;

  /** Measure axis of the stack ('x' or 'y'). */
  fieldChannel: Channel;

  /** Stack-by channels e.g., color, detail */
  stackByChannels: Channel[];

  /** Stack offset property. */
  offset: StackOffset;
}

export function stack(mark: Mark, encoding: Encoding, config: Config): StackProperties {
  const stacked = (config && config.mark) ? config.mark.stacked : undefined;

  // Should not have stack explicitly disabled
  if (contains([StackOffset.NONE, null, false], stacked)) {
    return null;
  }

  // Should have stackable mark
  if (!contains([BAR, AREA], mark)) {
    return null;
  }

  // Should be aggregate plot
  if (!isAggregate(encoding)) {
    return null;
  }

  // Should have grouping level of detail
  const stackByChannels = STACK_GROUP_CHANNELS.reduce((sc, channel) => {
    if (has(encoding, channel) && !encoding[channel].aggregate) {
      sc.push(channel);
    }
    return sc;
  }, []);

  if (stackByChannels.length === 0) {
    return null;
  }

  // Has only one aggregate axis
  const hasXField = has(encoding, X);
  const hasYField = has(encoding, Y);
  const xIsAggregate = hasXField && !!encoding.x.aggregate;
  const yIsAggregate = hasYField && !!encoding.y.aggregate;

  if (xIsAggregate !== yIsAggregate) {
    return {
      groupbyChannel: xIsAggregate ? (hasYField ? Y : null) : (hasXField ? X : null),
      fieldChannel: xIsAggregate ? X : Y,
      stackByChannels: stackByChannels,
      offset: stacked || StackOffset.ZERO
    };
  }
  return null;
}

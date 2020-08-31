/**
 * Utility files for producing Vega ValueRef for marks
 */
import {SignalRef} from 'vega-typings/types';
import {getOffsetChannel, PolarPositionChannel, PositionChannel} from '../../../channel';
import {Mark, MarkDef} from '../../../mark';

export function getOffset(
  channel: PositionChannel | PolarPositionChannel,
  markDef: MarkDef<Mark, SignalRef>
): number | SignalRef {
  const offsetChannel = getOffsetChannel(channel);

  // TODO: in the future read from encoding channel too
  const markDefOffsetValue = markDef[offsetChannel];
  if (markDefOffsetValue) {
    return markDefOffsetValue;
  }

  return undefined;
}

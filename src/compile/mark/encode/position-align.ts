import {Align, SignalRef, TextBaseline} from 'vega';
import {getVgPositionChannel} from '../../../channel';
import {Config} from '../../../config';
import * as log from '../../../log';
import {Mark, MarkDef} from '../../../mark';
import {isSignalRef, VgEncodeChannel} from '../../../vega.schema';
import {getMarkPropOrConfig} from '../../common';

const ALIGNED_X_CHANNEL: Record<Align, VgEncodeChannel> = {
  left: 'x',
  center: 'xc',
  right: 'x2'
};

const BASELINED_Y_CHANNEL = {
  top: 'y',
  middle: 'yc',
  bottom: 'y2'
};

export function vgAlignedPositionChannel(
  channel: 'x' | 'y' | 'radius' | 'theta',
  markDef: MarkDef<Mark, SignalRef>,
  config: Config<SignalRef>,
  defaultAlign: 'top' | 'middle' = 'middle'
) {
  if (channel === 'radius' || channel === 'theta') {
    return getVgPositionChannel(channel);
  }
  const alignChannel = channel === 'x' ? 'align' : 'baseline';
  const align = getMarkPropOrConfig(alignChannel, markDef, config);

  let alignExcludingSignal: Align | TextBaseline;

  if (isSignalRef(align)) {
    log.warn(log.message.rangeMarkAlignmentCannotBeExpression(alignChannel));
    alignExcludingSignal = undefined;
  } else {
    alignExcludingSignal = align;
  }

  if (channel === 'x') {
    return ALIGNED_X_CHANNEL[alignExcludingSignal || (defaultAlign === 'top' ? 'left' : 'center')];
  } else {
    return BASELINED_Y_CHANNEL[alignExcludingSignal || defaultAlign];
  }
}

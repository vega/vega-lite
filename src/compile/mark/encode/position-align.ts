import {Align} from 'vega';
import {Config} from '../../../config';
import {MarkDef} from '../../../mark';
import {VgEncodeChannel} from '../../../vega.schema';
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

export function alignedPositionChannel(channel: 'x' | 'y', markDef: MarkDef, config: Config) {
  const alignChannel = channel === 'x' ? 'align' : 'baseline';
  const align = getMarkPropOrConfig(alignChannel, markDef, config);
  if (channel === 'x') {
    return ALIGNED_X_CHANNEL[align ?? 'center'];
  } else {
    return BASELINED_Y_CHANNEL[align ?? 'middle'];
  }
}

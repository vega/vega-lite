import {Align} from 'vega';
import {getVgPositionChannel} from '../../../channel';
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

export function vgAlignedPositionChannel(
  channel: 'x' | 'y' | 'radius' | 'theta',
  markDef: MarkDef,
  config: Config,
  defaultAlign: 'top' | 'middle' = 'middle'
) {
  if (channel === 'radius' || channel === 'theta') {
    return getVgPositionChannel(channel);
  }
  const alignChannel = channel === 'x' ? 'align' : 'baseline';
  const align = getMarkPropOrConfig(alignChannel, markDef, config);
  if (channel === 'x') {
    return ALIGNED_X_CHANNEL[align || (defaultAlign === 'top' ? 'left' : 'center')];
  } else {
    return BASELINED_Y_CHANNEL[align || defaultAlign];
  }
}

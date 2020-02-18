import {Align} from 'vega-typings';
import {Config} from '../../../config';
import {MarkDef} from '../../../mark';
import {getFirstDefined} from '../../../util';
import {VgEncodeChannel} from '../../../vega.schema';
import {getMarkConfig} from '../../common';

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
  const align = getFirstDefined(markDef[alignChannel], getMarkConfig(alignChannel, markDef, config));
  if (channel === 'x') {
    return ALIGNED_X_CHANNEL[align ?? 'center'];
  } else {
    return BASELINED_Y_CHANNEL[align ?? 'middle'];
  }
}

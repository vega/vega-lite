import {getVgPositionChannel} from '../../../channel.js';
import * as log from '../../../log/index.js';
import {isSignalRef} from '../../../vega.schema.js';
import {getMarkPropOrConfig} from '../../common.js';
const ALIGNED_X_CHANNEL = {
  left: 'x',
  center: 'xc',
  right: 'x2',
};
const BASELINED_Y_CHANNEL = {
  top: 'y',
  middle: 'yc',
  bottom: 'y2',
};
export function vgAlignedPositionChannel(channel, markDef, config, defaultAlign = 'middle') {
  if (channel === 'radius' || channel === 'theta') {
    return getVgPositionChannel(channel);
  }
  const alignChannel = channel === 'x' ? 'align' : 'baseline';
  const align = getMarkPropOrConfig(alignChannel, markDef, config);
  let alignExcludingSignal;
  if (isSignalRef(align)) {
    log.warn(log.message.rangeMarkAlignmentCannotBeExpression(alignChannel));
    alignExcludingSignal = undefined;
  } else {
    alignExcludingSignal = align;
  }
  // FIXME: remove as any
  if (channel === 'x') {
    return ALIGNED_X_CHANNEL[alignExcludingSignal || (defaultAlign === 'top' ? 'left' : 'center')];
  } else {
    return BASELINED_Y_CHANNEL[alignExcludingSignal || defaultAlign];
  }
}
//# sourceMappingURL=position-align.js.map

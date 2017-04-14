import {Channel, COLUMN, X} from '../../channel';
import {NOMINAL, ORDINAL, TEMPORAL} from '../../type';
import {contains, extend, keys} from '../../util';
import {VgAxis} from '../../vega.schema';

import {timeFormatExpression} from '../common';
import {Model} from '../model';

export function labels(model: Model, channel: Channel, labelsSpec: any, def: VgAxis) {
  const fieldDef = model.fieldDef(channel);
  const axis = model.axis(channel);
  const config = model.config;

  // Text
  if (fieldDef.type === TEMPORAL) {
    labelsSpec = extend({
      text: {
        signal: timeFormatExpression('datum.value', fieldDef.timeUnit, axis.format, config.axis.shortTimeLabels, config.timeFormat)
      }
    }, labelsSpec);
  }

  // Label Angle
  if (axis.labelAngle !== undefined) {
    labelsSpec.angle = {value: axis.labelAngle};
  } else {
    // auto rotate for X
    if (channel === X && (contains([NOMINAL, ORDINAL], fieldDef.type) || !!fieldDef.bin || fieldDef.type === TEMPORAL)) {
      labelsSpec.angle = {value: 270};
    }
  }

  // Auto set align if rotated
  // TODO: consider other value besides 270, 90
  if (labelsSpec.angle) {
    if (labelsSpec.angle.value === 270) {
      labelsSpec.align = {
        value: def.orient === 'top' ? 'left':
                (channel === X || channel === COLUMN) ? 'right' :
                'center'
      };
    } else if (labelsSpec.angle.value === 90) {
      labelsSpec.align = {value: 'center'};
    }
  }

  if (labelsSpec.angle) {
    // Auto set baseline if rotated
    // TODO: consider other value besides 270, 90
    if (labelsSpec.angle.value === 270) {
      labelsSpec.baseline = {value: (channel === X || channel === COLUMN) ? 'middle' : 'bottom'};
    } else if (labelsSpec.angle.value === 90) {
      labelsSpec.baseline = {value: 'bottom'};
    }
  }

  return keys(labelsSpec).length === 0 ? undefined : labelsSpec;
}

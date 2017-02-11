import {X, X2, Y, Y2} from '../../channel';
import {isFieldDef} from '../../fielddef';
import {ScaleType, hasDiscreteDomain} from '../../scale';
import {RECT} from '../../mark';
import {extend} from '../../util';
import * as log from '../../log';
import {VgEncodeEntry} from '../../vega.schema';

import {applyColorAndOpacity} from './common';
import {UnitModel} from '../unit';

import {MarkCompiler} from './base';
import * as ref from './valueref';

export const rect: MarkCompiler = {
  vgMark: 'rect',
  role: undefined,
  encodeEntry: (model: UnitModel) => {
    let e: VgEncodeEntry = extend(
      x(model),
      y(model)
    );
    applyColorAndOpacity(e, model);
    return e;
  }
};

function x(model: UnitModel) {
  let e: VgEncodeEntry = {};

  const xDef = model.encoding.x;
  const x2Def = model.encoding.x2;
  const xScaleName = model.scaleName(X);
  const xScale = model.scale(X);

  if (isFieldDef(xDef) && xDef.bin && !x2Def) { // TODO: better check for bin
    e.x2 = ref.bin(xDef, xScaleName, 'start');
    e.x = ref.bin(xDef, xScaleName, 'end');
  } else if (xScale && hasDiscreteDomain(xScale.type)) {
    /* istanbul ignore else */
    if (xScale.type === ScaleType.BAND) {
      e.x = ref.fieldRef(xDef, xScaleName, {});
      e.width = ref.band(xScaleName);
    } else {
      // We don't support rect mark with point/ordinal scale
      throw new Error(log.message.scaleTypeNotWorkWithMark(RECT, xScale.type));
    }
    // TODO: Currently we only support band scale for rect -- support point-ordinal axis case (if we support arbitrary scale type)
  } else { // continuous scale or no scale
    e.x = ref.midPoint(X, xDef, xScaleName, xScale, 'baseOrMax');
    e.x2 = ref.midPoint(X2, x2Def, xScaleName, xScale, 'base');
  }
  return e;
}

function y(model: UnitModel) {
  let e: VgEncodeEntry = {};

  const yDef = model.encoding.y;
  const y2Def = model.encoding.y2;
  const yScaleName = model.scaleName(Y);
  const yScale = model.scale(Y);

  if (isFieldDef(yDef) && yDef.bin && !y2Def) { // TODO: better check for bin
    e.y2 = ref.bin(yDef, yScaleName, 'start');
    e.y = ref.bin(yDef, yScaleName, 'end');
  } else if (yScale && hasDiscreteDomain(yScale.type)) {
    /* istanbul ignore else */
    if (yScale.type === ScaleType.BAND) {
      e.y = ref.fieldRef(yDef, yScaleName, {});
      e.height = ref.band(yScaleName);
    } else {
      // We don't support rect mark with point/ordinal scale
      throw new Error(log.message.scaleTypeNotWorkWithMark(RECT, yScale.type));
    }
  } else { // continuous scale or no scale
    e.y = ref.midPoint(Y, yDef, yScaleName, yScale, 'baseOrMax');
    e.y2 = ref.midPoint(Y2, y2Def, yScaleName, yScale, 'base');
  }
  return e;
}

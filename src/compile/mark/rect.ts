import {isBinned, isBinning} from '../../bin';
import {X, Y} from '../../channel';
import {isFieldDef} from '../../fielddef';
import * as log from '../../log';
import {RECT} from '../../mark';
import {hasDiscreteDomain, ScaleType} from '../../scale';
import {VgEncodeEntry} from '../../vega.schema';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as mixins from './mixins';

export const rect: MarkCompiler = {
  vgMark: 'rect',
  encodeEntry: (model: UnitModel) => {
    return {
      ...mixins.baseEncodeEntry(model, {size: 'ignore', orient: 'ignore'}),
      ...x(model),
      ...y(model)
    };
  }
};

export function x(model: UnitModel): VgEncodeEntry {
  const xDef = model.encoding.x;
  const x2Def = model.encoding.x2;
  const xScale = model.getScaleComponent(X);
  const xScaleType = xScale ? xScale.get('type') : undefined;
  const xScaleName = model.scaleName(X);

  if (isFieldDef(xDef) && (isBinning(xDef.bin) || isBinned(xDef.bin))) {
    return mixins.binPosition(xDef, x2Def, X, xScaleName, 0, xScale.get('reverse'));
  } else if (isFieldDef(xDef) && xScale && hasDiscreteDomain(xScaleType)) {
    /* istanbul ignore else */
    if (xScaleType === ScaleType.BAND) {
      return mixins.bandPosition(xDef, 'x', model);
    } else {
      // We don't support rect mark with point/ordinal scale
      throw new Error(log.message.scaleTypeNotWorkWithMark(RECT, xScaleType));
    }
  } else {
    // continuous scale or no scale
    return {
      ...mixins.pointPosition('x', model, 'zeroOrMax'),
      ...mixins.pointPosition2(model, 'zeroOrMin', 'x2')
    };
  }
}

export function y(model: UnitModel): VgEncodeEntry {
  const yDef = model.encoding.y;
  const y2Def = model.encoding.y2;
  const yScale = model.getScaleComponent(Y);
  const yScaleType = yScale ? yScale.get('type') : undefined;
  const yScaleName = model.scaleName(Y);

  if (isFieldDef(yDef) && (isBinning(yDef.bin) || isBinned(yDef.bin))) {
    return mixins.binPosition(yDef, y2Def, Y, yScaleName, 0, yScale.get('reverse'));
  } else if (isFieldDef(yDef) && yScale && hasDiscreteDomain(yScaleType)) {
    /* istanbul ignore else */
    if (yScaleType === ScaleType.BAND) {
      return mixins.bandPosition(yDef, 'y', model);
    } else {
      // We don't support rect mark with point/ordinal scale
      throw new Error(log.message.scaleTypeNotWorkWithMark(RECT, yScaleType));
    }
  } else {
    // continuous scale or no scale
    return {
      ...mixins.pointPosition('y', model, 'zeroOrMax'),
      ...mixins.pointPosition2(model, 'zeroOrMin', 'y2')
    };
  }
}

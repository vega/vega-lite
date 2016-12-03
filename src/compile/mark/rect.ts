import {X, X2, Y, Y2} from '../../channel';
import {ScaleType, hasDiscreteDomain} from '../../scale';
import {RECT} from '../../mark';
import {extend} from '../../util';
import * as log from '../../log';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';
import * as ref from './valueref';

export namespace rect {
  export function markType() {
    return 'rect';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    let p: any = extend(
      x(model),
      y(model)
    );
    applyColorAndOpacity(p, model);
    return p;
  }

  export function x(model: UnitModel) {
    let p: any = {};

    const xFieldDef = model.encoding().x;
    const x2FieldDef = model.encoding().x2;
    const xScaleName = model.scaleName(X);
    const xScale = model.scale(X);

    if (xFieldDef && xFieldDef.bin && !x2FieldDef) { // TODO: better check for bin
      p.x2 = ref.bin(xFieldDef, xScaleName, 'start');
      p.x = ref.bin(xFieldDef, xScaleName, 'end');
    } else if (xScale && hasDiscreteDomain(xScale.type)) {
      /* istanbul ignore else */
      if (xScale.type === ScaleType.BAND) {
        p.x = ref.fieldRef(xFieldDef, xScaleName, {});
        p.width = ref.band(xScaleName);
      } else {
        // We don't support rect mark with point/ordinal scale
        throw new Error(log.message.scaleTypeNotWorkWithMark(RECT, xScale.type));
      }
      // TODO: Currently we only support band scale for rect -- support point-ordinal axis case (if we support arbitrary scale type)
    } else { // continuous scale or no scale
      p.x = ref.midPoint(X, xFieldDef, xScaleName, xScale, 'baseOrMax');
      p.x2 = ref.midPoint(X2, x2FieldDef, xScaleName, xScale, 'base');
    }
    return p;
  }

  export function y(model: UnitModel) {
    let p: any = {};

    const yFieldDef = model.encoding().y;
    const y2FieldDef = model.encoding().y2;
    const yScaleName = model.scaleName(Y);
    const yScale = model.scale(Y);

    if (yFieldDef && yFieldDef.bin && !y2FieldDef) { // TODO: better check for bin
      p.y2 = ref.bin(yFieldDef, yScaleName, 'start');
      p.y = ref.bin(yFieldDef, yScaleName, 'end');
    } else if (yScale && hasDiscreteDomain(yScale.type)) {
      /* istanbul ignore else */
      if (yScale.type === ScaleType.BAND) {
        p.y = ref.fieldRef(yFieldDef, yScaleName, {});
        p.height = ref.band(yScaleName);
      } else {
        // We don't support rect mark with point/ordinal scale
        throw new Error(log.message.scaleTypeNotWorkWithMark(RECT, yScale.type));
      }
    } else { // continuous scale or no scale
      p.y = ref.midPoint(Y, yFieldDef, yScaleName, yScale, 'baseOrMax');
      p.y2 = ref.midPoint(Y2, y2FieldDef, yScaleName, yScale, 'base');
    }
    return p;
  }
}

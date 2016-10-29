import {X, X2, Y, Y2} from '../../channel';
import {ScaleType} from '../../scale';
import {extend} from '../../util';

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
    const config = model.config();

    if (xFieldDef && xFieldDef.bin && !x2FieldDef) { // TODO: better check for bin
      p.x2 = ref.bin(xFieldDef, xScaleName, 'start');
      p.x = ref.bin(xFieldDef, xScaleName, 'end');
    } else if (xScale && xScale.type === ScaleType.ORDINAL) {
      // TODO: Currently we only support band scale for rect -- support point-ordinal axis case (if we support arbitrary scale type)
      p.x = ref.normal(X, xFieldDef, xScaleName, xScale, ref.midX(config));
      p.width = ref.band(xScaleName);

    } else { // continuous scale or no scale
      p.x = ref.normal(X, xFieldDef, xScaleName, xScale, 'baseOrMax');
      p.x2 = ref.normal(X2, x2FieldDef, xScaleName, xScale, 'base');
    }
    return p;
  }

  export function y(model: UnitModel) {
    let p: any = {};

    const yFieldDef = model.encoding().y;
    const y2FieldDef = model.encoding().y2;
    const yScaleName = model.scaleName(Y);
    const yScale = model.scale(Y);
    const config = model.config();

    if (yFieldDef && yFieldDef.bin && !y2FieldDef) { // TODO: better check for bin
      p.y2 = ref.bin(yFieldDef, yScaleName, 'start');
      p.y = ref.bin(yFieldDef, yScaleName, 'end');
    } else if (yScale && yScale.type === ScaleType.ORDINAL) {
      // TODO: Currently we only support band scale for rect -- support point-ordinal ayis case (if we support arbitrary scale type)
      p.y = ref.normal(Y, yFieldDef, yScaleName, yScale, ref.midY(config));
      p.height = ref.band(yScaleName);

    } else { // continuous scale or no scale
      p.y = ref.normal(Y, yFieldDef, yScaleName, yScale, 'baseOrMax');
      p.y2 = ref.normal(Y2, y2FieldDef, yScaleName, yScale, 'base');
    }
    return p;
  }
}

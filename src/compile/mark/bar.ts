import {X, Y, X2, Y2, SIZE} from '../../channel';
import {Config} from '../../config';
import {Scale, ScaleType} from '../../scale';
import {StackProperties} from '../../stack';
import {extend} from '../../util';
import * as log from '../../log';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';
import * as ref from './valueref';
import {VgValueRef} from '../../vega.schema';

export namespace bar {
  export function markType() {
    return 'rect';
  }

  export function properties(model: UnitModel) {
    // TODO Use Vega's marks properties interface
    const stack = model.stack();
    let p: any = extend(
      x(model, stack),
      y(model, stack)
    );
    applyColorAndOpacity(p, model);
    return p;
  }

  export function x(model: UnitModel, stack: StackProperties) {
    let p: any = {};
    const config = model.config();
    const orient = model.config().mark.orient;
    const sizeFieldDef = model.encoding().size;

    const xFieldDef = model.encoding().x;
    const xScaleName = model.scaleName(X);
    const xScale = model.scale(X);
    // x, x2, and width -- we must specify two of these in all conditions
    if (orient === 'horizontal') {
      p.x = ref.stackable(X, xFieldDef, xScaleName, model.scale(X), stack, 'base');
      p.x2 = ref.stackable2(X2, xFieldDef, model.encoding().x2, xScaleName, model.scale(X), stack, 'base');
      return p;
    } else { // vertical
      if (xFieldDef && xFieldDef.field) {
        if (xFieldDef.bin && !sizeFieldDef) {
          // TODO: check scale type = linear

          p.x2 = ref.bin(xFieldDef, xScaleName, 'start', config.bar.binSpacing);
          p.x = ref.bin(xFieldDef, xScaleName, 'end');
          return p;
        } else if (xScale.type === ScaleType.BAND) {
          // TODO: band scale doesn't support size yet
          p.x = ref.fieldRef(xFieldDef, xScaleName, {});
          p.width = ref.band(xScaleName);
          return p;
        }
      }
      // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
      p.xc = ref.midPoint(X, xFieldDef, xScaleName, model.scale(X),
        extend(ref.midX(config), {offset: 1}) // TODO: config.singleBarOffset
      );
      p.width = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
        defaultSizeRef(xScaleName, model.scale(X), config)
      );
      return p;
    }
  }

  export function y(model: UnitModel, stack: StackProperties) {
    let p: any = {};
    const config = model.config();
    const orient = model.config().mark.orient;
    const sizeFieldDef = model.encoding().size;

    const yFieldDef = model.encoding().y;
    const yScaleName = model.scaleName(Y);
    const yScale = model.scale(Y);
    // y, y2 & height -- we must specify two of these in all conditions
    if (orient === 'vertical') {
      p.y = ref.stackable(Y, model.encoding().y, yScaleName, model.scale(Y), stack, 'base');
      p.y2 = ref.stackable2(Y2, model.encoding().y, model.encoding().y2, yScaleName, model.scale(Y), stack, 'base');
      return p;
    } else {
      if (yFieldDef && yFieldDef.field) {
        if (yFieldDef.bin && !sizeFieldDef) {
          p.y2 = ref.bin(yFieldDef, yScaleName, 'start');
          p.y = ref.bin(yFieldDef, yScaleName, 'end', config.bar.binSpacing);
          return p;
        } else if (yScale.type === ScaleType.BAND) {
          // TODO: band scale doesn't support size yet
          p.y = ref.fieldRef(yFieldDef, yScaleName, {});
          p.height = ref.band(yScaleName);
          return p;
        }
      }
      p.yc = ref.midPoint(Y, yFieldDef, yScaleName, model.scale(Y),
        ref.midY(config)
      );
      p.height = ref.midPoint(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
        defaultSizeRef(yScaleName, model.scale(Y), config)
      );
      return p;
    }
  }

  // TODO: make this a mixins
  function defaultSizeRef(scaleName: string, scale: Scale, config: Config): VgValueRef {
    if (config.bar.discreteBandSize) {
      return {value: config.bar.discreteBandSize};
    }

    if (scale) {
      if (scale.type === ScaleType.POINT) {
        if (scale.rangeStep !== null) {
          return {value: scale.rangeStep - 1};
        }
        log.warn(log.message.BAR_WITH_POINT_SCALE_AND_RANGESTEP_NULL);
      } else if (scale.type === ScaleType.BAND) {
        return ref.band(scaleName);
      } else { // non-ordinal scale
        return {value: config.bar.continuousBandSize};
      }
    }
    if (config.scale.rangeStep && config.scale.rangeStep !== null) {
      return {value: config.scale.rangeStep - 1};
    }
    // TODO: this should depends on cell's width / height?
    return {value: 20};
  }
}

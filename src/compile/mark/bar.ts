import {X, Y, X2, Y2, SIZE} from '../../channel';
import {Config, Orient} from '../../config';
import {field} from '../../fielddef';
import {Scale, ScaleType, BANDSIZE_FIT} from '../../scale';
import {StackProperties} from '../../stack';
import {extend} from '../../util';

import {applyColorAndOpacity} from '../common';
import {UnitModel} from '../unit';
import * as ref from './valueref';

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
    // x, x2, and width -- we must specify two of these in all conditions
    if (orient === Orient.HORIZONTAL) {
      p.x = ref.stackable(X, xFieldDef, xScaleName, model.scale(X), stack, 'base');
      p.x2 = ref.stackable2(X2, xFieldDef, model.encoding().x2, xScaleName, model.scale(X), stack, 'base');
      return p;
    } else { // vertical
      if (xFieldDef && xFieldDef.field) {
        if (xFieldDef.bin && !sizeFieldDef) {
          // TODO: check scale type = linear

          p.x2 = ref.bin(xFieldDef, xScaleName, 'start', config.mark.binnedBarSpacing);
          p.x = ref.bin(xFieldDef, xScaleName, 'end');
          return p;
        } else if (model.scale(X).bandSize === BANDSIZE_FIT) {
          // TODO check if scale.type === band (points === false in Vg2) instead if we have the compiled size
          // TODO: bandSize fit doesn't support size yet
          p.x = {
            scale: xScaleName,
            field: field(xFieldDef)
          };
          p.width = {
            scale: xScaleName,
            band: true
          };
          return p;
        }
      }
      // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
      p.xc = ref.normal(X, xFieldDef, xScaleName, model.scale(X),
        extend(ref.midX(config), {offset: 1}) // TODO: config.singleBarOffset
      );
      p.width = ref.normal(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
        {value: defaultSize(xScaleName, model.scale(X), config)}
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
    // y, y2 & height -- we must specify two of these in all conditions
    if (orient === Orient.VERTICAL) {
      p.y = ref.stackable(Y, model.encoding().y, yScaleName, model.scale(Y), stack, 'base');
      p.y2 = ref.stackable2(Y2, model.encoding().y, model.encoding().y2, yScaleName, model.scale(Y), stack, 'base');
      return p;
    } else {
      if (yFieldDef && yFieldDef.field) {
        if (yFieldDef.bin && !sizeFieldDef) {
          p.y2 = ref.bin(yFieldDef, yScaleName, 'start');
          p.y = ref.bin(yFieldDef, yScaleName, 'end', config.mark.binnedBarSpacing);
          return p;
        } else if (model.scale(Y).bandSize === BANDSIZE_FIT) {
          // TODO: bandSize fit doesn't support size yet
          p.y = {
            scale: yScaleName,
            field: field(yFieldDef)
          };
          p.height = ref.band(yScaleName);
          return p;
        }
      }
      p.yc = ref.normal(Y, yFieldDef, yScaleName, model.scale(Y),
        ref.midY(config)
      );
      p.height = ref.normal(SIZE, model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
        {value: defaultSize(yScaleName, model.scale(Y), config)}
      );
      return p;
    }
  }

  // TODO: make this a mixins
  function defaultSize(scaleName: string, scale: Scale, config: Config) {
    const markConfig = config.mark;
    if (markConfig.barSize) {
      return markConfig.barSize;
    }
    if (typeof scale.bandSize === 'string') {
      throw new Error('Default size is not able to handle non-numeric sizes');
    }
    if (typeof config.scale.bandSize === 'string') {
      throw new Error('Default size is not able to handle non-numeric sizes');
    }
    // BAR's size is applied on either X or Y
    return scale && scale.type === ScaleType.ORDINAL ?
        // For ordinal scale or single bar, we can use bandSize - 1
        // (-1 so that the border of the bar falls on exact pixel)
        scale.bandSize - 1 :
        // TODO: {band: true} ?
      scaleName ?
        // set to thinBarWidth by default for non-ordinal scale
        markConfig.barThinSize :
        // if there is no size (x or y) axis, just use bandSize -1
        // TODO: revise if we really need the -1
        config.scale.bandSize - 1;
  }
}

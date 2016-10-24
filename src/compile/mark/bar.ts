import {X, Y, SIZE} from '../../channel';
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
    // x, x2, and width -- we must specify two of these in all conditions
    if (orient === Orient.HORIZONTAL) {
      p.x = ref.stackableX(xFieldDef, model.scaleName(X), model.scale(X), stack, 'baseX');
      p.x2 = ref.stackableX2(xFieldDef, model.encoding().x2, model.scaleName(X), model.scale(X), stack, 'baseX');
      return p;
    } else { // vertical
      if (xFieldDef && xFieldDef.field) {
        if (xFieldDef.bin && !sizeFieldDef) {
          // TODO: check scale type = linear
          p.x2 = {
            scale: model.scaleName(X),
            field: field(xFieldDef, { binSuffix: 'start' }),
            offset: config.mark.binnedBarSpacing
          };
          p.x = {
            scale: model.scaleName(X),
            field: field(xFieldDef, { binSuffix: 'end' })
          };
          return p;
        } else if (model.scale(X).bandSize === BANDSIZE_FIT) {
          // TODO check if scale.type === band (points === false in Vg2) instead if we have the compiled size
          // TODO: bandSize fit doesn't support size yet
          p.x = {
            scale: model.scaleName(X),
            field: field(xFieldDef),
            offset: 0.5 // TODO offset or padding
          };
          p.width = {
            scale: model.scaleName(X),
            band: true,
            offset: -0.5 // TODO offset or padding
          };
          return p;
        }
      }
      // sized bin, normal point-ordinal axis, quantitative x-axis, or no x
      p.xc = ref.normal(xFieldDef, model.scaleName(X), model.scale(X),
        extend(ref.midX(config), {offset: 1}) // TODO: config.singleBarOffset
      );
      p.width = ref.normal(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
        {value: defaultSize(model.scaleName(X), model.scale(X), config)}
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
    // y, y2 & height -- we must specify two of these in all conditions
    if (orient !== Orient.HORIZONTAL) {
      p.y = ref.stackableY(model.encoding().y, model.scaleName(Y), model.scale(Y), stack, 'baseY');
      p.y2 = ref.stackableY2(model.encoding().y, model.encoding().y2, model.scaleName(Y), model.scale(Y), stack, 'baseY');
      return p;
    } else {
      if (yFieldDef && yFieldDef.field) {
        if (yFieldDef.bin && !sizeFieldDef) {
          p.y2 = {
            scale: model.scaleName(Y),
            field: field(yFieldDef, { binSuffix: 'start' })
          };
          p.y = {
            scale: model.scaleName(Y),
            field: field(yFieldDef, { binSuffix: 'end' }),
            offset: config.mark.binnedBarSpacing
          };
          return p;
        } else if (model.scale(Y).bandSize === BANDSIZE_FIT) {
          // TODO: bandSize fit doesn't support size yet
          p.y = {
            scale: model.scaleName(Y),
            field: field(yFieldDef),
            offset: 0.5 // TODO offset or padding
          };
          p.height = {
            scale: model.scaleName(Y),
            band: true,
            offset: -0.5 // TODO offset or padding
          };
          return p;
        }
      }
      p.yc = ref.normal(yFieldDef, model.scaleName(Y), model.scale(Y),
        ref.midY(config) // TODO: config.singleBarOffset
      );
      p.height = ref.normal(model.encoding().size, model.scaleName(SIZE), model.scale(SIZE),
        {value: defaultSize(model.scaleName(Y), model.scale(Y), config)}
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

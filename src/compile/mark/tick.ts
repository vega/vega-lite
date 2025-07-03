import {getMarkPropOrConfig, signalOrValueRef} from '../common.js';
import {UnitModel} from '../unit.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const tick: MarkCompiler = {
  vgMark: 'rect',

  encodeEntry: (model: UnitModel) => {
    const {config, markDef} = model;
    const orient = markDef.orient;

    const vgSizeAxisChannel = orient === 'horizontal' ? 'x' : 'y';
    const vgThicknessAxisChannel = orient === 'horizontal' ? 'y' : 'x';
    const vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';

    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'ignore',
        size: 'ignore',
        theta: 'ignore',
      }),

      ...encode.rectPosition(model, vgSizeAxisChannel),
      ...encode.pointPosition(vgThicknessAxisChannel, model, {
        defaultPos: 'mid',
        vgChannel: vgThicknessAxisChannel === 'y' ? 'yc' : 'xc',
      }),
      [vgThicknessChannel]: signalOrValueRef(getMarkPropOrConfig('thickness', markDef, config)),
    };
  },
};

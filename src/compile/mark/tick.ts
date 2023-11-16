import {getMarkPropOrConfig, signalOrValueRef} from '../common';
import {UnitModel} from '../unit';
import {MarkCompiler} from './base';
import * as encode from './encode';

export const tick: MarkCompiler = {
  vgMark: 'rect',

  encodeEntry: (model: UnitModel) => {
    const {config, markDef} = model;
    const orient = markDef.orient;

    const vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';

    const baseAndThickness = {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'ignore',
        size: 'ignore',
        theta: 'ignore'
      }),
      [vgThicknessChannel]: signalOrValueRef(getMarkPropOrConfig('thickness', markDef, config))
    };

    if (orient === 'horizontal') {
      return {
        ...baseAndThickness,
        ...encode.rectPosition(model, 'x'),
        ...encode.pointPosition('y', model, {defaultPos: 'mid', vgChannel: 'yc'})
      };
    } else {
      // vertical
      return {
        ...baseAndThickness,
        ...encode.pointPosition('x', model, {defaultPos: 'mid', vgChannel: 'xc'}),
        ...encode.rectPosition(model, 'y')
      };
    }
  }
};

import {UnitModel} from '../unit.js';
import {stringValue} from 'vega-util';
import {isAreaSizeThickness} from '../../encoding.js';
import {VgValueRef} from '../../vega.schema.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';
import {valueRefToExpr} from './encode/corner-radius.js';

export const area: MarkCompiler = {
  vgMark: 'area',
  encodeEntry: (model: UnitModel) => {
    const thickness = isAreaSizeThickness(model.mark, model.encoding) ? getAreaThicknessRef(model) : undefined;
    const preferXThickness = model.markDef.orient === 'horizontal';

    if (thickness && preferXThickness) {
      const xCenter = encode.pointPosition('x', model, {defaultPos: 'mid'}).x as AreaValueRef;
      return {
        ...encode.baseEncodeEntry(model, {
          align: 'ignore',
          baseline: 'ignore',
          color: 'include',
          orient: 'include',
          size: 'ignore',
          theta: 'ignore',
        }),
        ...encode.pointPosition('y', model, {defaultPos: 'zeroOrMin'}),
        x: withThicknessOffset(xCenter, thickness, 0.5),
        x2: withThicknessOffset(xCenter, thickness, -0.5),
        ...encode.defined(model),
      };
    }

    if (thickness) {
      const yCenter = encode.pointPosition('y', model, {defaultPos: 'mid'}).y as AreaValueRef;
      return {
        ...encode.baseEncodeEntry(model, {
          align: 'ignore',
          baseline: 'ignore',
          color: 'include',
          orient: 'include',
          size: 'ignore',
          theta: 'ignore',
        }),
        ...encode.pointPosition('x', model, {defaultPos: 'zeroOrMin'}),
        y: withThicknessOffset(yCenter, thickness, 0.5),
        y2: withThicknessOffset(yCenter, thickness, -0.5),
        ...encode.defined(model),
      };
    }
    const xRangeFromOffset = model.isRangedOffset('x');
    const yRangeFromOffset = model.isRangedOffset('y');
    const hasOffsetDrivenRange = xRangeFromOffset || yRangeFromOffset;
    const xIsRange = xRangeFromOffset || (!hasOffsetDrivenRange && model.markDef.orient === 'horizontal');
    const yIsRange = yRangeFromOffset || (!hasOffsetDrivenRange && model.markDef.orient === 'vertical');
    const yDefaultPos = yRangeFromOffset && !model.encoding.y ? 'zeroOrMax' : 'zeroOrMin';

    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'include',
        size: 'ignore',
        theta: 'ignore',
      }),
      ...encode.pointOrRangePosition('x', model, {
        defaultPos: 'zeroOrMin',
        defaultPos2: 'zeroOrMin',
        range: xIsRange,
      }),
      ...encode.pointOrRangePosition('y', model, {
        defaultPos: yDefaultPos,
        defaultPos2: 'zeroOrMin',
        range: yIsRange,
      }),
      ...encode.defined(model),
    };
  },
};

type AreaValueRef = VgValueRef | VgValueRef[];

function getAreaThicknessRef(model: UnitModel): AreaValueRef {
  return encode.nonPosition('size', model).size as AreaValueRef;
}

function halfThicknessRef(thickness: VgValueRef, factor: number): VgValueRef {
  return {
    ...thickness,
    mult: (thickness.mult ?? 1) * factor,
  };
}

export function withThicknessOffset(center: AreaValueRef, thickness: AreaValueRef, factor: number): AreaValueRef {
  const refs: VgValueRef[] = [];

  for (const centerRef of Array.isArray(center) ? center : [center]) {
    for (const thicknessRef of Array.isArray(thickness) ? thickness : [thickness]) {
      const centerTest = centerRef.test;
      const thicknessTest = thicknessRef.test;
      const test = centerTest && thicknessTest ? `(${centerTest}) && (${thicknessTest})` : centerTest || thicknessTest;
      const {test: _centerTest, ...centerWithoutTest} = centerRef;
      const {test: _thicknessTest, ...thicknessWithoutTest} = thicknessRef;
      refs.push({
        ...(test ? {test} : {}),
        ...withOffset(centerWithoutTest, halfThicknessRef(thicknessWithoutTest, factor)),
      });
    }
  }

  return refs.length === 1 ? refs[0] : refs;
}

function withOffset(baseRef: VgValueRef, offset: VgValueRef): VgValueRef {
  if (baseRef.offset) {
    const baseOffset =
      typeof baseRef.offset === 'number' ? stringValue(baseRef.offset) : valueRefToExpr(baseRef.offset as VgValueRef);
    const offsetExpr = valueRefToExpr(offset);
    if (baseOffset === undefined || offsetExpr === undefined) {
      throw new Error('Cannot combine area thickness with the positional offset.');
    }
    return {
      ...baseRef,
      offset: {
        signal: `${baseOffset} + ${offsetExpr}`,
      },
    };
  }

  return {
    ...baseRef,
    offset,
  };
}

import {UnitModel} from '../unit.js';
import {getSecondaryRangeChannel} from '../../channel.js';
import {isFieldDef, isFieldOrDatumDef, isValueDef} from '../../channeldef.js';
import {isAreaSizeThickness} from '../../encoding.js';
import {isContinuous} from '../../type.js';
import {VgValueRef} from '../../vega.schema.js';
import {MarkCompiler} from './base.js';
import * as encode from './encode/index.js';

export const area: MarkCompiler = {
  vgMark: 'area',
  encodeEntry: (model: UnitModel) => {
    const thickness = isAreaSizeThickness(model.mark, model.encoding) ? getAreaThicknessRef(model) : undefined;
    const preferXThickness = model.markDef.orient === 'horizontal';

    if (thickness && preferXThickness && hasThicknessRangeFromSize(model, 'x')) {
      const xCenter = encode.pointPosition('x', model, {defaultPos: 'mid'}).x as AreaValueRef;
      const xDivisor = offsetThicknessDivisor(model, 'x');
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
        x: withThicknessOffset(xCenter, thickness, 0.5, xDivisor),
        x2: withThicknessOffset(xCenter, thickness, -0.5, xDivisor),
        ...encode.defined(model),
      };
    }

    if (thickness && hasThicknessRangeFromSize(model, 'y')) {
      const yCenter = encode.pointPosition('y', model, {defaultPos: 'mid'}).y as AreaValueRef;
      const yDivisor = offsetThicknessDivisor(model, 'y');
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
        y: withThicknessOffset(yCenter, thickness, 0.5, yDivisor),
        y2: withThicknessOffset(yCenter, thickness, -0.5, yDivisor),
        ...encode.defined(model),
      };
    }

    if (thickness && hasThicknessRangeFromSize(model, 'x')) {
      const xCenter = encode.pointPosition('x', model, {defaultPos: 'mid'}).x as AreaValueRef;
      const xDivisor = offsetThicknessDivisor(model, 'x');
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
        x: withThicknessOffset(xCenter, thickness, 0.5, xDivisor),
        x2: withThicknessOffset(xCenter, thickness, -0.5, xDivisor),
        ...encode.defined(model),
      };
    }

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
        range: model.markDef.orient === 'horizontal',
      }),
      ...encode.pointOrRangePosition('y', model, {
        defaultPos: 'zeroOrMin',
        defaultPos2: 'zeroOrMin',
        range: model.markDef.orient === 'vertical',
      }),
      ...encode.defined(model),
    };
  },
};

function hasThicknessRangeFromSize(model: UnitModel, channel: 'x' | 'y'): boolean {
  const {encoding} = model;
  const channelDef = encoding[channel];
  const channel2 = getSecondaryRangeChannel(channel);

  if (!isAreaSizeThickness(model.mark, encoding) || encoding[channel2]) {
    return false;
  }

  if (!(isFieldOrDatumDef(channelDef) || isValueDef(channelDef))) {
    return false;
  }

  if (channel === 'y') {
    return !!encoding.x;
  }

  return !!encoding.y;
}

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

function thicknessOffsetRef(thickness: VgValueRef, factor: number, divisorExpr?: string): VgValueRef {
  const half = halfThicknessRef(thickness, factor);
  if (!divisorExpr) {
    return half;
  }

  return {
    signal: `(${valueRefExpr(half)}) / (${divisorExpr})`,
  };
}

function withThicknessOffset(
  center: AreaValueRef,
  thickness: AreaValueRef,
  factor: number,
  divisorExpr?: string,
): AreaValueRef {
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
        ...withOffset(centerWithoutTest, thicknessOffsetRef(thicknessWithoutTest, factor, divisorExpr)),
      });
    }
  }

  return refs.length === 1 ? refs[0] : refs;
}

function offsetThicknessDivisor(model: UnitModel, channel: 'x' | 'y'): string | undefined {
  const {encoding} = model;
  const offsetChannel = channel === 'y' ? 'yOffset' : 'xOffset';
  const offsetDef = encoding[offsetChannel];

  if (isFieldDef(offsetDef) && !isContinuous(offsetDef.type)) {
    const offsetScaleName = model.scaleName(offsetChannel);
    return `max(1, domain('${offsetScaleName}').length)`;
  }

  return undefined;
}

function withOffset(baseRef: VgValueRef, offset: VgValueRef): VgValueRef {
  if (baseRef.offset) {
    return {
      ...baseRef,
      offset: {
        signal: `${valueRefExpr(baseRef.offset as VgValueRef)} + ${valueRefExpr(offset)}`,
      },
    };
  }

  return {
    ...baseRef,
    offset,
  };
}

function valueRefExpr(v: VgValueRef): string {
  let base: string;

  if ('signal' in v && v.signal !== undefined) {
    base = `(${v.signal})`;
  } else if ('scale' in v && v.scale) {
    if ('field' in v && v.field !== undefined) {
      const field =
        typeof v.field === 'string'
          ? `datum['${v.field}']`
          : 'field' in v.field && typeof v.field.field === 'string'
            ? `datum['${v.field.field}']`
            : '0';
      base = `scale('${v.scale}', ${field})`;
    } else if ('value' in v && v.value !== undefined) {
      base = `scale('${v.scale}', ${v.value})`;
    } else {
      base = `scale('${v.scale}', 0)`;
    }
  } else if ('value' in v && v.value !== undefined) {
    base = `${v.value}`;
  } else {
    base = '0';
  }

  if ('mult' in v && v.mult !== undefined) {
    base = `(${base}) * (${v.mult})`;
  }
  if ('offset' in v && v.offset !== undefined) {
    base = `(${base}) + (${valueRefExpr(v.offset as VgValueRef)})`;
  }

  return base;
}

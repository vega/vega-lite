import {UnitModel} from '../unit.js';
import {stringValue} from 'vega-util';
import {getSecondaryRangeChannel} from '../../channel.js';
import {isFieldOrDatumDef, isValueDef} from '../../channeldef.js';
import {isAreaSizeThickness} from '../../encoding.js';
import {flatAccessWithDatum} from '../../util.js';
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

    if (thickness && hasThicknessRangeFromSize(model, 'y')) {
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

    if (thickness && hasThicknessRangeFromSize(model, 'x')) {
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

function thicknessOffsetRef(thickness: VgValueRef, factor: number): VgValueRef {
  return halfThicknessRef(thickness, factor);
}

function withThicknessOffset(center: AreaValueRef, thickness: AreaValueRef, factor: number): AreaValueRef {
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
        ...withOffset(centerWithoutTest, thicknessOffsetRef(thicknessWithoutTest, factor)),
      });
    }
  }

  return refs.length === 1 ? refs[0] : refs;
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
          ? flatAccessWithDatum(v.field)
          : 'field' in v.field && typeof v.field.field === 'string'
            ? flatAccessWithDatum(v.field.field)
            : '0';
      base = `scale(${stringValue(v.scale)}, ${field})`;
    } else if ('value' in v && v.value !== undefined) {
      base = `scale(${stringValue(v.scale)}, ${stringValue(v.value)})`;
    } else {
      base = `scale(${stringValue(v.scale)}, 0)`;
    }
  } else if ('value' in v && v.value !== undefined) {
    base = stringValue(v.value);
  } else {
    base = '0';
  }

  if ('mult' in v && v.mult !== undefined) {
    base = `(${base}) * (${v.mult})`;
  }
  if ('offset' in v && v.offset !== undefined) {
    const offset = typeof v.offset === 'number' ? stringValue(v.offset) : valueRefExpr(v.offset);
    base = `(${base}) + (${offset})`;
  }

  return base;
}

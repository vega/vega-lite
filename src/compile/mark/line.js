import * as encode from './encode/index.js';
export const line = {
  vgMark: 'line',
  encodeEntry: (model) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'ignore',
        orient: 'ignore',
        theta: 'ignore',
      }),
      ...encode.pointPosition('x', model, {defaultPos: 'mid'}),
      ...encode.pointPosition('y', model, {defaultPos: 'mid'}),
      ...encode.nonPosition('size', model, {
        vgChannel: 'strokeWidth', // VL's line size is strokeWidth
      }),
      ...encode.defined(model),
    };
  },
};
export const trail = {
  vgMark: 'trail',
  encodeEntry: (model) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'include',
        orient: 'ignore',
        theta: 'ignore',
      }),
      ...encode.pointPosition('x', model, {defaultPos: 'mid'}),
      ...encode.pointPosition('y', model, {defaultPos: 'mid'}),
      ...encode.nonPosition('size', model),
      ...encode.defined(model),
    };
  },
};
//# sourceMappingURL=line.js.map

import * as encode from './encode/index.js';
export const rect = {
  vgMark: 'rect',
  encodeEntry: (model) => {
    return {
      ...encode.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        orient: 'ignore',
        size: 'ignore',
        theta: 'ignore',
      }),
      ...encode.rectPosition(model, 'x'),
      ...encode.rectPosition(model, 'y'),
    };
  },
};
//# sourceMappingURL=rect.js.map

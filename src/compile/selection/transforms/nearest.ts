import {TransformCompiler} from './transforms';

const VORONOI = 'voronoi';

const nearest:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.nearest !== undefined && selCmpt.nearest !== false;
  },

  marks: function(model, selCmpt, marks, selMarks) {
    const mark = marks[0],
        index = selMarks.indexOf(mark),
        isPathgroup = mark.name === model.getName('pathgroup'),
        exists = ((m: any) => m.name && m.name.indexOf(VORONOI) >= 0),
        cellDef = {
          name: model.getName(VORONOI),
          type: 'path',
          from: {data: model.getName('marks')},
          encode: {
            enter: {
              fill: {value: 'transparent'},
              strokeWidth: {value: 0.35},
              stroke: {value: 'transparent'},
              isVoronoi: {value: true}
            }
          },
          transform: [{
            type: 'voronoi',
            x: 'datum.x',
            y: 'datum.y',
            size: [{signal: 'width'}, {signal: 'height'}]
          }]
        };

    if (isPathgroup && !mark.marks.filter(exists).length) {
      mark.marks.push(cellDef);
      selMarks.splice(index, 1, mark);
    } else if (!isPathgroup && !selMarks.filter(exists).length) {
      selMarks.splice(index + 1, 0, cellDef);
    }

    return selMarks;
  }
};

export {nearest as default};

import {TransformCompiler} from './';

const NS = 'voronoi';

const nearest:TransformCompiler = {
  has: function(sel) {
    return sel.nearest !== undefined && sel.nearest !== false;
  },

  marks: function(model, sel, marks, selMarks) {
    let mark = marks[0],
        index = selMarks.indexOf(mark),
        pathgroup = mark.name === model.name('pathgroup'),
        exists = ((m: any) => m.name && m.name.indexOf(NS) >= 0),
        cell = {
          name: model.name(NS),
          type: 'path',
          from: {data: model.name('marks')},
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

    if (pathgroup && !mark.marks.filter(exists).length) {
      mark.marks.push(cell);
      selMarks.splice(index, 1, mark);
    } else if (!pathgroup && !selMarks.filter(exists).length) {
      selMarks.splice(index + 1, 0, cell);
    }

    return selMarks;
  }
};

export {nearest as default};

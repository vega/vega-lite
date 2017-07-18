import {spatialProjections} from '../selection';
import {TransformCompiler} from './transforms';

const VORONOI = 'voronoi';

const nearest:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.type !== 'interval' && selCmpt.nearest;
  },

  marks: function(model, selCmpt, marks, selMarks) {
    const {x, y} = spatialProjections(selCmpt);
    const mark = marks[0];
    const index = selMarks.indexOf(mark);
    const isPathgroup = mark.name === model.getName('pathgroup');
    const exists = ((m: any) => m.name && m.name.indexOf(VORONOI) >= 0);
    const cellDef = {
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
        x: (x || (!x && !y)) ? 'datum.x' : {expr: '0'},
        y: (y || (!x && !y)) ? 'datum.y' : {expr: '0'},
        size: [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')]
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

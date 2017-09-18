import * as log from '../../../log';
import {positionalProjections} from '../selection';
import {TransformCompiler} from './transforms';

const VORONOI = 'voronoi';

const nearest:TransformCompiler = {
  has: function(selCmpt) {
    return selCmpt.type !== 'interval' && selCmpt.nearest;
  },

  marks: function(model, selCmpt, marks) {
    const {x, y} = positionalProjections(selCmpt);
    const markType = model.mark();
    if (markType === 'line' || markType === 'area') {
      log.warn(log.message.nearestNotSupportForContinuous(markType));
      return marks;
    }

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

    let index = 0;
    let exists = false;
    marks.forEach((mark, i) => {
      const name = mark.name || '';
      if (name === model.component.mark[0].name) {
        index = i;
      } else if (name.indexOf(VORONOI) >= 0) {
        exists = true;
      }
    });

    if (!exists) {
      marks.splice(index + 1, 0, cellDef);
    }

    return marks;
  }
};

export {nearest as default};

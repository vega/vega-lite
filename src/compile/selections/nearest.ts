import {UnitModel} from '../unit';
import * as s from './';
import * as u from '../../util';

export function parse(_, sel: s.Selection) {
  if (sel.scales || sel.interval) sel.nearest = false;
}

export function assembleMarks(model: UnitModel, sel: s.Selection, _, children) {
  var modelName = s.modelName(model),
      name = modelName('marks'),
      mark = model.mark(),
      voronoi, marks, pathgroup;

  if (children[0].name === model.name('pathgroup')) {
    pathgroup = children;
    children = children[0].marks;
  }

  for (var i = 0, len = children.length, c; i < len; ++i) {
    c = children[i];
    if (c.from.mark) voronoi = c;
    if (c.name === name) marks = i;
    if (voronoi && marks) break;
  }


  // Don't add multiple voronois to the same unit
  if (voronoi) return children;

  // Add the voronoi right after the marks so that we do not interfere with any
  // additional layers or selections (e.g., brush).
  children.splice(i, 0, {
    name: modelName('voronoi'),
    type: 'path',
    from: {
      mark: modelName('marks'),
      transform: [
        // {type: 'formula', field: 'mid_x', expr: 'datum.bounds.x1 + (datum.bounds.x2 - datum.bounds.x1)/2'},
        // {type: 'formula', field: 'mid_y', expr: 'datum.bounds.y1 + (datum.bounds.y2 - datum.bounds.y1)/2'},
        {type: 'voronoi', x: 'x', y: 'y'}
      ]
    },
    properties: {
      enter: {
        isVoronoi: {value: true},
        fill: {value: 'transparent'}
      },
      update: {
        path: {field: 'layout_path'},
        stroke: {value: 'transparent'},
        strokeWidth: {value: 2}
      }
    }
  });

  return children;
}
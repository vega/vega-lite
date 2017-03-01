"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VORONOI = 'voronoi';
var nearest = {
    has: function (selCmpt) {
        return selCmpt.nearest !== undefined && selCmpt.nearest !== false;
    },
    marks: function (model, selCmpt, marks, selMarks) {
        var mark = marks[0], index = selMarks.indexOf(mark), isPathgroup = mark.name === model.getName('pathgroup'), exists = (function (m) { return m.name && m.name.indexOf(VORONOI) >= 0; }), cellDef = {
            name: model.getName(VORONOI),
            type: 'path',
            from: { data: model.getName('marks') },
            encode: {
                enter: {
                    fill: { value: 'transparent' },
                    strokeWidth: { value: 0.35 },
                    stroke: { value: 'transparent' },
                    isVoronoi: { value: true }
                }
            },
            transform: [{
                    type: 'voronoi',
                    x: 'datum.x',
                    y: 'datum.y',
                    size: [{ signal: 'width' }, { signal: 'height' }]
                }]
        };
        if (isPathgroup && !mark.marks.filter(exists).length) {
            mark.marks.push(cellDef);
            selMarks.splice(index, 1, mark);
        }
        else if (!isPathgroup && !selMarks.filter(exists).length) {
            selMarks.splice(index + 1, 0, cellDef);
        }
        return selMarks;
    }
};
exports.default = nearest;
//# sourceMappingURL=nearest.js.map
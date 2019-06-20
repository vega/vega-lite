"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = tslib_1.__importStar(require("../../../log"));
var mark_1 = require("../../../mark");
var selection_1 = require("../selection");
var VORONOI = 'voronoi';
var nearest = {
    has: function (selCmpt) {
        return selCmpt.type !== 'interval' && selCmpt.nearest;
    },
    marks: function (model, selCmpt, marks) {
        var _a = selection_1.positionalProjections(selCmpt), x = _a.x, y = _a.y;
        var markType = model.mark;
        if (mark_1.isPathMark(markType)) {
            log.warn(log.message.nearestNotSupportForContinuous(markType));
            return marks;
        }
        var cellDef = {
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
                    x: { expr: (x || (!x && !y)) ? 'datum.datum.x || 0' : '0' },
                    y: { expr: (y || (!x && !y)) ? 'datum.datum.y || 0' : '0' },
                    size: [model.getSizeSignalRef('width'), model.getSizeSignalRef('height')]
                }]
        };
        var index = 0;
        var exists = false;
        marks.forEach(function (mark, i) {
            var name = mark.name || '';
            if (name === model.component.mark[0].name) {
                index = i;
            }
            else if (name.indexOf(VORONOI) >= 0) {
                exists = true;
            }
        });
        if (!exists) {
            marks.splice(index + 1, 0, cellDef);
        }
        return marks;
    }
};
exports.default = nearest;
//# sourceMappingURL=nearest.js.map
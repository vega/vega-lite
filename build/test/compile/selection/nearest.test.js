"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var nearest_1 = tslib_1.__importDefault(require("../../../src/compile/selection/transforms/nearest"));
var log = tslib_1.__importStar(require("../../../src/log"));
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function getModel(markType) {
    var model = util_2.parseUnitModel({
        mark: markType,
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative' },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    model.parseMarkGroup();
    model.component.selection = selection.parseUnitSelection(model, {
        one: { type: 'single', nearest: true },
        two: { type: 'multi', nearest: true },
        three: { type: 'interval' },
        four: { type: 'single', nearest: false },
        five: { type: 'multi' },
        six: { type: 'multi', nearest: null },
        seven: { type: 'single', nearest: true, encodings: ['x'] },
        eight: { type: 'single', nearest: true, encodings: ['y'] },
        nine: { type: 'single', nearest: true, encodings: ['color'] }
    });
    return model;
}
function voronoiMark(x, y) {
    return [
        { hello: 'world' },
        {
            name: 'voronoi',
            type: 'path',
            from: { data: 'marks' },
            encode: {
                enter: {
                    fill: { value: 'transparent' },
                    strokeWidth: { value: 0.35 },
                    stroke: { value: 'transparent' },
                    isVoronoi: { value: true }
                }
            },
            transform: [
                {
                    type: 'voronoi',
                    x: x || { expr: 'datum.datum.x || 0' },
                    y: y || { expr: 'datum.datum.y || 0' },
                    size: [{ signal: 'width' }, { signal: 'height' }]
                }
            ]
        }
    ];
}
describe('Nearest Selection Transform', function () {
    it('identifies transform invocation', function () {
        var selCmpts = getModel('circle').component.selection;
        chai_1.assert.isNotFalse(nearest_1.default.has(selCmpts['one']));
        chai_1.assert.isNotFalse(nearest_1.default.has(selCmpts['two']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['three']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['four']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['five']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['six']));
    });
    it('adds voronoi for non-path marks', function () {
        var model = getModel('circle');
        var selCmpts = model.component.selection;
        var marks = [{ hello: 'world' }];
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['one'], marks), voronoiMark());
    });
    it('should warn for path marks', log.wrap(function (localLogger) {
        var model = getModel('line');
        var selCmpts = model.component.selection;
        var marks = [];
        chai_1.assert.equal(nearest_1.default.marks(model, selCmpts['one'], marks), marks);
        chai_1.assert.equal(localLogger.warns[0], log.message.nearestNotSupportForContinuous('line'));
    }));
    it('limits to a single voronoi per unit', function () {
        var model = getModel('circle');
        var selCmpts = model.component.selection;
        var marks = [{ hello: 'world' }];
        var marks2 = nearest_1.default.marks(model, selCmpts['one'], marks);
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['two'], marks2), voronoiMark());
    });
    it('supports 1D voronoi', function () {
        var model = getModel('circle');
        var selCmpts = model.component.selection;
        var marks = [{ hello: 'world' }];
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['seven'], util_1.duplicate(marks)), voronoiMark(null, { expr: '0' }));
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['eight'], util_1.duplicate(marks)), voronoiMark({ expr: '0' }));
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['nine'], util_1.duplicate(marks)), voronoiMark());
    });
});
//# sourceMappingURL=nearest.test.js.map
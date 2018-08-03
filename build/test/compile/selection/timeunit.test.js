"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/data/assemble");
var optimize_1 = require("../../../src/compile/data/optimize");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var util_1 = require("../../util");
function getData(model) {
    optimize_1.optimizeDataflow(model.component.data);
    return assemble_1.assembleRootData(model.component.data, {});
}
function getModel(unit2) {
    var model = util_1.parseModel({
        data: {
            values: [
                { date: 'Sun, 01 Jan 2012 23:00:01', price: 150 },
                { date: 'Sun, 02 Jan 2012 00:10:02', price: 100 },
                { date: 'Sun, 02 Jan 2012 01:20:03', price: 170 },
                { date: 'Sun, 02 Jan 2012 02:30:04', price: 165 },
                { date: 'Sun, 02 Jan 2012 03:40:05', price: 200 }
            ]
        },
        hconcat: [
            {
                mark: 'point',
                selection: {
                    two: { type: 'single', encodings: ['x', 'y'] }
                },
                encoding: {
                    x: {
                        field: 'date',
                        type: 'temporal',
                        timeUnit: 'seconds'
                    },
                    y: { field: 'price', type: 'quantitative' }
                }
            },
            unit2
        ]
    });
    model.parse();
    return model;
}
describe('Selection time unit', function () {
    it('dataflow nodes are constructed', function () {
        var model = util_1.parseUnitModel({
            mark: 'point',
            encoding: {
                x: { field: 'date', type: 'temporal', timeUnit: 'seconds' },
                y: { field: 'date', type: 'temporal', timeUnit: 'minutes' }
            }
        });
        var selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
            one: { type: 'single' },
            two: { type: 'single', encodings: ['x', 'y'] }
        }));
        chai_1.assert.isUndefined(selCmpts['one'].timeUnit);
        chai_1.assert.instanceOf(selCmpts['two'].timeUnit, timeunit_1.TimeUnitNode);
        var as = selCmpts['two'].timeUnit.assemble().map(function (tx) { return tx.as; });
        chai_1.assert.sameDeepMembers(as, ['seconds_date', 'minutes_date']);
    });
    it('is added with conditional encodings', function () {
        var model = getModel({
            mark: 'point',
            encoding: {
                x: {
                    field: 'date',
                    type: 'temporal',
                    timeUnit: 'minutes'
                },
                y: { field: 'price', type: 'quantitative' },
                color: {
                    condition: { selection: 'two', value: 'goldenrod' },
                    value: 'steelblue'
                }
            }
        });
        var data2 = getData(model).filter(function (d) { return d.name === 'data_2'; })[0].transform;
        chai_1.assert.equal(data2.filter(function (tx) { return tx.type === 'formula' && tx.as === 'seconds_date'; }).length, 1);
    });
    it('is added before selection filters', function () {
        var model = getModel({
            transform: [{ filter: { selection: 'two' } }],
            mark: 'point',
            encoding: {
                x: {
                    field: 'date',
                    type: 'temporal',
                    timeUnit: 'minutes'
                },
                y: { field: 'price', type: 'quantitative' }
            }
        });
        var data0 = getData(model).filter(function (d) { return d.name === 'data_0'; })[0].transform;
        var data1 = getData(model).filter(function (d) { return d.name === 'data_1'; })[0].transform;
        var tuIdx = -1;
        var selIdx = -1;
        data0.forEach(function (tx, idx) {
            if (tx.type === 'formula' && tx.as === 'seconds_date') {
                tuIdx = idx;
            }
        });
        data1.forEach(function (tx, idx) {
            if (tx.type === 'filter' && tx.expr.indexOf('vlSingle') >= 0) {
                selIdx = idx;
            }
        });
        chai_1.assert.notEqual(tuIdx, -1);
        chai_1.assert.notEqual(selIdx, -1);
    });
    it('removes duplicate time unit formulae', function () {
        var model = getModel({
            transform: [{ filter: { selection: 'two' } }],
            mark: 'point',
            encoding: {
                x: {
                    field: 'date',
                    type: 'temporal',
                    timeUnit: 'seconds'
                },
                y: { field: 'price', type: 'quantitative' }
            }
        });
        var data2 = getData(model).filter(function (d) { return d.name === 'data_2'; })[0].transform;
        chai_1.assert.equal(data2.filter(function (tx) { return tx.type === 'formula' && tx.as === 'seconds_date'; }).length, 1);
    });
});
//# sourceMappingURL=timeunit.test.js.map
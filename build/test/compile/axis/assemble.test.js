"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/axis/assemble");
var component_1 = require("../../../src/compile/axis/component");
var config_1 = require("../../../src/config");
describe('compile/axis/assemble', function () {
    describe('assembleAxis()', function () {
        it('outputs grid axis with only grid encode blocks', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                grid: true,
                encode: {
                    grid: { update: { stroke: { value: 'red' } } },
                    labels: { update: { fill: { value: 'red' } } }
                }
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'grid', config_1.defaultConfig);
            chai_1.assert.isUndefined(axis.encode.labels);
        });
        it('outputs grid axis with custom zindex', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                grid: true,
                zindex: 3
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'grid', config_1.defaultConfig);
            chai_1.assert.equal(axis.zindex, 3);
        });
        it('outputs main axis without grid encode blocks', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                encode: {
                    grid: { update: { stroke: { value: 'red' } } },
                    labels: { update: { fill: { value: 'red' } } }
                }
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'main', config_1.defaultConfig);
            chai_1.assert.isUndefined(axis.encode.grid);
        });
        it('correctly assemble title fieldDefs', function () {
            var axisCmpt = new component_1.AxisComponent({
                orient: 'left',
                title: [{ aggregate: 'max', field: 'a' }, { aggregate: 'min', field: 'b' }]
            });
            var axis = assemble_1.assembleAxis(axisCmpt, 'main', config_1.defaultConfig);
            chai_1.assert.equal(axis.title, 'Max of a, Min of b');
        });
    });
});
//# sourceMappingURL=assemble.test.js.map
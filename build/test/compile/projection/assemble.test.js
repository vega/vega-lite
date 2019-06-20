"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/projection/assemble");
var vega_schema_1 = require("../../../src/vega.schema");
var util_1 = require("../../util");
describe('compile/projection/assemble', function () {
    describe('assembleProjectionForModel', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            'mark': 'geoshape',
            'projection': {
                'type': 'albersUsa'
            },
            'data': {
                'url': 'data/us-10m.json',
                'format': {
                    'type': 'topojson',
                    'feature': 'states'
                }
            },
            'encoding': {}
        });
        model.parse();
        it('should not be empty', function () {
            chai_1.assert.isNotEmpty(assemble_1.assembleProjectionForModel(model));
        });
        it('should have properties of right type', function () {
            var projection = assemble_1.assembleProjectionForModel(model)[0];
            chai_1.assert.isDefined(projection.name);
            chai_1.assert.isString(projection.name);
            chai_1.assert.isDefined(projection.size);
            chai_1.assert.isTrue(vega_schema_1.isVgSignalRef(projection.size));
            chai_1.assert.isDefined(projection.fit);
            chai_1.assert.isTrue(vega_schema_1.isVgSignalRef(projection.fit));
        });
    });
});
//# sourceMappingURL=assemble.test.js.map
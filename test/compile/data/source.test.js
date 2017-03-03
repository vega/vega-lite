/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var source_1 = require("../../../src/compile/data/source");
var util_1 = require("../../util");
describe('compile/data/source', function () {
    describe('compileUnit', function () {
        describe('with explicit values', function () {
            var model = util_1.parseUnitModel({
                data: {
                    values: [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]
                },
                mark: 'point',
                encoding: {}
            });
            var sourceComponent = source_1.source.parseUnit(model);
            it('should have values', function () {
                chai_1.assert.equal(sourceComponent.name, 'source');
                chai_1.assert.deepEqual(sourceComponent.values, [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]);
            });
            it('should have source.format.type', function () {
                chai_1.assert.deepEqual(sourceComponent.format.type, 'json');
            });
        });
        describe('with link to url', function () {
            var model = util_1.parseUnitModel({
                data: {
                    url: 'http://foo.bar',
                },
                mark: 'point',
                encoding: {}
            });
            var sourceComponent = source_1.source.parseUnit(model);
            it('should have format.type json', function () {
                chai_1.assert.equal(sourceComponent.name, 'source');
                chai_1.assert.equal(sourceComponent.format.type, 'json');
            });
            it('should have correct url', function () {
                chai_1.assert.equal(sourceComponent.url, 'http://foo.bar');
            });
        });
        describe('with no data specified', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {}
            });
            var sourceComponent = source_1.source.parseUnit(model);
            it('should provide placeholder source data', function () {
                chai_1.assert.deepEqual(sourceComponent, { name: 'source' });
            });
        });
        describe('data format', function () {
            describe('json', function () {
                it('should include property if specified', function () {
                    var model = util_1.parseUnitModel({
                        data: {
                            url: 'http://foo.bar',
                            format: { type: 'json', property: 'baz' }
                        },
                        mark: 'point',
                        encoding: {}
                    });
                    var sourceComponent = source_1.source.parseUnit(model);
                    chai_1.assert.equal(sourceComponent.format.property, 'baz');
                });
            });
            describe('topojson', function () {
                describe('feature property is specified', function () {
                    var model = util_1.parseUnitModel({
                        data: {
                            url: 'http://foo.bar',
                            format: { type: 'topojson', feature: 'baz' }
                        },
                        mark: 'point',
                        encoding: {}
                    });
                    var sourceComponent = source_1.source.parseUnit(model);
                    it('should have format.type topojson', function () {
                        chai_1.assert.equal(sourceComponent.name, 'source');
                        chai_1.assert.equal(sourceComponent.format.type, 'topojson');
                    });
                    it('should have format.feature baz', function () {
                        chai_1.assert.equal(sourceComponent.format.feature, 'baz');
                    });
                });
                describe('mesh property is specified', function () {
                    var model = util_1.parseUnitModel({
                        data: {
                            url: 'http://foo.bar',
                            format: { type: 'topojson', mesh: 'baz' }
                        },
                        mark: 'point',
                        encoding: {}
                    });
                    var sourceComponent = source_1.source.parseUnit(model);
                    it('should have format.type topojson', function () {
                        chai_1.assert.equal(sourceComponent.name, 'source');
                        chai_1.assert.equal(sourceComponent.format.type, 'topojson');
                    });
                    it('should have format.mesh baz', function () {
                        chai_1.assert.equal(sourceComponent.format.mesh, 'baz');
                    });
                });
            });
        });
    });
    describe('parseLayer', function () {
        // TODO: write test
    });
    describe('parseFacet', function () {
        // TODO: write test
    });
    describe('assemble', function () {
        // TODO: write test
    });
});
//# sourceMappingURL=source.test.js.map
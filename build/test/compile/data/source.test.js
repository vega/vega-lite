/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        describe('with named data source provided', function () {
            var model = util_1.parseUnitModel({
                data: { name: 'foo' },
                mark: 'point',
                encoding: {}
            });
            var sourceComponent = source_1.source.parseUnit(model);
            it('should provide named source data', function () {
                chai_1.assert.deepEqual(sourceComponent, { name: 'foo' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9zb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIsMkRBQXdEO0FBRXhELG1DQUEwQztBQUUxQyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUM7aUJBQzdDO2dCQUNELElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRSxFQUFFO2FBQ2IsQ0FBQyxDQUFDO1lBRUgsSUFBTSxlQUFlLEdBQUcsZUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVoRCxFQUFFLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ3ZCLGFBQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakYsQ0FB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
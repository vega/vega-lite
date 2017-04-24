/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var source_1 = require("../../../src/compile/data/source");
var util_1 = require("../../util");
function parse(model) {
    return new source_1.SourceNode(model);
}
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
            var source = parse(model);
            it('should have values', function () {
                chai_1.assert.deepEqual(source.data.values, [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]);
            });
            it('should have source.format.type', function () {
                chai_1.assert.deepEqual(source.data.format.type, 'json');
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
            var source = parse(model);
            it('should have format.type json', function () {
                chai_1.assert.equal(source.data.format.type, 'json');
            });
            it('should have correct url', function () {
                chai_1.assert.equal(source.data.url, 'http://foo.bar');
            });
        });
        describe('with no data specified', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {}
            });
            var source = parse(model);
            it('should provide placeholder source data', function () {
                chai_1.assert.equal(source.dataName, 'source');
            });
        });
        describe('with named data source provided', function () {
            var model = util_1.parseUnitModel({
                data: { name: 'foo' },
                mark: 'point',
                encoding: {}
            });
            var source = parse(model);
            it('should provide named source data', function () {
                chai_1.assert.equal(source.dataName, 'foo');
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
                    var source = parse(model);
                    chai_1.assert.equal(source.data.format.property, 'baz');
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
                    var source = parse(model);
                    it('should have format.type topojson', function () {
                        chai_1.assert.equal(source.data.format.type, 'topojson');
                    });
                    it('should have format.feature baz', function () {
                        chai_1.assert.equal(source.data.format.feature, 'baz');
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
                    var source = parse(model);
                    it('should have format.type topojson', function () {
                        chai_1.assert.equal(source.data.format.type, 'topojson');
                    });
                    it('should have format.mesh baz', function () {
                        chai_1.assert.equal(source.data.format.mesh, 'baz');
                    });
                });
            });
        });
    });
    describe('assemble', function () {
        // TODO: write test
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9zb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIsMkRBQTREO0FBRTVELG1DQUEwQztBQUUxQyxlQUFlLEtBQVk7SUFDekIsTUFBTSxDQUFDLElBQUksbUJBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBRUQsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO2lCQUM3QztnQkFDRCxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsRUFBRTthQUNiLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU1QixFQUFFLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ3ZCLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FB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
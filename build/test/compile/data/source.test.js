"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var source_1 = require("../../../src/compile/data/source");
function parse(data) {
    return new source_1.SourceNode(data);
}
describe('compile/data/source', function () {
    describe('compileUnit', function () {
        describe('with explicit values', function () {
            var source = parse({
                values: [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]
            });
            it('should have values', function () {
                chai_1.assert.deepEqual(source.data.values, [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]);
            });
            it('should have source.format.type', function () {
                chai_1.assert.deepEqual(source.data.format.type, 'json');
            });
        });
        describe('with link to url', function () {
            var source = parse({
                url: 'http://foo.bar',
            });
            it('should have format.type json', function () {
                chai_1.assert.equal(source.data.format.type, 'json');
            });
            it('should have correct url', function () {
                chai_1.assert.equal(source.data.url, 'http://foo.bar');
            });
        });
        describe('with no data specified', function () {
            var source = parse(undefined);
            it('should provide placeholder source data', function () {
                chai_1.assert.equal(source.dataName, 'source');
            });
        });
        describe('with named data source provided', function () {
            var source = parse({ name: 'foo' });
            it('should provide named source data', function () {
                chai_1.assert.equal(source.dataName, 'foo');
            });
        });
        describe('data format', function () {
            describe('json', function () {
                it('should include property if specified', function () {
                    var source = parse({
                        url: 'http://foo.bar',
                        format: { type: 'json', property: 'baz' }
                    });
                    chai_1.assert.equal(source.data.format.property, 'baz');
                });
            });
            describe('topojson', function () {
                describe('feature property is specified', function () {
                    var source = parse({
                        url: 'http://foo.bar',
                        format: { type: 'topojson', feature: 'baz' }
                    });
                    it('should have format.type topojson', function () {
                        chai_1.assert.equal(source.data.format.type, 'topojson');
                    });
                    it('should have format.feature baz', function () {
                        chai_1.assert.equal(source.data.format.feature, 'baz');
                    });
                });
                describe('mesh property is specified', function () {
                    var source = parse({
                        url: 'http://foo.bar',
                        format: { type: 'topojson', mesh: 'baz' }
                    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9zb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsMkRBQTREO0FBSzVELGVBQWUsSUFBVTtJQUN2QixNQUFNLENBQUMsSUFBSSxtQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFFRCxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO2FBQzdDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDdkIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO2dCQUNuQyxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLENB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
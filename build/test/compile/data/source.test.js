/* tslint:disable:quotemark */
import { assert } from 'chai';
import { SourceNode } from '../../../src/compile/data/source';
function parse(data) {
    return new SourceNode(data);
}
describe('compile/data/source', function () {
    describe('compileUnit', function () {
        describe('with explicit values', function () {
            var source = parse({
                values: [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]
            });
            it('should have values', function () {
                assert.deepEqual(source.data.values, [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]);
            });
            it('should have no source.format.type', function () {
                assert.deepEqual(source.data.format, undefined);
            });
        });
        describe('with explicit values as CSV', function () {
            var source = parse({
                values: "a\n1\n2\n3",
                format: { type: 'csv' }
            });
            it('should have values', function () {
                assert.deepEqual(source.data.values, "a\n1\n2\n3");
            });
            it('should have correct type', function () {
                assert.equal(source.data.format.type, 'csv');
            });
        });
        describe('with link to url', function () {
            var source = parse({
                url: 'http://foo.bar/file.csv',
            });
            it('should have format.type csv', function () {
                assert.equal(source.data.format.type, 'csv');
            });
            it('should have correct url', function () {
                assert.equal(source.data.url, 'http://foo.bar/file.csv');
            });
        });
        describe('without file ending', function () {
            var source = parse({
                url: 'http://foo.bar/file.baz',
            });
            it('should have format.type json', function () {
                assert.equal(source.data.format.type, 'json');
            });
        });
        describe('with no data specified', function () {
            var source = parse(undefined);
            it('should provide placeholder source data', function () {
                assert.equal(source.dataName, 'source');
            });
        });
        describe('with named data source provided', function () {
            var source = parse({ name: 'foo' });
            it('should provide named source data', function () {
                assert.equal(source.dataName, 'foo');
            });
        });
        describe('data format', function () {
            describe('json', function () {
                it('should include property if specified', function () {
                    var source = parse({
                        url: 'http://foo.bar',
                        format: { type: 'json', property: 'baz' }
                    });
                    assert.equal(source.data.format.property, 'baz');
                });
            });
            describe('topojson', function () {
                describe('feature property is specified', function () {
                    var source = parse({
                        url: 'http://foo.bar',
                        format: { type: 'topojson', feature: 'baz' }
                    });
                    it('should have format.type topojson', function () {
                        assert.equal(source.data.format.type, 'topojson');
                    });
                    it('should have format.feature baz', function () {
                        assert.equal(source.data.format.feature, 'baz');
                    });
                });
                describe('mesh property is specified', function () {
                    var source = parse({
                        url: 'http://foo.bar',
                        format: { type: 'topojson', mesh: 'baz' }
                    });
                    it('should have format.type topojson', function () {
                        assert.equal(source.data.format.type, 'topojson');
                    });
                    it('should have format.mesh baz', function () {
                        assert.equal(source.data.format.mesh, 'baz');
                    });
                });
            });
        });
    });
    describe('assemble', function () {
        // TODO: write test
    });
});
//# sourceMappingURL=source.test.js.map
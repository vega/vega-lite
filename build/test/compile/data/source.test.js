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
            it('should have no source.format.type', function () {
                chai_1.assert.deepEqual(source.data.format, undefined);
            });
        });
        describe('with explicit values as CSV', function () {
            var source = parse({
                values: "a\n1\n2\n3",
                format: { type: 'csv' }
            });
            it('should have values', function () {
                chai_1.assert.deepEqual(source.data.values, "a\n1\n2\n3");
            });
            it('should have correct type', function () {
                chai_1.assert.equal(source.data.format.type, 'csv');
            });
        });
        describe('with link to url', function () {
            var source = parse({
                url: 'http://foo.bar/file.csv',
            });
            it('should have format.type csv', function () {
                chai_1.assert.equal(source.data.format.type, 'csv');
            });
            it('should have correct url', function () {
                chai_1.assert.equal(source.data.url, 'http://foo.bar/file.csv');
            });
        });
        describe('without file ending', function () {
            var source = parse({
                url: 'http://foo.bar/file.baz',
            });
            it('should have format.type json', function () {
                chai_1.assert.equal(source.data.format.type, 'json');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9zb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsMkRBQTREO0FBRzVELGVBQWUsSUFBVTtJQUN2QixNQUFNLENBQUMsSUFBSSxtQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFFRCxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO2FBQzdDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDdkIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lB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QUFDLENBQUM7b0JBQy9DLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixtQkFBbUI7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UnO1xuaW1wb3J0IHtEYXRhfSBmcm9tICcuLi8uLi8uLi9zcmMvZGF0YSc7XG5cbmZ1bmN0aW9uIHBhcnNlKGRhdGE6IERhdGEpIHtcbiAgcmV0dXJuIG5ldyBTb3VyY2VOb2RlKGRhdGEpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3NvdXJjZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2NvbXBpbGVVbml0JywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCd3aXRoIGV4cGxpY2l0IHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgdmFsdWVzOiBbe2E6IDEsIGI6MiwgYzozfSwge2E6IDQsIGI6NSwgYzo2fV1cbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvdXJjZS5kYXRhLnZhbHVlcywgW3thOiAxLCBiOjIsIGM6M30sIHthOiA0LCBiOjUsIGM6Nn1dKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgbm8gc291cmNlLmZvcm1hdC50eXBlJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdCwgdW5kZWZpbmVkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggZXhwbGljaXQgdmFsdWVzIGFzIENTVicsICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgdmFsdWVzOiBcImFcXG4xXFxuMlxcbjNcIixcbiAgICAgICAgZm9ybWF0OiB7dHlwZTogJ2Nzdid9XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3VyY2UuZGF0YS52YWx1ZXMsIFwiYVxcbjFcXG4yXFxuM1wiKTtcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCB0eXBlJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LnR5cGUsICdjc3YnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggbGluayB0byB1cmwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9mb28uYmFyL2ZpbGUuY3N2JyxcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LnR5cGUgY3N2JywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LnR5cGUsICdjc3YnKTtcbiAgICAgIH0pO1xuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdXJsJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEudXJsLCAnaHR0cDovL2Zvby5iYXIvZmlsZS5jc3YnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGhvdXQgZmlsZSBlbmRpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9mb28uYmFyL2ZpbGUuYmF6JyxcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LnR5cGUganNvbicsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC50eXBlLCAnanNvbicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBubyBkYXRhIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHVuZGVmaW5lZCk7XG5cbiAgICAgIGl0KCdzaG91bGQgcHJvdmlkZSBwbGFjZWhvbGRlciBzb3VyY2UgZGF0YScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhTmFtZSwgJ3NvdXJjZScpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBuYW1lZCBkYXRhIHNvdXJjZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtuYW1lOiAnZm9vJ30pO1xuXG4gICAgICBpdCgnc2hvdWxkIHByb3ZpZGUgbmFtZWQgc291cmNlIGRhdGEnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YU5hbWUsICdmb28nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ2RhdGEgZm9ybWF0JywgKCkgPT4ge1xuICAgICAgZGVzY3JpYmUoJ2pzb24nLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgaW5jbHVkZSBwcm9wZXJ0eSBpZiBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2Zvby5iYXInLFxuICAgICAgICAgICAgZm9ybWF0OiB7dHlwZTogJ2pzb24nLCBwcm9wZXJ0eTogJ2Jheid9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LnByb3BlcnR5LCAnYmF6Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCd0b3BvanNvbicsICgpID0+IHtcbiAgICAgICAgZGVzY3JpYmUoJ2ZlYXR1cmUgcHJvcGVydHkgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9mb28uYmFyJyxcbiAgICAgICAgICAgIGZvcm1hdDoge3R5cGU6ICd0b3BvanNvbicsIGZlYXR1cmU6ICdiYXonfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGZvcm1hdC50eXBlIHRvcG9qc29uJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC50eXBlLCAndG9wb2pzb24nKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LmZlYXR1cmUgYmF6JywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC5mZWF0dXJlLCAnYmF6Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCdtZXNoIHByb3BlcnR5IGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vZm9vLmJhcicsXG4gICAgICAgICAgICBmb3JtYXQ6IHt0eXBlOiAndG9wb2pzb24nLCBtZXNoOiAnYmF6J31cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBmb3JtYXQudHlwZSB0b3BvanNvbicsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQudHlwZSwgJ3RvcG9qc29uJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGZvcm1hdC5tZXNoIGJheicsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQubWVzaCwgJ2JheicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGUnLCAoKSA9PiB7XG4gICAgLy8gVE9ETzogd3JpdGUgdGVzdFxuICB9KTtcbn0pO1xuXG4iXX0=
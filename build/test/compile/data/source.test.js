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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9zb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsMkRBQTREO0FBRzVELGVBQWUsSUFBVTtJQUN2QixNQUFNLENBQUMsSUFBSSxtQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFFRCxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixRQUFRLENBQUMsc0JBQXNCLEVBQUU7WUFDL0IsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNuQixNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDO2FBQzdDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDdkIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdFLENBQUMsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO2dCQUN0QyxhQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lB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QUFDLENBQUM7b0JBQy9DLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixtQkFBbUI7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9zb3VyY2UnO1xuaW1wb3J0IHtEYXRhfSBmcm9tICcuLi8uLi8uLi9zcmMvZGF0YSc7XG5cbmZ1bmN0aW9uIHBhcnNlKGRhdGE6IERhdGEpIHtcbiAgcmV0dXJuIG5ldyBTb3VyY2VOb2RlKGRhdGEpO1xufVxuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL3NvdXJjZScsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnY29tcGlsZVVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICBkZXNjcmliZSgnd2l0aCBleHBsaWNpdCB2YWx1ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgdmFsdWVzOiBbe2E6IDEsIGI6MiwgYzozfSwge2E6IDQsIGI6NSwgYzo2fV1cbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgdmFsdWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc291cmNlLmRhdGEudmFsdWVzLCBbe2E6IDEsIGI6MiwgYzozfSwge2E6IDQsIGI6NSwgYzo2fV0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBubyBzb3VyY2UuZm9ybWF0LnR5cGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQsIHVuZGVmaW5lZCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGV4cGxpY2l0IHZhbHVlcyBhcyBDU1YnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgdmFsdWVzOiBcImFcXG4xXFxuMlxcbjNcIixcbiAgICAgICAgZm9ybWF0OiB7dHlwZTogJ2Nzdid9XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIHZhbHVlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvdXJjZS5kYXRhLnZhbHVlcywgXCJhXFxuMVxcbjJcXG4zXCIpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHR5cGUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC50eXBlLCAnY3N2Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGxpbmsgdG8gdXJsJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9mb28uYmFyL2ZpbGUuY3N2JyxcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LnR5cGUgY3N2JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQudHlwZSwgJ2NzdicpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCB1cmwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLnVybCwgJ2h0dHA6Ly9mb28uYmFyL2ZpbGUuY3N2Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRob3V0IGZpbGUgZW5kaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgIHVybDogJ2h0dHA6Ly9mb28uYmFyL2ZpbGUuYmF6JyxcbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LnR5cGUganNvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LnR5cGUsICdqc29uJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIG5vIGRhdGEgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh1bmRlZmluZWQpO1xuXG4gICAgICBpdCgnc2hvdWxkIHByb3ZpZGUgcGxhY2Vob2xkZXIgc291cmNlIGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhTmFtZSwgJ3NvdXJjZScpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBuYW1lZCBkYXRhIHNvdXJjZSBwcm92aWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe25hbWU6ICdmb28nfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcHJvdmlkZSBuYW1lZCBzb3VyY2UgZGF0YScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGFOYW1lLCAnZm9vJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdkYXRhIGZvcm1hdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZGVzY3JpYmUoJ2pzb24nLCAoKSA9PiB7XG4gICAgICAgIGl0KCdzaG91bGQgaW5jbHVkZSBwcm9wZXJ0eSBpZiBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vZm9vLmJhcicsXG4gICAgICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnanNvbicsIHByb3BlcnR5OiAnYmF6J31cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQucHJvcGVydHksICdiYXonKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3RvcG9qc29uJywgKCkgPT4ge1xuICAgICAgICBkZXNjcmliZSgnZmVhdHVyZSBwcm9wZXJ0eSBpcyBzcGVjaWZpZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vZm9vLmJhcicsXG4gICAgICAgICAgICBmb3JtYXQ6IHt0eXBlOiAndG9wb2pzb24nLCBmZWF0dXJlOiAnYmF6J31cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBmb3JtYXQudHlwZSB0b3BvanNvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC50eXBlLCAndG9wb2pzb24nKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LmZlYXR1cmUgYmF6JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LmZlYXR1cmUsICdiYXonKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ21lc2ggcHJvcGVydHkgaXMgc3BlY2lmaWVkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2Zvby5iYXInLFxuICAgICAgICAgICAgZm9ybWF0OiB7dHlwZTogJ3RvcG9qc29uJywgbWVzaDogJ2Jheid9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LnR5cGUgdG9wb2pzb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQudHlwZSwgJ3RvcG9qc29uJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGZvcm1hdC5tZXNoIGJheicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC5tZXNoLCAnYmF6Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZScsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IHdyaXRlIHRlc3RcbiAgfSk7XG59KTtcblxuIl19
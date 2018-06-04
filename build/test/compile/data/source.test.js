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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9zb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIsMkRBQTREO0FBRzVELGVBQWUsSUFBVTtJQUN2QixPQUFPLElBQUksbUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRUQsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLFFBQVEsQ0FBQyxhQUFhLEVBQUU7UUFDdEIsUUFBUSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDbkIsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQzthQUM3QyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ3ZCLGFBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUM3RSxDQUFDLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRTtnQkFDdEMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNsRCxD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QUFDO29CQUMvQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsbUJBQW1CO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZTpxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvc291cmNlJztcbmltcG9ydCB7RGF0YX0gZnJvbSAnLi4vLi4vLi4vc3JjL2RhdGEnO1xuXG5mdW5jdGlvbiBwYXJzZShkYXRhOiBEYXRhKSB7XG4gIHJldHVybiBuZXcgU291cmNlTm9kZShkYXRhKTtcbn1cblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9zb3VyY2UnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdjb21waWxlVW5pdCcsICgpID0+IHtcbiAgICBkZXNjcmliZSgnd2l0aCBleHBsaWNpdCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgIHZhbHVlczogW3thOiAxLCBiOjIsIGM6M30sIHthOiA0LCBiOjUsIGM6Nn1dXG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIHZhbHVlcycsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3VyY2UuZGF0YS52YWx1ZXMsIFt7YTogMSwgYjoyLCBjOjN9LCB7YTogNCwgYjo1LCBjOjZ9XSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIG5vIHNvdXJjZS5mb3JtYXQudHlwZScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQsIHVuZGVmaW5lZCk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGV4cGxpY2l0IHZhbHVlcyBhcyBDU1YnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgIHZhbHVlczogXCJhXFxuMVxcbjJcXG4zXCIsXG4gICAgICAgIGZvcm1hdDoge3R5cGU6ICdjc3YnfVxuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc291cmNlLmRhdGEudmFsdWVzLCBcImFcXG4xXFxuMlxcbjNcIik7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdHlwZScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC50eXBlLCAnY3N2Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIGxpbmsgdG8gdXJsJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICB1cmw6ICdodHRwOi8vZm9vLmJhci9maWxlLmNzdicsXG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGZvcm1hdC50eXBlIGNzdicsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC50eXBlLCAnY3N2Jyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHVybCcsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLnVybCwgJ2h0dHA6Ly9mb28uYmFyL2ZpbGUuY3N2Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRob3V0IGZpbGUgZW5kaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICB1cmw6ICdodHRwOi8vZm9vLmJhci9maWxlLmJheicsXG4gICAgICB9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBoYXZlIGZvcm1hdC50eXBlIGpzb24nLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQudHlwZSwgJ2pzb24nKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggbm8gZGF0YSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh1bmRlZmluZWQpO1xuXG4gICAgICBpdCgnc2hvdWxkIHByb3ZpZGUgcGxhY2Vob2xkZXIgc291cmNlIGRhdGEnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YU5hbWUsICdzb3VyY2UnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggbmFtZWQgZGF0YSBzb3VyY2UgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7bmFtZTogJ2Zvbyd9KTtcblxuICAgICAgaXQoJ3Nob3VsZCBwcm92aWRlIG5hbWVkIHNvdXJjZSBkYXRhJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGFOYW1lLCAnZm9vJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdkYXRhIGZvcm1hdCcsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCdqc29uJywgKCkgPT4ge1xuICAgICAgICBpdCgnc2hvdWxkIGluY2x1ZGUgcHJvcGVydHkgaWYgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9mb28uYmFyJyxcbiAgICAgICAgICAgIGZvcm1hdDoge3R5cGU6ICdqc29uJywgcHJvcGVydHk6ICdiYXonfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC5wcm9wZXJ0eSwgJ2JheicpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndG9wb2pzb24nLCAoKSA9PiB7XG4gICAgICAgIGRlc2NyaWJlKCdmZWF0dXJlIHByb3BlcnR5IGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vZm9vLmJhcicsXG4gICAgICAgICAgICBmb3JtYXQ6IHt0eXBlOiAndG9wb2pzb24nLCBmZWF0dXJlOiAnYmF6J31cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBmb3JtYXQudHlwZSB0b3BvanNvbicsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQudHlwZSwgJ3RvcG9qc29uJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGZvcm1hdC5mZWF0dXJlIGJheicsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQuZmVhdHVyZSwgJ2JheicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgnbWVzaCBwcm9wZXJ0eSBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2Zvby5iYXInLFxuICAgICAgICAgICAgZm9ybWF0OiB7dHlwZTogJ3RvcG9qc29uJywgbWVzaDogJ2Jheid9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LnR5cGUgdG9wb2pzb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LnR5cGUsICd0b3BvanNvbicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBmb3JtYXQubWVzaCBiYXonLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0Lm1lc2gsICdiYXonKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Fzc2VtYmxlJywgKCkgPT4ge1xuICAgIC8vIFRPRE86IHdyaXRlIHRlc3RcbiAgfSk7XG59KTtcblxuIl19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9zb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7QUFFOUIsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUU1QixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFHNUQsZUFBZSxJQUFVO0lBQ3ZCLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUIsQ0FBQztBQUVELFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ25CLE1BQU0sRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUM7YUFDN0MsQ0FBQyxDQUFDO1lBRUgsRUFBRSxDQUFDLG9CQUFvQixFQUFFO2dCQUN2QixNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0UsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7Z0JBQ3RDLE1BQU0sQ0FBQyxTQUFTLENB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QUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDL0MsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLG1CQUFtQjtJQUNyQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3NvdXJjZSc7XG5pbXBvcnQge0RhdGF9IGZyb20gJy4uLy4uLy4uL3NyYy9kYXRhJztcblxuZnVuY3Rpb24gcGFyc2UoZGF0YTogRGF0YSkge1xuICByZXR1cm4gbmV3IFNvdXJjZU5vZGUoZGF0YSk7XG59XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvc291cmNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnY29tcGlsZVVuaXQnLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ3dpdGggZXhwbGljaXQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICB2YWx1ZXM6IFt7YTogMSwgYjoyLCBjOjN9LCB7YTogNCwgYjo1LCBjOjZ9XVxuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc291cmNlLmRhdGEudmFsdWVzLCBbe2E6IDEsIGI6MiwgYzozfSwge2E6IDQsIGI6NSwgYzo2fV0pO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBubyBzb3VyY2UuZm9ybWF0LnR5cGUnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LCB1bmRlZmluZWQpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBleHBsaWNpdCB2YWx1ZXMgYXMgQ1NWJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICB2YWx1ZXM6IFwiYVxcbjFcXG4yXFxuM1wiLFxuICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnY3N2J31cbiAgICAgIH0pO1xuXG4gICAgICBpdCgnc2hvdWxkIGhhdmUgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHNvdXJjZS5kYXRhLnZhbHVlcywgXCJhXFxuMVxcbjJcXG4zXCIpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHR5cGUnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQudHlwZSwgJ2NzdicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aCBsaW5rIHRvIHVybCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2Zvby5iYXIvZmlsZS5jc3YnLFxuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBmb3JtYXQudHlwZSBjc3YnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQudHlwZSwgJ2NzdicpO1xuICAgICAgfSk7XG4gICAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCB1cmwnLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS51cmwsICdodHRwOi8vZm9vLmJhci9maWxlLmNzdicpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aG91dCBmaWxlIGVuZGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2Zvby5iYXIvZmlsZS5iYXonLFxuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgaGF2ZSBmb3JtYXQudHlwZSBqc29uJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LnR5cGUsICdqc29uJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIG5vIGRhdGEgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gcGFyc2UodW5kZWZpbmVkKTtcblxuICAgICAgaXQoJ3Nob3VsZCBwcm92aWRlIHBsYWNlaG9sZGVyIHNvdXJjZSBkYXRhJywgKCkgPT4ge1xuICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGFOYW1lLCAnc291cmNlJyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCd3aXRoIG5hbWVkIGRhdGEgc291cmNlIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe25hbWU6ICdmb28nfSk7XG5cbiAgICAgIGl0KCdzaG91bGQgcHJvdmlkZSBuYW1lZCBzb3VyY2UgZGF0YScsICgpID0+IHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhTmFtZSwgJ2ZvbycpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZGF0YSBmb3JtYXQnLCAoKSA9PiB7XG4gICAgICBkZXNjcmliZSgnanNvbicsICgpID0+IHtcbiAgICAgICAgaXQoJ3Nob3VsZCBpbmNsdWRlIHByb3BlcnR5IGlmIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgICAgICBjb25zdCBzb3VyY2UgPSBwYXJzZSh7XG4gICAgICAgICAgICB1cmw6ICdodHRwOi8vZm9vLmJhcicsXG4gICAgICAgICAgICBmb3JtYXQ6IHt0eXBlOiAnanNvbicsIHByb3BlcnR5OiAnYmF6J31cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGFzc2VydC5lcXVhbChzb3VyY2UuZGF0YS5mb3JtYXQucHJvcGVydHksICdiYXonKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3RvcG9qc29uJywgKCkgPT4ge1xuICAgICAgICBkZXNjcmliZSgnZmVhdHVyZSBwcm9wZXJ0eSBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3Qgc291cmNlID0gcGFyc2Uoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2Zvby5iYXInLFxuICAgICAgICAgICAgZm9ybWF0OiB7dHlwZTogJ3RvcG9qc29uJywgZmVhdHVyZTogJ2Jheid9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0LnR5cGUgdG9wb2pzb24nLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LnR5cGUsICd0b3BvanNvbicpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGl0KCdzaG91bGQgaGF2ZSBmb3JtYXQuZmVhdHVyZSBiYXonLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnQuZXF1YWwoc291cmNlLmRhdGEuZm9ybWF0LmZlYXR1cmUsICdiYXonKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ21lc2ggcHJvcGVydHkgaXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHBhcnNlKHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9mb28uYmFyJyxcbiAgICAgICAgICAgIGZvcm1hdDoge3R5cGU6ICd0b3BvanNvbicsIG1lc2g6ICdiYXonfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaXQoJ3Nob3VsZCBoYXZlIGZvcm1hdC50eXBlIHRvcG9qc29uJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC50eXBlLCAndG9wb2pzb24nKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpdCgnc2hvdWxkIGhhdmUgZm9ybWF0Lm1lc2ggYmF6JywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0LmVxdWFsKHNvdXJjZS5kYXRhLmZvcm1hdC5tZXNoLCAnYmF6Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZScsICgpID0+IHtcbiAgICAvLyBUT0RPOiB3cml0ZSB0ZXN0XG4gIH0pO1xufSk7XG5cbiJdfQ==
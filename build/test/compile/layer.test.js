"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../util");
describe('Layer', function () {
    describe('parseScale', function () {
        it('should merge domains', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' }
                        }
                    }]
            });
            chai_1.assert.equal(model.children.length, 2);
            model.parseScale();
            chai_1.assert.deepEqual(model.component.scales['x'].domains, [{
                    data: 'layer_0_main',
                    field: 'a',
                    sort: true
                }, {
                    data: 'layer_1_main',
                    field: 'b',
                    sort: true
                }]);
        });
        it('should union explicit and referenced domains', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { scale: { domain: [1, 2, 3] }, field: 'b', type: 'ordinal' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' }
                        }
                    }]
            });
            model.parseScale();
            chai_1.assert.deepEqual(model.component.scales['x'].domains, [
                [1, 2, 3],
                {
                    data: 'layer_1_main',
                    field: 'b',
                    sort: true
                }
            ]);
        });
    });
    describe('dual axis chart', function () {
        var model = util_1.parseLayerModel({
            layer: [{
                    mark: 'point',
                    encoding: {
                        x: { field: 'a', type: 'quantitative' }
                    }
                }, {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' }
                    }
                }],
            resolve: {
                scale: {
                    x: 'independent'
                }
            }
        });
        chai_1.assert.equal(model.children.length, 2);
        it('should leave scales in children when set to be independent', function () {
            model.parseScale();
            chai_1.assert.equal(model.component.scales['x'], undefined);
            chai_1.assert.deepEqual(model.children[0].component.scales['x'].domains, [{
                    data: 'layer_0_main',
                    field: 'a'
                }]);
            chai_1.assert.deepEqual(model.children[1].component.scales['x'].domains, [{
                    data: 'layer_1_main',
                    field: 'b'
                }]);
        });
        it('should create second axis on top', function () {
            model.parseAxisAndHeader();
            chai_1.assert.equal(model.component.axes['x'].length, 2);
            chai_1.assert.equal(model.component.axes['x'][1].implicit.orient, 'top');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sYXllci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLGdDQUF3QztBQUV4QyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1lBQ3pCLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxDQUFDO3dCQUNOLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7eUJBQ2pDO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzt5QkFDakM7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRW5CLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ25ELElBQUksRUFBRSxjQUFjO29CQUNwQixLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsSUFBSTtpQkFDWCxFQUFFO29CQUNELElBQUksRUFBRSxjQUFjO29CQUNwQixLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsSUFBSTtpQkFDWCxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQyxDQUFD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LENBQUMsQ0FBQyxDQUFDO1lBQ2xELGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3BhcnNlTGF5ZXJNb2RlbH0gZnJvbSAnLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdMYXllcicsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgncGFyc2VTY2FsZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1lcmdlIGRvbWFpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIGxheWVyOiBbe1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgICAgfVxuICAgICAgICB9LHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNoaWxkcmVuLmxlbmd0aCwgMik7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LnNjYWxlc1sneCddLmRvbWFpbnMsIFt7XG4gICAgICAgICAgZGF0YTogJ2xheWVyXzBfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdhJyxcbiAgICAgICAgICBzb3J0OiB0cnVlXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhOiAnbGF5ZXJfMV9tYWluJyxcbiAgICAgICAgICBmaWVsZDogJ2InLFxuICAgICAgICAgIHNvcnQ6IHRydWVcbiAgICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1bmlvbiBleHBsaWNpdCBhbmQgcmVmZXJlbmNlZCBkb21haW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBsYXllcjogW3tcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7c2NhbGU6IHtkb21haW46IFsxLCAyLCAzXX0sIGZpZWxkOiAnYicsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbJ3gnXS5kb21haW5zLCBbXG4gICAgICAgIFsxLCAyLCAzXSxcbiAgICAgICAge1xuICAgICAgICAgIGRhdGE6ICdsYXllcl8xX21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnYicsXG4gICAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgICB9XSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkdWFsIGF4aXMgY2hhcnQnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgbGF5ZXI6IFt7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9XSxcbiAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICB4OiAnaW5kZXBlbmRlbnQnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFzc2VydC5lcXVhbChtb2RlbC5jaGlsZHJlbi5sZW5ndGgsIDIpO1xuXG4gICAgaXQoJ3Nob3VsZCBsZWF2ZSBzY2FsZXMgaW4gY2hpbGRyZW4gd2hlbiBzZXQgdG8gYmUgaW5kZXBlbmRlbnQnLCAoKSA9PiB7XG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5jb21wb25lbnQuc2NhbGVzWyd4J10sIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNoaWxkcmVuWzBdLmNvbXBvbmVudC5zY2FsZXNbJ3gnXS5kb21haW5zLCBbe1xuICAgICAgICBkYXRhOiAnbGF5ZXJfMF9tYWluJyxcbiAgICAgICAgZmllbGQ6ICdhJ1xuICAgICAgfV0pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jaGlsZHJlblsxXS5jb21wb25lbnQuc2NhbGVzWyd4J10uZG9tYWlucywgW3tcbiAgICAgICAgZGF0YTogJ2xheWVyXzFfbWFpbicsXG4gICAgICAgIGZpZWxkOiAnYidcbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY3JlYXRlIHNlY29uZCBheGlzIG9uIHRvcCcsICgpID0+IHtcbiAgICAgIG1vZGVsLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY29tcG9uZW50LmF4ZXNbJ3gnXS5sZW5ndGgsIDIpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNvbXBvbmVudC5heGVzWyd4J11bMV0uaW1wbGljaXQub3JpZW50LCAndG9wJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
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
            chai_1.assert.equal(model.component.axes['x'][1].main.implicit.orient, 'top');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sYXllci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLGdDQUF3QztBQUV4QyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLHNCQUFzQixFQUFFO1lBQ3pCLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxDQUFDO3dCQUNOLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7eUJBQ2pDO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzt5QkFDakM7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRW5CLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ25ELElBQUksRUFBRSxjQUFjO29CQUNwQixLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsSUFBSTtpQkFDWCxFQUFFO29CQUNELElBQUksRUFBRSxjQUFjO29CQUNwQixLQUFLLEVBQUUsR0FBRztvQkFDVixJQUFJLEVBQUUsSUFBSTtpQkFDWCxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQyxDQUFD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LENBQUMsQ0FBQyxDQUFDO1lBQ2xELGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWx9IGZyb20gJy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTGF5ZXInLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3BhcnNlU2NhbGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZXJnZSBkb21haW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBsYXllcjogW3tcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSx7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5jaGlsZHJlbi5sZW5ndGgsIDIpO1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbJ3gnXS5kb21haW5zLCBbe1xuICAgICAgICAgIGRhdGE6ICdsYXllcl8wX21haW4nLFxuICAgICAgICAgIGZpZWxkOiAnYScsXG4gICAgICAgICAgc29ydDogdHJ1ZVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YTogJ2xheWVyXzFfbWFpbicsXG4gICAgICAgICAgZmllbGQ6ICdiJyxcbiAgICAgICAgICBzb3J0OiB0cnVlXG4gICAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgdW5pb24gZXhwbGljaXQgYW5kIHJlZmVyZW5jZWQgZG9tYWlucycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgICAgbGF5ZXI6IFt7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge3NjYWxlOiB7ZG9tYWluOiBbMSwgMiwgM119LCBmaWVsZDogJ2InLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQuc2NhbGVzWyd4J10uZG9tYWlucywgW1xuICAgICAgICBbMSwgMiwgM10sXG4gICAgICAgIHtcbiAgICAgICAgICBkYXRhOiAnbGF5ZXJfMV9tYWluJyxcbiAgICAgICAgICBmaWVsZDogJ2InLFxuICAgICAgICAgIHNvcnQ6IHRydWVcbiAgICAgICAgfV0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZHVhbCBheGlzIGNoYXJ0JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICAgIGxheWVyOiBbe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICByZXNvbHZlOiB7XG4gICAgICAgIHNjYWxlOiB7XG4gICAgICAgICAgeDogJ2luZGVwZW5kZW50J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZXF1YWwobW9kZWwuY2hpbGRyZW4ubGVuZ3RoLCAyKTtcblxuICAgIGl0KCdzaG91bGQgbGVhdmUgc2NhbGVzIGluIGNoaWxkcmVuIHdoZW4gc2V0IHRvIGJlIGluZGVwZW5kZW50JywgKCkgPT4ge1xuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwuY29tcG9uZW50LnNjYWxlc1sneCddLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jaGlsZHJlblswXS5jb21wb25lbnQuc2NhbGVzWyd4J10uZG9tYWlucywgW3tcbiAgICAgICAgZGF0YTogJ2xheWVyXzBfbWFpbicsXG4gICAgICAgIGZpZWxkOiAnYSdcbiAgICAgIH1dKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY2hpbGRyZW5bMV0uY29tcG9uZW50LnNjYWxlc1sneCddLmRvbWFpbnMsIFt7XG4gICAgICAgIGRhdGE6ICdsYXllcl8xX21haW4nLFxuICAgICAgICBmaWVsZDogJ2InXG4gICAgICB9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBzZWNvbmQgYXhpcyBvbiB0b3AnLCAoKSA9PiB7XG4gICAgICBtb2RlbC5wYXJzZUF4aXNBbmRIZWFkZXIoKTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNvbXBvbmVudC5heGVzWyd4J10ubGVuZ3RoLCAyKTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5jb21wb25lbnQuYXhlc1sneCddWzFdLm1haW4uaW1wbGljaXQub3JpZW50LCAndG9wJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
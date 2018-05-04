"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/scale/assemble");
var util_1 = require("../../util");
describe('compile/scale/assemble', function () {
    describe('assembleScales', function () {
        it('includes all scales for concat', function () {
            var model = util_1.parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'ordinal' }
                        }
                    }, {
                        mark: 'bar',
                        encoding: {
                            x: { field: 'b', type: 'ordinal' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }]
            });
            model.parseScale();
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 3);
        });
        it('includes all scales from children for layer, both shared and independent', function () {
            var model = util_1.parseLayerModel({
                layer: [{
                        mark: 'point',
                        encoding: {
                            x: { field: 'a', type: 'quantitative' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }, {
                        mark: 'point',
                        encoding: {
                            x: { field: 'b', type: 'quantitative' },
                            y: { field: 'c', type: 'quantitative' }
                        }
                    }],
                resolve: {
                    scale: {
                        x: 'independent'
                    }
                }
            });
            model.parseScale();
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 3); // 2 x, 1 y
        });
        it('includes all scales for repeat', function () {
            var model = util_1.parseRepeatModel({
                repeat: {
                    row: ['Acceleration', 'Horsepower']
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: { repeat: 'row' }, type: 'quantitative' }
                    }
                }
            });
            model.parseScale();
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 2);
        });
        it('includes shared scales, but not independent scales (as they are nested) for facet.', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    column: { field: 'a', type: 'quantitative', format: 'd' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                },
                resolve: {
                    scale: { x: 'independent' }
                }
            });
            var scales = assemble_1.assembleScales(model);
            chai_1.assert.equal(scales.length, 1);
            chai_1.assert.equal(scales[0].name, 'y');
        });
    });
    describe('assembleScaleRange', function () {
        it('replaces a range step constant with a signal', function () {
            var model = util_1.parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'nominal' }
                }
            });
            chai_1.assert.deepEqual(assemble_1.assembleScaleRange({ step: 21 }, 'x', model, 'x'), { step: { signal: 'x_step' } });
        });
        it('updates width signal when renamed.', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('width', 'new_width');
            chai_1.assert.deepEqual(assemble_1.assembleScaleRange([0, { signal: 'width' }], 'x', model, 'x'), [0, { signal: 'new_width' }]);
        });
        it('updates height signal when renamed.', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'y', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('height', 'new_height');
            chai_1.assert.deepEqual(assemble_1.assembleScaleRange([0, { signal: 'height' }], 'x', model, 'x'), [0, { signal: 'new_height' }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLGdFQUF1RjtBQUN2RixtQ0FBa0o7QUFFbEosUUFBUSxDQUFDLHdCQUF3QixFQUFFO0lBQ2pDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixFQUFFLENBQUMsZ0NBQWdDLEVBQUU7WUFDbkMsSUFBTSxLQUFLLEdBQUcsdUJBQWdCLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDO3dCQUNSLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7eUJBQ2pDO3FCQUNGLEVBQUM7d0JBQ0EsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzs0QkFDaEMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO3lCQUN0QztxQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ25CLElBQU0sTUFBTSxHQUFHLHlCQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsYUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBR0gsRUFBRSxDQUFDLDBFQUEwRSxFQUFFO1lBQzdFLElBQU0sS0FBSyxHQUFHLHNCQUFlLENBQUM7Z0JBQzVCLEtBQUssRUFBRSxDQUFDO3dCQUNOLElBQUksRUFBRSxPQUFPO3dCQUNiLFFBQVEs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Z0I7WUFDaEIsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUUvQyxhQUFNLENBQUMsU0FBUyxDQUNkLDZCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsRUFDNUQsQ0FBQyxDQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FDNUIsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7YXNzZW1ibGVTY2FsZVJhbmdlLCBhc3NlbWJsZVNjYWxlc30gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvYXNzZW1ibGUnO1xuaW1wb3J0IHtwYXJzZUNvbmNhdE1vZGVsLCBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUsIHBhcnNlTGF5ZXJNb2RlbCwgcGFyc2VSZXBlYXRNb2RlbCwgcGFyc2VVbml0TW9kZWwsIHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvc2NhbGUvYXNzZW1ibGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZVNjYWxlcycsICgpID0+IHtcbiAgICBpdCgnaW5jbHVkZXMgYWxsIHNjYWxlcyBmb3IgY29uY2F0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUNvbmNhdE1vZGVsKHtcbiAgICAgICAgdmNvbmNhdDogW3tcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSx7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAnb3JkaW5hbCd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH0pO1xuXG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBjb25zdCBzY2FsZXMgPSBhc3NlbWJsZVNjYWxlcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGVzLmxlbmd0aCwgMyk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdpbmNsdWRlcyBhbGwgc2NhbGVzIGZyb20gY2hpbGRyZW4gZm9yIGxheWVyLCBib3RoIHNoYXJlZCBhbmQgaW5kZXBlbmRlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgICAgIGxheWVyOiBbe1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9LHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfV0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBzY2FsZToge1xuICAgICAgICAgICAgeDogJ2luZGVwZW5kZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIGNvbnN0IHNjYWxlcyA9IGFzc2VtYmxlU2NhbGVzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChzY2FsZXMubGVuZ3RoLCAzKTsgLy8gMiB4LCAxIHlcbiAgICB9KTtcblxuICAgIGl0KCdpbmNsdWRlcyBhbGwgc2NhbGVzIGZvciByZXBlYXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlUmVwZWF0TW9kZWwoe1xuICAgICAgICByZXBlYXQ6IHtcbiAgICAgICAgICByb3c6IFsnQWNjZWxlcmF0aW9uJywgJ0hvcnNlcG93ZXInXVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiB7cmVwZWF0OiAncm93J30sIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIGNvbnN0IHNjYWxlcyA9IGFzc2VtYmxlU2NhbGVzKG1vZGVsKTtcbiAgICAgIGFzc2VydC5lcXVhbChzY2FsZXMubGVuZ3RoLCAyKTtcbiAgICB9KTtcblxuICAgIGl0KCdpbmNsdWRlcyBzaGFyZWQgc2NhbGVzLCBidXQgbm90IGluZGVwZW5kZW50IHNjYWxlcyAoYXMgdGhleSBhcmUgbmVzdGVkKSBmb3IgZmFjZXQuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGVcbiAgICAgICh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgY29sdW1uOiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZScsIGZvcm1hdDogJ2QnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBzY2FsZToge3g6ICdpbmRlcGVuZGVudCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzY2FsZXMgPSBhc3NlbWJsZVNjYWxlcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGVzLmxlbmd0aCwgMSk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGVzWzBdLm5hbWUsICd5Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhc3NlbWJsZVNjYWxlUmFuZ2UnLCAoKSA9PiB7XG4gICAgaXQoJ3JlcGxhY2VzIGEgcmFuZ2Ugc3RlcCBjb25zdGFudCB3aXRoIGEgc2lnbmFsJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAneCcsIHR5cGU6ICdub21pbmFsJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgIGFzc2VtYmxlU2NhbGVSYW5nZSh7c3RlcDogMjF9LCAneCcsIG1vZGVsLCAneCcpLFxuICAgICAgICB7c3RlcDoge3NpZ25hbDogJ3hfc3RlcCd9fVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd1cGRhdGVzIHdpZHRoIHNpZ25hbCB3aGVuIHJlbmFtZWQuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAneCcsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gbW9jayByZW5hbWluZ1xuICAgICAgbW9kZWwucmVuYW1lTGF5b3V0U2l6ZSgnd2lkdGgnLCAnbmV3X3dpZHRoJyk7XG5cblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgYXNzZW1ibGVTY2FsZVJhbmdlKFswLCB7c2lnbmFsOiAnd2lkdGgnfV0sICd4JywgbW9kZWwsICd4JyksXG4gICAgICAgIFswLCB7c2lnbmFsOiAnbmV3X3dpZHRoJ31dXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgaXQoJ3VwZGF0ZXMgaGVpZ2h0IHNpZ25hbCB3aGVuIHJlbmFtZWQuJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAneScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gbW9jayByZW5hbWluZ1xuICAgICAgbW9kZWwucmVuYW1lTGF5b3V0U2l6ZSgnaGVpZ2h0JywgJ25ld19oZWlnaHQnKTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChcbiAgICAgICAgYXNzZW1ibGVTY2FsZVJhbmdlKFswLCB7c2lnbmFsOiAnaGVpZ2h0J31dLCAneCcsIG1vZGVsLCAneCcpLFxuICAgICAgICBbMCwge3NpZ25hbDogJ25ld19oZWlnaHQnfV1cbiAgICAgICk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
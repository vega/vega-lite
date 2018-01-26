"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var model_1 = require("../../src/compile/model");
var util_1 = require("../util");
describe('Model', function () {
    describe('NameMap', function () {
        it('should rename correctly', function () {
            var map = new model_1.NameMap();
            chai_1.assert.equal(map.get('a'), 'a');
            map.rename('a', 'b');
            chai_1.assert.equal(map.get('a'), 'b');
            chai_1.assert.equal(map.get('b'), 'b');
            map.rename('b', 'c');
            chai_1.assert.equal(map.get('a'), 'c');
            chai_1.assert.equal(map.get('b'), 'c');
            chai_1.assert.equal(map.get('c'), 'c');
            map.rename('z', 'a');
            chai_1.assert.equal(map.get('a'), 'c');
            chai_1.assert.equal(map.get('b'), 'c');
            chai_1.assert.equal(map.get('c'), 'c');
            chai_1.assert.equal(map.get('z'), 'c');
        });
    });
    describe('hasDescendantWithFieldOnChannel', function () {
        it('should return true if a child plot has a field on x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'x', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert(model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return true if a descendant plot has x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    layer: [{
                            mark: 'point',
                            encoding: {
                                x: { field: 'x', type: 'quantitative' }
                            }
                        }, {
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        },]
                }
            });
            chai_1.assert(model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return false if no descendant plot has a field on x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    mark: 'point',
                    encoding: {
                        color: { field: 'x', type: 'quantitative' }
                    }
                }
            });
            chai_1.assert(!model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return false if no descendant plot has a field on x', function () {
            var model = util_1.parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    layer: [{
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        }, {
                            mark: 'point',
                            encoding: {
                                color: { field: 'x', type: 'quantitative' }
                            }
                        },]
                }
            });
            chai_1.assert(!model.hasDescendantWithFieldOnChannel('x'));
        });
    });
    describe('getSizeSignalRef', function () {
        it('returns formula for step if parent is facet', function () {
            var model = util_1.parseFacetModelWithScale({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'nominal', scale: {
                                padding: 0.345
                            } }
                    }
                },
                resolve: {
                    scale: { x: 'independent' }
                }
            });
            chai_1.assert.deepEqual(model.child.getSizeSignalRef('width'), {
                signal: "bandspace(datum[\"distinct_b\"], 1, 0.345) * child_x_step"
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tb2RlbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLGlEQUFnRDtBQUNoRCxnQ0FBa0U7QUFFbEUsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUM1QixJQUFNLEdBQUcsR0FBRyxJQUFJLGVBQU8sRUFBRSxDQUFDO1lBQzFCLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVoQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyQixhQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWhDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLGFBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoQyxhQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEMsYUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWhDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JC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Q0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7TmFtZU1hcH0gZnJvbSAnLi4vLi4vc3JjL2NvbXBpbGUvbW9kZWwnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWwsIHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdNb2RlbCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ05hbWVNYXAnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCByZW5hbWUgY29ycmVjdGx5JywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbWFwID0gbmV3IE5hbWVNYXAoKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXAuZ2V0KCdhJyksICdhJyk7XG5cbiAgICAgIG1hcC5yZW5hbWUoJ2EnLCAnYicpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ2EnKSwgJ2InKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXAuZ2V0KCdiJyksICdiJyk7XG5cbiAgICAgIG1hcC5yZW5hbWUoJ2InLCAnYycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ2EnKSwgJ2MnKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXAuZ2V0KCdiJyksICdjJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFwLmdldCgnYycpLCAnYycpO1xuXG4gICAgICBtYXAucmVuYW1lKCd6JywgJ2EnKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXAuZ2V0KCdhJyksICdjJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFwLmdldCgnYicpLCAnYycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ2MnKSwgJ2MnKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXAuZ2V0KCd6JyksICdjJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoYXNEZXNjZW5kYW50V2l0aEZpZWxkT25DaGFubmVsJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgaWYgYSBjaGlsZCBwbG90IGhhcyBhIGZpZWxkIG9uIHgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICAgIGZhY2V0OiB7cm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfX0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICd4JywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydChtb2RlbC5oYXNEZXNjZW5kYW50V2l0aEZpZWxkT25DaGFubmVsKCd4JykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiBhIGRlc2NlbmRhbnQgcGxvdCBoYXMgeCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtyb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIGxheWVyOiBbe1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIHg6IHtmaWVsZDogJ3gnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAneCcsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydChtb2RlbC5oYXNEZXNjZW5kYW50V2l0aEZpZWxkT25DaGFubmVsKCd4JykpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgaWYgbm8gZGVzY2VuZGFudCBwbG90IGhhcyBhIGZpZWxkIG9uIHgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbCh7XG4gICAgICAgIGZhY2V0OiB7cm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ25vbWluYWwnfX0sXG4gICAgICAgIHNwZWM6IHtcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAneCcsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQoIW1vZGVsLmhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoJ3gnKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBpZiBubyBkZXNjZW5kYW50IHBsb3QgaGFzIGEgZmllbGQgb24geCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtyb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIGxheWVyOiBbe1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICd4JywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSx7XG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ3gnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LF1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQoIW1vZGVsLmhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoJ3gnKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRTaXplU2lnbmFsUmVmJywgKCkgPT4ge1xuICAgIGl0KCdyZXR1cm5zIGZvcm11bGEgZm9yIHN0ZXAgaWYgcGFyZW50IGlzIGZhY2V0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAnbm9taW5hbCcsIHNjYWxlOiB7XG4gICAgICAgICAgICAgIHBhZGRpbmc6IDAuMzQ1XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIHNjYWxlOiB7eDogJ2luZGVwZW5kZW50J31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY2hpbGQuZ2V0U2l6ZVNpZ25hbFJlZignd2lkdGgnKSwge1xuICAgICAgICBzaWduYWw6IGBiYW5kc3BhY2UoZGF0dW1bXFxcImRpc3RpbmN0X2JcXFwiXSwgMSwgMC4zNDUpICogY2hpbGRfeF9zdGVwYFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
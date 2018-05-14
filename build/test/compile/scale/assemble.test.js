import { assert } from 'chai';
import { assembleScaleRange, assembleScales } from '../../../src/compile/scale/assemble';
import { parseConcatModel, parseFacetModelWithScale, parseLayerModel, parseRepeatModel, parseUnitModel, parseUnitModelWithScale } from '../../util';
describe('compile/scale/assemble', function () {
    describe('assembleScales', function () {
        it('includes all scales for concat', function () {
            var model = parseConcatModel({
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
            var scales = assembleScales(model);
            assert.equal(scales.length, 3);
        });
        it('includes all scales from children for layer, both shared and independent', function () {
            var model = parseLayerModel({
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
            var scales = assembleScales(model);
            assert.equal(scales.length, 3); // 2 x, 1 y
        });
        it('includes all scales for repeat', function () {
            var model = parseRepeatModel({
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
            var scales = assembleScales(model);
            assert.equal(scales.length, 2);
        });
        it('includes shared scales, but not independent scales (as they are nested) for facet.', function () {
            var model = parseFacetModelWithScale({
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
            var scales = assembleScales(model);
            assert.equal(scales.length, 1);
            assert.equal(scales[0].name, 'y');
        });
    });
    describe('assembleScaleRange', function () {
        it('replaces a range step constant with a signal', function () {
            var model = parseUnitModel({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'nominal' }
                }
            });
            assert.deepEqual(assembleScaleRange({ step: 21 }, 'x', model, 'x'), { step: { signal: 'x_step' } });
        });
        it('updates width signal when renamed.', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'x', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('width', 'new_width');
            assert.deepEqual(assembleScaleRange([0, { signal: 'width' }], 'x', model, 'x'), [0, { signal: 'new_width' }]);
        });
        it('updates height signal when renamed.', function () {
            var model = parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'y', type: 'quantitative' }
                }
            });
            // mock renaming
            model.renameLayoutSize('height', 'new_height');
            assert.deepEqual(assembleScaleRange([0, { signal: 'height' }], 'x', model, 'x'), [0, { signal: 'new_height' }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLGtCQUFrQixFQUFFLGNBQWMsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ3ZGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSx3QkFBd0IsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLHVCQUF1QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRWxKLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtJQUNqQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFO1lBQ25DLElBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3lCQUNqQztxQkFDRixFQUFDO3dCQUNBLElBQUksRUFBRSxLQUFLO3dCQUNYLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7NEJBQ2hDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzt5QkFDdEM7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUNuQixJQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxF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LEdBQUcsdUJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7aUJBQ3RDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsZ0JBQWdCO1lBQ2hCLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFL0MsTUFBTSxDQUFDLFNBQVMsQ0FDZCxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQzVELENBQUMsQ0FBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQzVCLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge2Fzc2VtYmxlU2NhbGVSYW5nZSwgYXNzZW1ibGVTY2FsZXN9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NjYWxlL2Fzc2VtYmxlJztcbmltcG9ydCB7cGFyc2VDb25jYXRNb2RlbCwgcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlLCBwYXJzZUxheWVyTW9kZWwsIHBhcnNlUmVwZWF0TW9kZWwsIHBhcnNlVW5pdE1vZGVsLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL3NjYWxlL2Fzc2VtYmxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYXNzZW1ibGVTY2FsZXMnLCAoKSA9PiB7XG4gICAgaXQoJ2luY2x1ZGVzIGFsbCBzY2FsZXMgZm9yIGNvbmNhdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VDb25jYXRNb2RlbCh7XG4gICAgICAgIHZjb25jYXQ6IFt7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0se1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICAgICAgY29uc3Qgc2NhbGVzID0gYXNzZW1ibGVTY2FsZXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlcy5sZW5ndGgsIDMpO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnaW5jbHVkZXMgYWxsIHNjYWxlcyBmcm9tIGNoaWxkcmVuIGZvciBsYXllciwgYm90aCBzaGFyZWQgYW5kIGluZGVwZW5kZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUxheWVyTW9kZWwoe1xuICAgICAgICBsYXllcjogW3tcbiAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9LFxuICAgICAgICAgICAgeToge2ZpZWxkOiAnYycsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSx7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1dLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgc2NhbGU6IHtcbiAgICAgICAgICAgIHg6ICdpbmRlcGVuZGVudCdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBjb25zdCBzY2FsZXMgPSBhc3NlbWJsZVNjYWxlcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGVzLmxlbmd0aCwgMyk7IC8vIDIgeCwgMSB5XG4gICAgfSk7XG5cbiAgICBpdCgnaW5jbHVkZXMgYWxsIHNjYWxlcyBmb3IgcmVwZWF0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVJlcGVhdE1vZGVsKHtcbiAgICAgICAgcmVwZWF0OiB7XG4gICAgICAgICAgcm93OiBbJ0FjY2VsZXJhdGlvbicsICdIb3JzZXBvd2VyJ11cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDoge3JlcGVhdDogJ3Jvdyd9LCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gICAgICBjb25zdCBzY2FsZXMgPSBhc3NlbWJsZVNjYWxlcyhtb2RlbCk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2NhbGVzLmxlbmd0aCwgMik7XG4gICAgfSk7XG5cbiAgICBpdCgnaW5jbHVkZXMgc2hhcmVkIHNjYWxlcywgYnV0IG5vdCBpbmRlcGVuZGVudCBzY2FsZXMgKGFzIHRoZXkgYXJlIG5lc3RlZCkgZm9yIGZhY2V0LicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlXG4gICAgICAoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIGNvbHVtbjoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnLCBmb3JtYXQ6ICdkJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgc2NhbGU6IHt4OiAnaW5kZXBlbmRlbnQnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2NhbGVzID0gYXNzZW1ibGVTY2FsZXMobW9kZWwpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlcy5sZW5ndGgsIDEpO1xuICAgICAgYXNzZXJ0LmVxdWFsKHNjYWxlc1swXS5uYW1lLCAneScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYXNzZW1ibGVTY2FsZVJhbmdlJywgKCkgPT4ge1xuICAgIGl0KCdyZXBsYWNlcyBhIHJhbmdlIHN0ZXAgY29uc3RhbnQgd2l0aCBhIHNpZ25hbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ3gnLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKFxuICAgICAgICBhc3NlbWJsZVNjYWxlUmFuZ2Uoe3N0ZXA6IDIxfSwgJ3gnLCBtb2RlbCwgJ3gnKSxcbiAgICAgICAge3N0ZXA6IHtzaWduYWw6ICd4X3N0ZXAnfX1cbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBpdCgndXBkYXRlcyB3aWR0aCBzaWduYWwgd2hlbiByZW5hbWVkLicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ3gnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIG1vY2sgcmVuYW1pbmdcbiAgICAgIG1vZGVsLnJlbmFtZUxheW91dFNpemUoJ3dpZHRoJywgJ25ld193aWR0aCcpO1xuXG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgIGFzc2VtYmxlU2NhbGVSYW5nZShbMCwge3NpZ25hbDogJ3dpZHRoJ31dLCAneCcsIG1vZGVsLCAneCcpLFxuICAgICAgICBbMCwge3NpZ25hbDogJ25ld193aWR0aCd9XVxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIGl0KCd1cGRhdGVzIGhlaWdodCBzaWduYWwgd2hlbiByZW5hbWVkLicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ3knLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIG1vY2sgcmVuYW1pbmdcbiAgICAgIG1vZGVsLnJlbmFtZUxheW91dFNpemUoJ2hlaWdodCcsICduZXdfaGVpZ2h0Jyk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoXG4gICAgICAgIGFzc2VtYmxlU2NhbGVSYW5nZShbMCwge3NpZ25hbDogJ2hlaWdodCd9XSwgJ3gnLCBtb2RlbCwgJ3gnKSxcbiAgICAgICAgWzAsIHtzaWduYWw6ICduZXdfaGVpZ2h0J31dXG4gICAgICApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
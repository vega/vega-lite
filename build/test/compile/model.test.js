import { assert } from 'chai';
import { NameMap } from '../../src/compile/model';
import { parseFacetModel, parseFacetModelWithScale } from '../util';
describe('Model', function () {
    describe('NameMap', function () {
        it('should rename correctly', function () {
            var map = new NameMap();
            assert.equal(map.get('a'), 'a');
            map.rename('a', 'b');
            assert.equal(map.get('a'), 'b');
            assert.equal(map.get('b'), 'b');
            map.rename('b', 'c');
            assert.equal(map.get('a'), 'c');
            assert.equal(map.get('b'), 'c');
            assert.equal(map.get('c'), 'c');
            map.rename('z', 'a');
            assert.equal(map.get('a'), 'c');
            assert.equal(map.get('b'), 'c');
            assert.equal(map.get('c'), 'c');
            assert.equal(map.get('z'), 'c');
        });
    });
    describe('hasDescendantWithFieldOnChannel', function () {
        it('should return true if a child plot has a field on x', function () {
            var model = parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'x', type: 'quantitative' }
                    }
                }
            });
            assert(model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return true if a descendant plot has x', function () {
            var model = parseFacetModel({
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
            assert(model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return false if no descendant plot has a field on x', function () {
            var model = parseFacetModel({
                facet: { row: { field: 'a', type: 'nominal' } },
                spec: {
                    mark: 'point',
                    encoding: {
                        color: { field: 'x', type: 'quantitative' }
                    }
                }
            });
            assert(!model.hasDescendantWithFieldOnChannel('x'));
        });
        it('should return false if no descendant plot has a field on x', function () {
            var model = parseFacetModel({
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
            assert(!model.hasDescendantWithFieldOnChannel('x'));
        });
    });
    describe('getSizeSignalRef', function () {
        it('returns formula for step if parent is facet', function () {
            var model = parseFacetModelWithScale({
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
            assert.deepEqual(model.child.getSizeSignalRef('width'), {
                signal: "bandspace(datum[\"distinct_b\"], 1, 0.345) * child_x_step"
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tb2RlbC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2hELE9BQU8sRUFBQyxlQUFlLEVBQUUsd0JBQXdCLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFbEUsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUM1QixJQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVoQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRWhDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMs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Z0JBQWdCLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3RELE1BQU0sRUFBRSwyREFBMkQ7YUFDcEUsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtOYW1lTWFwfSBmcm9tICcuLi8uLi9zcmMvY29tcGlsZS9tb2RlbCc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi91dGlsJztcblxuZGVzY3JpYmUoJ01vZGVsJywgKCkgPT4ge1xuICBkZXNjcmliZSgnTmFtZU1hcCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIHJlbmFtZSBjb3JyZWN0bHknLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtYXAgPSBuZXcgTmFtZU1hcCgpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ2EnKSwgJ2EnKTtcblxuICAgICAgbWFwLnJlbmFtZSgnYScsICdiJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFwLmdldCgnYScpLCAnYicpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ2InKSwgJ2InKTtcblxuICAgICAgbWFwLnJlbmFtZSgnYicsICdjJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFwLmdldCgnYScpLCAnYycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ2InKSwgJ2MnKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXAuZ2V0KCdjJyksICdjJyk7XG5cbiAgICAgIG1hcC5yZW5hbWUoJ3onLCAnYScpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ2EnKSwgJ2MnKTtcbiAgICAgIGFzc2VydC5lcXVhbChtYXAuZ2V0KCdiJyksICdjJyk7XG4gICAgICBhc3NlcnQuZXF1YWwobWFwLmdldCgnYycpLCAnYycpO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1hcC5nZXQoJ3onKSwgJ2MnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBpZiBhIGNoaWxkIHBsb3QgaGFzIGEgZmllbGQgb24geCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtyb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ3gnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0KG1vZGVsLmhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoJ3gnKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGlmIGEgZGVzY2VuZGFudCBwbG90IGhhcyB4JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDoge3Jvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ319LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbGF5ZXI6IFt7XG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgeDoge2ZpZWxkOiAneCcsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0se1xuICAgICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICd4JywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0KG1vZGVsLmhhc0Rlc2NlbmRhbnRXaXRoRmllbGRPbkNoYW5uZWwoJ3gnKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBpZiBubyBkZXNjZW5kYW50IHBsb3QgaGFzIGEgZmllbGQgb24geCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsKHtcbiAgICAgICAgZmFjZXQ6IHtyb3c6IHtmaWVsZDogJ2EnLCB0eXBlOiAnbm9taW5hbCd9fSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIGNvbG9yOiB7ZmllbGQ6ICd4JywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydCghbW9kZWwuaGFzRGVzY2VuZGFudFdpdGhGaWVsZE9uQ2hhbm5lbCgneCcpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGlmIG5vIGRlc2NlbmRhbnQgcGxvdCBoYXMgYSBmaWVsZCBvbiB4JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDoge3Jvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdub21pbmFsJ319LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbGF5ZXI6IFt7XG4gICAgICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgICAgY29sb3I6IHtmaWVsZDogJ3gnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LHtcbiAgICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgICBjb2xvcjoge2ZpZWxkOiAneCcsIHR5cGU6ICdxdWFudGl0YXRpdmUnfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGFzc2VydCghbW9kZWwuaGFzRGVzY2VuZGFudFdpdGhGaWVsZE9uQ2hhbm5lbCgneCcpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFNpemVTaWduYWxSZWYnLCAoKSA9PiB7XG4gICAgaXQoJ3JldHVybnMgZm9ybXVsYSBmb3Igc3RlcCBpZiBwYXJlbnQgaXMgZmFjZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgcm93OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBzcGVjOiB7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdub21pbmFsJywgc2NhbGU6IHtcbiAgICAgICAgICAgICAgcGFkZGluZzogMC4zNDVcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgc2NhbGU6IHt4OiAnaW5kZXBlbmRlbnQnfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jaGlsZC5nZXRTaXplU2lnbmFsUmVmKCd3aWR0aCcpLCB7XG4gICAgICAgIHNpZ25hbDogYGJhbmRzcGFjZShkYXR1bVtcXFwiZGlzdGluY3RfYlxcXCJdLCAxLCAwLjM0NSkgKiBjaGlsZF94X3N0ZXBgXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
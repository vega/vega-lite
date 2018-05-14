import { assert } from 'chai';
import * as log from '../../src/log';
import { parseConcatModel } from '../util';
describe('Concat', function () {
    describe('merge scale domains', function () {
        it('should instantiate all children in vconcat', function () {
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
            assert.equal(model.children.length, 2);
            assert(model.isVConcat);
        });
        it('should instantiate all children in hconcat', function () {
            var model = parseConcatModel({
                hconcat: [{
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
            assert.equal(model.children.length, 2);
            assert(!model.isVConcat);
        });
        it('should create correct layout for vconcat', function () {
            var model = parseConcatModel({
                vconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                offset: 10,
                columns: 1,
                bounds: 'full',
                align: 'each'
            });
        });
        it('should create correct layout for hconcat', function () {
            var model = parseConcatModel({
                hconcat: [{
                        mark: 'point',
                        encoding: {}
                    }, {
                        mark: 'bar',
                        encoding: {}
                    }]
            });
            assert.deepEqual(model.assembleLayout(), {
                padding: { row: 10, column: 10 },
                offset: 10,
                bounds: 'full',
                align: 'each'
            });
        });
    });
    describe('resolve', function () {
        it('cannot share axes', log.wrap(function (localLogger) {
            parseConcatModel({
                hconcat: [],
                resolve: {
                    axis: {
                        x: 'shared'
                    }
                }
            });
            assert.equal(localLogger.warns[0], log.message.CONCAT_CANNOT_SHARE_AXIS);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L2NvbXBpbGUvY29uY2F0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEtBQUssR0FBRyxNQUFNLGVBQWUsQ0FBQztBQUVyQyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFekMsUUFBUSxDQUFDLFFBQVEsRUFBRTtJQUNqQixRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQzt3QkFDUixJQUFJLEVBQUUsT0FBTzt3QkFDYixRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO3lCQUNqQztxQkFDRixFQUFDO3dCQUNBLElBQUksRUFBRSxLQUFLO3dCQUNYLFFBQVEsRUFBRTs0QkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7NEJBQ2hDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQzt5QkFDdEM7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxJQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFOzRCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQzt5QkFDakM7cUJBQ0YsRUFBQzt3QkFDQSxJQUFJLEVBQUUsS0FBSzt3QkFDWCxRQUFRLEVBQUU7NEJBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDOzRCQUNoQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUM7eUJBQ3RDO3FCQUNGLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxJQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFLEVBQ1Q7cUJBQ0YsRUFBQzt3QkFDQSxJQUFJLEVBQUUsS0FBSzt3QkFDWCxRQUFRLEVBQUUsRUFDVDtxQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBVyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQ2pELE9BQU8sRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDOUIsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsT0FBTyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsS0FBSyxFQUFFLE1BQU07YUFDZCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxJQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQztnQkFDN0IsT0FBTyxFQUFFLENBQUM7d0JBQ1IsSUFBSSxFQUFFLE9BQU87d0JBQ2IsUUFBUSxFQUFFLEVBQ1Q7cUJBQ0YsRUFBQzt3QkFDQSxJQUFJLEVBQUUsS0FBSzt3QkFDWCxRQUFRLEVBQUUsRUFDVDtxQkFDRixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLFNBQVMsQ0FBVyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUU7Z0JBQ2pELE9BQU8sRUFBRSxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBQztnQkFDOUIsTUFBTSxFQUFFLEVBQUU7Z0JBQ1YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsS0FBSyxFQUFFLE1BQU07YUFDZCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFDLFdBQVc7WUFDM0MsZ0JBQWdCLENBQUM7Z0JBQ2YsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRTt3QkFDSixDQUFDLEVBQUUsUUFBUTtxQkFDWjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge1ZnTGF5b3V0fSBmcm9tICcuLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZUNvbmNhdE1vZGVsfSBmcm9tICcuLi91dGlsJztcblxuZGVzY3JpYmUoJ0NvbmNhdCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ21lcmdlIHNjYWxlIGRvbWFpbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBpbnN0YW50aWF0ZSBhbGwgY2hpbGRyZW4gaW4gdmNvbmNhdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VDb25jYXRNb2RlbCh7XG4gICAgICAgIHZjb25jYXQ6IFt7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0se1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgICB4OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICAgIHk6IHtmaWVsZDogJ2MnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLmNoaWxkcmVuLmxlbmd0aCwgMik7XG4gICAgICBhc3NlcnQobW9kZWwuaXNWQ29uY2F0KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaW5zdGFudGlhdGUgYWxsIGNoaWxkcmVuIGluIGhjb25jYXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlQ29uY2F0TW9kZWwoe1xuICAgICAgICBoY29uY2F0OiBbe1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCd9XG4gICAgICAgICAgfVxuICAgICAgICB9LHtcbiAgICAgICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgICAgeDoge2ZpZWxkOiAnYicsIHR5cGU6ICdvcmRpbmFsJ30sXG4gICAgICAgICAgICB5OiB7ZmllbGQ6ICdjJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgICAgfVxuICAgICAgICB9XVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5jaGlsZHJlbi5sZW5ndGgsIDIpO1xuICAgICAgYXNzZXJ0KCFtb2RlbC5pc1ZDb25jYXQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgY29ycmVjdCBsYXlvdXQgZm9yIHZjb25jYXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlQ29uY2F0TW9kZWwoe1xuICAgICAgICB2Y29uY2F0OiBbe1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB9XG4gICAgICAgIH0se1xuICAgICAgICAgIG1hcms6ICdiYXInLFxuICAgICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgfVxuICAgICAgICB9XVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWw8VmdMYXlvdXQ+KG1vZGVsLmFzc2VtYmxlTGF5b3V0KCksIHtcbiAgICAgICAgcGFkZGluZzoge3JvdzogMTAsIGNvbHVtbjogMTB9LFxuICAgICAgICBvZmZzZXQ6IDEwLFxuICAgICAgICBjb2x1bW5zOiAxLFxuICAgICAgICBib3VuZHM6ICdmdWxsJyxcbiAgICAgICAgYWxpZ246ICdlYWNoJ1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBjb3JyZWN0IGxheW91dCBmb3IgaGNvbmNhdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VDb25jYXRNb2RlbCh7XG4gICAgICAgIGhjb25jYXQ6IFt7XG4gICAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIH1cbiAgICAgICAgfSx7XG4gICAgICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0xheW91dD4obW9kZWwuYXNzZW1ibGVMYXlvdXQoKSwge1xuICAgICAgICBwYWRkaW5nOiB7cm93OiAxMCwgY29sdW1uOiAxMH0sXG4gICAgICAgIG9mZnNldDogMTAsXG4gICAgICAgIGJvdW5kczogJ2Z1bGwnLFxuICAgICAgICBhbGlnbjogJ2VhY2gnXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Jlc29sdmUnLCAoKSA9PiB7XG4gICAgaXQoJ2Nhbm5vdCBzaGFyZSBheGVzJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBwYXJzZUNvbmNhdE1vZGVsKHtcbiAgICAgICAgaGNvbmNhdDogW10sXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBheGlzOiB7XG4gICAgICAgICAgICB4OiAnc2hhcmVkJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLkNPTkNBVF9DQU5OT1RfU0hBUkVfQVhJUyk7XG4gICAgfSkpO1xuICB9KTtcbn0pO1xuIl19
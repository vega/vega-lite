"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var assemble_1 = require("../../../src/compile/layoutsize/assemble");
var log = tslib_1.__importStar(require("../../../src/log"));
describe('compile/layout', function () {
    describe('sizeExpr', function () {
        it('should return correct formula for ordinal-point scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'x_step',
                    value: 21
                }, {
                    name: 'width',
                    update: 'bandspace(domain(\'x\').length, 1, 0.5) * x_step'
                }]);
        });
        it('should return correct formula for ordinal-band scale with custom padding', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { padding: 0.3 } },
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'x_step',
                    value: 21
                }, {
                    name: 'width',
                    update: 'bandspace(domain(\'x\').length, 0.3, 0.3) * x_step'
                }]);
        });
        it('should return correct formula for ordinal-band scale with custom paddingInner', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'rect',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { paddingInner: 0.3 } },
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'x_step',
                    value: 21
                }, {
                    name: 'width',
                    update: 'bandspace(domain(\'x\').length, 0.3, 0.15) * x_step'
                }]);
        });
        it('should return only step if parent is facet', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'nominal' }
                    }
                },
                resolve: {
                    scale: { x: 'independent' }
                }
            });
            model.parseScale();
            model.parseLayoutSize();
            var size = assemble_1.sizeSignals(model.child, 'width');
            chai_1.assert.deepEqual(size, [{
                    name: 'child_x_step',
                    value: 21
                }]);
        });
        it('should return static view size for ordinal x-scale with null', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 200 }]);
        });
        it('should return static view size for ordinal y-scale with null', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'ordinal', scale: { rangeStep: null } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'height');
            chai_1.assert.deepEqual(size, [{ name: 'height', value: 200 }]);
        });
        it('should return static view size for ordinal scale with top-level width', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                width: 205,
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 205 }]);
        });
        it('should return static view size for ordinal scale with top-level width even if there is numeric rangeStep', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                width: 205,
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: 21 } }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 205 }]);
            chai_1.assert.equal(localLogger.warns[0], log.message.rangeStepDropped(channel_1.X));
        }));
        it('should return static view width for non-ordinal x-scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 200 }]);
        });
        it('should return static view size for non-ordinal y-scale', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    y: { field: 'a', type: 'quantitative' }
                }
            });
            var size = assemble_1.sizeSignals(model, 'height');
            chai_1.assert.deepEqual(size, [{ name: 'height', value: 200 }]);
        });
        it('should return default rangeStep if axis is not mapped', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 17 } }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 17 }]);
        });
        it('should return textXRangeStep if axis is not mapped for X of text mark', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            var size = assemble_1.sizeSignals(model, 'width');
            chai_1.assert.deepEqual(size, [{ name: 'width', value: 91 }]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sYXlvdXRzaXplL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixtQ0FBaUY7QUFFakYsZ0RBQXVDO0FBQ3ZDLHFFQUFxRTtBQUNyRSw0REFBd0M7QUFFeEMsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFDbkIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDO2lCQUNqQzthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sSUFBSSxHQUFHLHNCQUFXLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3RCLElBQUksRUFBRSxRQUFRO29CQUNkLEtBQUssRUFBRSxFQUFFO2lCQUNWLEVBQUM7b0JBQ0EsSUFBSSxFQUFFLE9BQU87b0JBQ2IsTUFBTSxFQUFFLGtEQUFrRDtpQkFDM0QsQ0FBQyxDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtZQUM3RSxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztnQkFDakQsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFO29CQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFDLEVBQUM7aUJB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Q0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3BhcnNlRmFjZXRNb2RlbCwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuaW1wb3J0IHtYfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge3NpemVTaWduYWxzfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL2Fzc2VtYmxlJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvbGF5b3V0JywgKCkgPT4ge1xuICBkZXNjcmliZSgnc2l6ZUV4cHInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBmb3JtdWxhIGZvciBvcmRpbmFsLXBvaW50IHNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLCAvLyBwb2ludCBtYXJrIHByb2R1Y2Ugb3JkaW5hbC1wb2ludCBzY2FsZSBieSBkZWZhdWx0XG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNpemUgPSBzaXplU2lnbmFscyhtb2RlbCwgJ3dpZHRoJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNpemUsIFt7XG4gICAgICAgIG5hbWU6ICd4X3N0ZXAnLFxuICAgICAgICB2YWx1ZTogMjFcbiAgICAgIH0se1xuICAgICAgICBuYW1lOiAnd2lkdGgnLFxuICAgICAgICB1cGRhdGU6ICdiYW5kc3BhY2UoZG9tYWluKFxcJ3hcXCcpLmxlbmd0aCwgMSwgMC41KSAqIHhfc3RlcCdcbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZm9ybXVsYSBmb3Igb3JkaW5hbC1iYW5kIHNjYWxlIHdpdGggY3VzdG9tIHBhZGRpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIG1hcms6ICdyZWN0JywgLy8gcmVjdCBwcm9kdWNlcyBvcmRpbmFsLWJhbmQgYnkgZGVmYXVsdFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNjYWxlOiB7cGFkZGluZzogMC4zfX0sXG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzaXplID0gc2l6ZVNpZ25hbHMobW9kZWwsICd3aWR0aCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzaXplLCBbe1xuICAgICAgICBuYW1lOiAneF9zdGVwJyxcbiAgICAgICAgdmFsdWU6IDIxXG4gICAgICB9LHtcbiAgICAgICAgbmFtZTogJ3dpZHRoJyxcbiAgICAgICAgdXBkYXRlOiAnYmFuZHNwYWNlKGRvbWFpbihcXCd4XFwnKS5sZW5ndGgsIDAuMywgMC4zKSAqIHhfc3RlcCdcbiAgICAgIH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZm9ybXVsYSBmb3Igb3JkaW5hbC1iYW5kIHNjYWxlIHdpdGggY3VzdG9tIHBhZGRpbmdJbm5lcicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgbWFyazogJ3JlY3QnLCAvLyByZWN0IHByb2R1Y2VzIG9yZGluYWwtYmFuZCBieSBkZWZhdWx0XG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJywgc2NhbGU6IHtwYWRkaW5nSW5uZXI6IDAuM319LFxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2l6ZSA9IHNpemVTaWduYWxzKG1vZGVsLCAnd2lkdGgnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2l6ZSwgW3tcbiAgICAgICAgbmFtZTogJ3hfc3RlcCcsXG4gICAgICAgIHZhbHVlOiAyMVxuICAgICAgfSx7XG4gICAgICAgIG5hbWU6ICd3aWR0aCcsXG4gICAgICAgIHVwZGF0ZTogJ2JhbmRzcGFjZShkb21haW4oXFwneFxcJykubGVuZ3RoLCAwLjMsIDAuMTUpICogeF9zdGVwJ1xuICAgICAgfV0pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBvbmx5IHN0ZXAgaWYgcGFyZW50IGlzIGZhY2V0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWwoe1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIHJvdzoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgc3BlYzoge1xuICAgICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICAgIHg6IHtmaWVsZDogJ2InLCB0eXBlOiAnbm9taW5hbCd9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgc2NhbGU6IHt4OiAnaW5kZXBlbmRlbnQnfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgICAgIG1vZGVsLnBhcnNlTGF5b3V0U2l6ZSgpO1xuXG4gICAgICBjb25zdCBzaXplID0gc2l6ZVNpZ25hbHMobW9kZWwuY2hpbGQsICd3aWR0aCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzaXplLCBbe1xuICAgICAgICBuYW1lOiAnY2hpbGRfeF9zdGVwJyxcbiAgICAgICAgdmFsdWU6IDIxXG4gICAgICB9XSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBzdGF0aWMgdmlldyBzaXplIGZvciBvcmRpbmFsIHgtc2NhbGUgd2l0aCBudWxsJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNjYWxlOiB7cmFuZ2VTdGVwOiBudWxsfX1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNpemUgPSBzaXplU2lnbmFscyhtb2RlbCwgJ3dpZHRoJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNpemUsIFt7bmFtZTogJ3dpZHRoJywgdmFsdWU6IDIwMH1dKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc3RhdGljIHZpZXcgc2l6ZSBmb3Igb3JkaW5hbCB5LXNjYWxlIHdpdGggbnVsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnLCBzY2FsZToge3JhbmdlU3RlcDogbnVsbH19XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzaXplID0gc2l6ZVNpZ25hbHMobW9kZWwsICdoZWlnaHQnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2l6ZSwgW3tuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IDIwMH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHN0YXRpYyB2aWV3IHNpemUgZm9yIG9yZGluYWwgc2NhbGUgd2l0aCB0b3AtbGV2ZWwgd2lkdGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIHdpZHRoOiAyMDUsXG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNpemUgPSBzaXplU2lnbmFscyhtb2RlbCwgJ3dpZHRoJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNpemUsIFt7bmFtZTogJ3dpZHRoJywgdmFsdWU6IDIwNX1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHN0YXRpYyB2aWV3IHNpemUgZm9yIG9yZGluYWwgc2NhbGUgd2l0aCB0b3AtbGV2ZWwgd2lkdGggZXZlbiBpZiB0aGVyZSBpcyBudW1lcmljIHJhbmdlU3RlcCcsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICB3aWR0aDogMjA1LFxuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNjYWxlOiB7cmFuZ2VTdGVwOiAyMX19XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzaXplID0gc2l6ZVNpZ25hbHMobW9kZWwsICd3aWR0aCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzaXplLCBbe25hbWU6ICd3aWR0aCcsIHZhbHVlOiAyMDV9XSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnJhbmdlU3RlcERyb3BwZWQoWCkpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHN0YXRpYyB2aWV3IHdpZHRoIGZvciBub24tb3JkaW5hbCB4LXNjYWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNpemUgPSBzaXplU2lnbmFscyhtb2RlbCwgJ3dpZHRoJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNpemUsIFt7bmFtZTogJ3dpZHRoJywgdmFsdWU6IDIwMH1dKTtcbiAgICB9KTtcblxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc3RhdGljIHZpZXcgc2l6ZSBmb3Igbm9uLW9yZGluYWwgeS1zY2FsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdhJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzaXplID0gc2l6ZVNpZ25hbHMobW9kZWwsICdoZWlnaHQnKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2l6ZSwgW3tuYW1lOiAnaGVpZ2h0JywgdmFsdWU6IDIwMH1dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGRlZmF1bHQgcmFuZ2VTdGVwIGlmIGF4aXMgaXMgbm90IG1hcHBlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHt9LFxuICAgICAgICBjb25maWc6IHtzY2FsZToge3JhbmdlU3RlcDogMTd9fVxuICAgICAgfSk7XG4gICAgICBjb25zdCBzaXplID0gc2l6ZVNpZ25hbHMobW9kZWwsICd3aWR0aCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzaXplLCBbe25hbWU6ICd3aWR0aCcsIHZhbHVlOiAxN31dKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRleHRYUmFuZ2VTdGVwIGlmIGF4aXMgaXMgbm90IG1hcHBlZCBmb3IgWCBvZiB0ZXh0IG1hcmsnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIG1hcms6ICd0ZXh0JyxcbiAgICAgICAgZW5jb2Rpbmc6IHt9LFxuICAgICAgICBjb25maWc6IHtzY2FsZToge3RleHRYUmFuZ2VTdGVwOiA5MX19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNpemUgPSBzaXplU2lnbmFscyhtb2RlbCwgJ3dpZHRoJyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNpemUsIFt7bmFtZTogJ3dpZHRoJywgdmFsdWU6IDkxfV0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
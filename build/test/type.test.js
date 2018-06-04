"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var type = tslib_1.__importStar(require("../src/type"));
describe('type', function () {
    describe('getFullName()', function () {
        it('should return correct lowercase, full type names.', function () {
            for (var _i = 0, _a = ['q', 'Q', 'quantitative', 'QUANTITATIVE']; _i < _a.length; _i++) {
                var t = _a[_i];
                chai_1.assert.equal(type.getFullName(t), 'quantitative');
            }
            for (var _b = 0, _c = ['t', 'T', 'temporal', 'TEMPORAL']; _b < _c.length; _b++) {
                var t = _c[_b];
                chai_1.assert.equal(type.getFullName(t), 'temporal');
            }
            for (var _d = 0, _e = ['o', 'O', 'ordinal', 'ORDINAL']; _d < _e.length; _d++) {
                var t = _e[_d];
                chai_1.assert.equal(type.getFullName(t), 'ordinal');
            }
            for (var _f = 0, _g = ['n', 'N', 'nominal', 'NOMINAL']; _f < _g.length; _f++) {
                var t = _g[_f];
                chai_1.assert.equal(type.getFullName(t), 'nominal');
            }
            for (var _h = 0, _j = ['latitude', 'LATITUDE']; _h < _j.length; _h++) {
                var t = _j[_h];
                chai_1.assert.equal(type.getFullName(t), 'latitude');
            }
            for (var _k = 0, _l = ['longitude', 'LONGITUDE']; _k < _l.length; _k++) {
                var t = _l[_k];
                chai_1.assert.equal(type.getFullName(t), 'longitude');
            }
            for (var _m = 0, _o = ['geojson', 'GEOJSON']; _m < _o.length; _m++) {
                var t = _o[_m];
                chai_1.assert.equal(type.getFullName(t), 'geojson');
            }
        });
        it('should return undefined for invalid type', function () {
            chai_1.assert.equal(type.getFullName('haha'), undefined);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC90eXBlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTRCO0FBRTVCLHdEQUFvQztBQUVwQyxRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsbURBQW1ELEVBQUU7WUFDdEQsS0FBZ0IsVUFBMEMsRUFBMUMsTUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsRUFBMUMsY0FBMEMsRUFBMUMsSUFBMEMsRUFBRTtnQkFBdkQsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsS0FBZ0IsVUFBa0MsRUFBbEMsTUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBbEMsY0FBa0MsRUFBbEMsSUFBa0MsRUFBRTtnQkFBL0MsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQy9DO1lBQ0QsS0FBZ0IsVUFBZ0MsRUFBaEMsTUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBaEMsY0FBZ0MsRUFBaEMsSUFBZ0MsRUFBRTtnQkFBN0MsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlDO1lBQ0QsS0FBZ0IsVUFBZ0MsRUFBaEMsTUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBaEMsY0FBZ0MsRUFBaEMsSUFBZ0MsRUFBRTtnQkFBN0MsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlDO1lBQ0QsS0FBZ0IsVUFBd0IsRUFBeEIsTUFBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQXhCLGNBQXdCLEVBQXhCLElBQXdCLEVBQUU7Z0JBQXJDLElBQU0sQ0FBQyxTQUFBO2dCQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUMvQztZQUNELEtBQWdCLFVBQTBCLEVBQTFCLE1BQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUExQixjQUEwQixFQUExQixJQUEwQixFQUFFO2dCQUF2QyxJQUFNLENBQUMsU0FBQTtnQkFDVixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7YUFDaEQ7WUFDRCxLQUFnQixVQUFzQixFQUF0QixNQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0IsRUFBRTtnQkFBbkMsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcblxuaW1wb3J0ICogYXMgdHlwZSBmcm9tICcuLi9zcmMvdHlwZSc7XG5cbmRlc2NyaWJlKCd0eXBlJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgnZ2V0RnVsbE5hbWUoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGxvd2VyY2FzZSwgZnVsbCB0eXBlIG5hbWVzLicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgdCBvZiBbJ3EnLCAnUScsICdxdWFudGl0YXRpdmUnLCAnUVVBTlRJVEFUSVZFJ10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHR5cGUuZ2V0RnVsbE5hbWUodCksICdxdWFudGl0YXRpdmUnKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgdCBvZiBbJ3QnLCAnVCcsICd0ZW1wb3JhbCcsICdURU1QT1JBTCddKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbCh0eXBlLmdldEZ1bGxOYW1lKHQpLCAndGVtcG9yYWwnKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgdCBvZiBbJ28nLCAnTycsICdvcmRpbmFsJywgJ09SRElOQUwnXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwodHlwZS5nZXRGdWxsTmFtZSh0KSwgJ29yZGluYWwnKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgdCBvZiBbJ24nLCAnTicsICdub21pbmFsJywgJ05PTUlOQUwnXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwodHlwZS5nZXRGdWxsTmFtZSh0KSwgJ25vbWluYWwnKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgdCBvZiBbJ2xhdGl0dWRlJywgJ0xBVElUVURFJ10pIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHR5cGUuZ2V0RnVsbE5hbWUodCksICdsYXRpdHVkZScpO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCB0IG9mIFsnbG9uZ2l0dWRlJywgJ0xPTkdJVFVERSddKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbCh0eXBlLmdldEZ1bGxOYW1lKHQpLCAnbG9uZ2l0dWRlJyk7XG4gICAgICB9XG4gICAgICBmb3IgKGNvbnN0IHQgb2YgWydnZW9qc29uJywgJ0dFT0pTT04nXSkge1xuICAgICAgICBhc3NlcnQuZXF1YWwodHlwZS5nZXRGdWxsTmFtZSh0KSwgJ2dlb2pzb24nKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgaW52YWxpZCB0eXBlJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHR5cGUuZ2V0RnVsbE5hbWUoJ2hhaGEnKSwgdW5kZWZpbmVkKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
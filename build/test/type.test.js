"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var type = require("../src/type");
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
        });
        it('should return undefined for invalid type', function () {
            chai_1.assert.equal(type.getFullName('haha'), undefined);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC90eXBlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFFNUIsa0NBQW9DO0FBRXBDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyxtREFBbUQsRUFBRTtZQUN0RCxHQUFHLENBQUMsQ0FBWSxVQUEwQyxFQUExQyxNQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxFQUExQyxjQUEwQyxFQUExQyxJQUEwQztnQkFBckQsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2FBQ25EO1lBQ0QsR0FBRyxDQUFDLENBQVksVUFBa0MsRUFBbEMsTUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBbEMsY0FBa0MsRUFBbEMsSUFBa0M7Z0JBQTdDLElBQU0sQ0FBQyxTQUFBO2dCQUNWLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUMvQztZQUNELEdBQUcsQ0FBQyxDQUFZLFVBQWdDLEVBQWhDLE1BQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLEVBQWhDLGNBQWdDLEVBQWhDLElBQWdDO2dCQUEzQyxJQUFNLENBQUMsU0FBQTtnQkFDVixhQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDOUM7WUFDRCxHQUFHLENBQUMsQ0FBWSxVQUFnQyxFQUFoQyxNQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFoQyxjQUFnQyxFQUFoQyxJQUFnQztnQkFBM0MsSUFBTSxDQUFDLFNBQUE7Z0JBQ1YsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzlDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9
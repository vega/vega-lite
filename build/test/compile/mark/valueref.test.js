"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var valueref_1 = require("../../../src/compile/mark/valueref");
describe('compile/mark/valueref', function () {
    describe("getOffset", function () {
        var markDef = {
            "type": "point",
            "x2Offset": 100
        };
        it('should correctly get the offset value for the given channel', function () {
            chai_1.assert.equal(valueref_1.getOffset('x2', markDef), 100);
        });
        it('should return undefined when the offset value for the given channel is not defined', function () {
            chai_1.assert.equal(valueref_1.getOffset('x', markDef), undefined);
        });
    });
    describe('midPoint()', function () {
        it('should return correct value for width', function () {
            var ref = valueref_1.midPoint('x', { value: 'width' }, undefined, undefined, undefined, undefined);
            chai_1.assert.deepEqual(ref, { field: { group: 'width' } });
        });
        it('should return correct value for height', function () {
            var ref = valueref_1.midPoint('y', { value: 'height' }, undefined, undefined, undefined, undefined);
            chai_1.assert.deepEqual(ref, { field: { group: 'height' } });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVyZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tYXJrL3ZhbHVlcmVmLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw4QkFBOEI7QUFDOUIsNkJBQTRCO0FBRTVCLCtEQUF1RTtBQUl2RSxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixJQUFNLE9BQU8sR0FBWTtZQUN2QixNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFDRixFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDaEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxvRkFBb0YsRUFBRTtZQUN2RixhQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRW5ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRTtZQUMxQyxJQUFNLEdBQUcsR0FBRyxtQkFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RixhQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsSUFBTSxHQUFHLEdBQUcsbUJBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDekYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge2dldE9mZnNldCwgbWlkUG9pbnR9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdmFsdWVyZWYnO1xuaW1wb3J0IHtNYXJrRGVmfSBmcm9tICcuLi8uLi8uLi9zcmMvbWFyayc7XG5cblxuZGVzY3JpYmUoJ2NvbXBpbGUvbWFyay92YWx1ZXJlZicsICgpID0+IHtcbiAgZGVzY3JpYmUoXCJnZXRPZmZzZXRcIiwgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1hcmtEZWY6IE1hcmtEZWYgPSB7XG4gICAgICBcInR5cGVcIjogXCJwb2ludFwiLFxuICAgICAgXCJ4Mk9mZnNldFwiOiAxMDBcbiAgICB9O1xuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IGdldCB0aGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgZ2l2ZW4gY2hhbm5lbCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5lcXVhbChnZXRPZmZzZXQoJ3gyJywgbWFya0RlZiksIDEwMCk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIHdoZW4gdGhlIG9mZnNldCB2YWx1ZSBmb3IgdGhlIGdpdmVuIGNoYW5uZWwgaXMgbm90IGRlZmluZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhc3NlcnQuZXF1YWwoZ2V0T2Zmc2V0KCd4JywgbWFya0RlZiksIHVuZGVmaW5lZCk7XG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ21pZFBvaW50KCknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB2YWx1ZSBmb3Igd2lkdGgnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZWYgPSBtaWRQb2ludCgneCcsIHt2YWx1ZTogJ3dpZHRoJ30sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlZiwge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9fSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB2YWx1ZSBmb3IgaGVpZ2h0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVmID0gbWlkUG9pbnQoJ3knLCB7dmFsdWU6ICdoZWlnaHQnfSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVmLCB7ZmllbGQ6IHtncm91cDogJ2hlaWdodCd9fSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
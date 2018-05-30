/* tslint:disable:quotemark */
import { assert } from 'chai';
import { getOffset, midPoint } from '../../../src/compile/mark/valueref';
describe('compile/mark/valueref', function () {
    describe("getOffset", function () {
        var markDef = {
            "type": "point",
            "x2Offset": 100
        };
        it('should correctly get the offset value for the given channel', function () {
            assert.equal(getOffset('x2', markDef), 100);
        });
        it('should return undefined when the offset value for the given channel is not defined', function () {
            assert.equal(getOffset('x', markDef), undefined);
        });
    });
    describe('midPoint()', function () {
        it('should return correct value for width', function () {
            var ref = midPoint('x', { value: 'width' }, undefined, undefined, undefined, undefined);
            assert.deepEqual(ref, { field: { group: 'width' } });
        });
        it('should return correct value for height', function () {
            var ref = midPoint('y', { value: 'height' }, undefined, undefined, undefined, undefined);
            assert.deepEqual(ref, { field: { group: 'height' } });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVyZWYudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tYXJrL3ZhbHVlcmVmLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBQzlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUl2RSxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixJQUFNLE9BQU8sR0FBWTtZQUN2QixNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRSxHQUFHO1NBQ2hCLENBQUM7UUFDRixFQUFFLENBQUMsNkRBQTZELEVBQUU7WUFDaEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLG9GQUFvRixFQUFFO1lBQ3ZGLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUVuRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN4RixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFDM0MsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUN6RixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7Z2V0T2Zmc2V0LCBtaWRQb2ludH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay92YWx1ZXJlZic7XG5pbXBvcnQge01hcmtEZWZ9IGZyb20gJy4uLy4uLy4uL3NyYy9tYXJrJztcblxuXG5kZXNjcmliZSgnY29tcGlsZS9tYXJrL3ZhbHVlcmVmJywgKCkgPT4ge1xuICBkZXNjcmliZShcImdldE9mZnNldFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbWFya0RlZjogTWFya0RlZiA9IHtcbiAgICAgIFwidHlwZVwiOiBcInBvaW50XCIsXG4gICAgICBcIngyT2Zmc2V0XCI6IDEwMFxuICAgIH07XG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgZ2V0IHRoZSBvZmZzZXQgdmFsdWUgZm9yIHRoZSBnaXZlbiBjaGFubmVsJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmVxdWFsKGdldE9mZnNldCgneDInLCBtYXJrRGVmKSwgMTAwKTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgd2hlbiB0aGUgb2Zmc2V0IHZhbHVlIGZvciB0aGUgZ2l2ZW4gY2hhbm5lbCBpcyBub3QgZGVmaW5lZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5lcXVhbChnZXRPZmZzZXQoJ3gnLCBtYXJrRGVmKSwgdW5kZWZpbmVkKTtcblxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbWlkUG9pbnQoKScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHZhbHVlIGZvciB3aWR0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlZiA9IG1pZFBvaW50KCd4Jywge3ZhbHVlOiAnd2lkdGgnfSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVmLCB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ319KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHZhbHVlIGZvciBoZWlnaHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZWYgPSBtaWRQb2ludCgneScsIHt2YWx1ZTogJ2hlaWdodCd9LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyZWYsIHtmaWVsZDoge2dyb3VwOiAnaGVpZ2h0J319KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
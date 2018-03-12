"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var bin_1 = require("../src/bin");
var channel_1 = require("../src/channel");
describe('autoMaxBins', function () {
    it('should assign generate correct defaults for different channels', function () {
        // Not testing case for 10 because it's already tested
        [channel_1.COLOR, channel_1.OPACITY, channel_1.SHAPE, channel_1.ROW, channel_1.COLUMN].forEach(function (a) { return chai_1.assert.deepEqual(bin_1.autoMaxBins(a), 6); });
    });
});
describe('binToString', function () {
    it('should generate the corrrect key for boolean', function () {
        chai_1.assert.deepEqual(bin_1.binToString(true), 'bin');
        chai_1.assert.deepEqual(bin_1.binToString(false), 'bin');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2Jpbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLGtDQUFvRDtBQUNwRCwwQ0FBa0U7QUFFbEUsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUN0QixFQUFFLENBQUMsZ0VBQWdFLEVBQUU7UUFDbkUsc0RBQXNEO1FBQ3RELENBQUMsZUFBSyxFQUFFLGlCQUFPLEVBQUUsZUFBSyxFQUFFLGFBQUcsRUFBRSxnQkFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsYUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7SUFDM0YsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxhQUFhLEVBQUU7SUFDdEIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFO1FBQ2xELGFBQU0sQ0FBQyxTQUFTLENBQUMsaUJBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzQyxhQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7YXV0b01heEJpbnMsIGJpblRvU3RyaW5nfSBmcm9tICcuLi9zcmMvYmluJztcbmltcG9ydCB7Q09MT1IsIENPTFVNTiwgT1BBQ0lUWSwgUk9XLCBTSEFQRX0gZnJvbSAnLi4vc3JjL2NoYW5uZWwnO1xuXG5kZXNjcmliZSgnYXV0b01heEJpbnMnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgYXNzaWduIGdlbmVyYXRlIGNvcnJlY3QgZGVmYXVsdHMgZm9yIGRpZmZlcmVudCBjaGFubmVscycsICgpID0+IHtcbiAgICAvLyBOb3QgdGVzdGluZyBjYXNlIGZvciAxMCBiZWNhdXNlIGl0J3MgYWxyZWFkeSB0ZXN0ZWRcbiAgICBbQ09MT1IsIE9QQUNJVFksIFNIQVBFLCBST1csIENPTFVNTl0uZm9yRWFjaCgoYSkgPT4gYXNzZXJ0LmRlZXBFcXVhbChhdXRvTWF4QmlucyhhKSwgNikpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnYmluVG9TdHJpbmcnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgZ2VuZXJhdGUgdGhlIGNvcnJyZWN0IGtleSBmb3IgYm9vbGVhbicsICgpID0+IHtcbiAgIGFzc2VydC5kZWVwRXF1YWwoYmluVG9TdHJpbmcodHJ1ZSksICdiaW4nKTtcbiAgIGFzc2VydC5kZWVwRXF1YWwoYmluVG9TdHJpbmcoZmFsc2UpLCAnYmluJyk7XG4gIH0pO1xufSk7XG4iXX0=
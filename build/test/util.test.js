"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../src/util");
describe('util', function () {
    describe('varName', function () {
        it('replaces all non-alphanumeric characters with _', function () {
            chai_1.assert.equal(util_1.varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
        });
        it('prepends _ if the string starts with number', function () {
            chai_1.assert.equal(util_1.varName('1a'), '_1a');
        });
    });
    describe('stringify', function () {
        it('stringifies numbers', function () {
            chai_1.assert.equal(util_1.stringify(12), '12');
        });
        it('stringifies booleans', function () {
            chai_1.assert.equal(util_1.stringify(true), 'true');
        });
        it('stringifies strings', function () {
            chai_1.assert.equal(util_1.stringify('foo'), '"foo"');
        });
        it('stringifies objects', function () {
            chai_1.assert.equal(util_1.stringify({ foo: 42 }), '{"foo":42}');
        });
    });
    describe('hash', function () {
        it('hashes numbers as numbers', function () {
            chai_1.assert.equal(util_1.hash(12), 12);
        });
        it('hashes booleans as strings so that they can be used as keys', function () {
            chai_1.assert.equal(util_1.hash(true), 'true');
        });
        it('hashes strings as strings', function () {
            chai_1.assert.equal(util_1.hash('foo'), 'foo');
        });
        it('hashes objects', function () {
            chai_1.assert.equal(util_1.hash({ foo: 42 }), '{"foo":42}');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC91dGlsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsb0NBQXFEO0FBRXJELFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNwRCxhQUFNLENBQUMsS0FBSyxDQUFDLGNBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1lBQ3hCLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUU7WUFDeEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1lBQ3hCLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO1lBQ2hFLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1lBQ25CLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtoYXNoLCBzdHJpbmdpZnksIHZhck5hbWV9IGZyb20gJy4uL3NyYy91dGlsJztcblxuZGVzY3JpYmUoJ3V0aWwnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCd2YXJOYW1lJywgKCkgPT4ge1xuICAgIGl0KCdyZXBsYWNlcyBhbGwgbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIHdpdGggXycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbCh2YXJOYW1lKCdiaW4tbXBnJCFAIyVfKzEnKSwgJ2Jpbl9tcGdfX19fX19fMScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3ByZXBlbmRzIF8gaWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCBudW1iZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwodmFyTmFtZSgnMWEnKSwgJ18xYScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnc3RyaW5naWZ5JywgKCkgPT4ge1xuICAgIGl0KCdzdHJpbmdpZmllcyBudW1iZXJzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0cmluZ2lmeSgxMiksICcxMicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N0cmluZ2lmaWVzIGJvb2xlYW5zJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0cmluZ2lmeSh0cnVlKSwgJ3RydWUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzdHJpbmdpZmllcyBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0cmluZ2lmeSgnZm9vJyksICdcImZvb1wiJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3RyaW5naWZpZXMgb2JqZWN0cycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkoe2ZvbzogNDJ9KSwgJ3tcImZvb1wiOjQyfScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaGFzaCcsICgpID0+IHtcbiAgICBpdCgnaGFzaGVzIG51bWJlcnMgYXMgbnVtYmVycycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChoYXNoKDEyKSwgMTIpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hhc2hlcyBib29sZWFucyBhcyBzdHJpbmdzIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBhcyBrZXlzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGhhc2godHJ1ZSksICd0cnVlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGFzaGVzIHN0cmluZ3MgYXMgc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChoYXNoKCdmb28nKSwgJ2ZvbycpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hhc2hlcyBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGhhc2goe2ZvbzogNDJ9KSwgJ3tcImZvb1wiOjQyfScpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
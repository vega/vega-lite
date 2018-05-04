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
    describe('deleteNestedProperty', function () {
        it('removes a property from an object', function () {
            var originalObject = {
                property1: { property1: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            var newObject = {
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            util_1.deleteNestedProperty(originalObject, ['property1']);
            chai_1.assert.equal(util_1.stringify(originalObject), util_1.stringify(newObject));
        });
        it('removes nested properties', function () {
            var originalObject = {
                property1: { property4: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            var newObject = {
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            util_1.deleteNestedProperty(originalObject, ['property1', 'property4']);
            chai_1.assert.equal(util_1.stringify(originalObject), util_1.stringify(newObject));
        });
        it('stops when it does not empty the last element', function () {
            var originalObject = {
                property1: { property4: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3', property7: 'value4' }
            };
            var newObject = {
                property1: { property4: 'value1' },
                property2: { property5: 'value2' },
                property3: { property6: 'value3' }
            };
            util_1.deleteNestedProperty(originalObject, ['property3', 'property7']);
            chai_1.assert.equal(util_1.stringify(originalObject), util_1.stringify(newObject));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC91dGlsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsb0NBQTJFO0FBRTNFLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNwRCxhQUFNLENBQUMsS0FBSyxDQUFDLGNBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1lBQ3hCLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscUJBQXFCLEVBQUU7WUFDeEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBUyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1lBQ3hCLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVB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QUFFLFFBQVEsRUFBQzthQUN0RCxDQUFDO1lBQ0YsSUFBTSxTQUFTLEdBQUc7Z0JBQ2hCLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUM7YUFDakMsQ0FBQztZQUNGLDJCQUFvQixDQUFDLGNBQWMsRUFBRSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRSxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtkZWxldGVOZXN0ZWRQcm9wZXJ0eSwgaGFzaCwgc3RyaW5naWZ5LCB2YXJOYW1lfSBmcm9tICcuLi9zcmMvdXRpbCc7XG5cbmRlc2NyaWJlKCd1dGlsJywgKCkgPT4ge1xuICBkZXNjcmliZSgndmFyTmFtZScsICgpID0+IHtcbiAgICBpdCgncmVwbGFjZXMgYWxsIG5vbi1hbHBoYW51bWVyaWMgY2hhcmFjdGVycyB3aXRoIF8nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwodmFyTmFtZSgnYmluLW1wZyQhQCMlXysxJyksICdiaW5fbXBnX19fX19fXzEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdwcmVwZW5kcyBfIGlmIHRoZSBzdHJpbmcgc3RhcnRzIHdpdGggbnVtYmVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHZhck5hbWUoJzFhJyksICdfMWEnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3N0cmluZ2lmeScsICgpID0+IHtcbiAgICBpdCgnc3RyaW5naWZpZXMgbnVtYmVycycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkoMTIpLCAnMTInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzdHJpbmdpZmllcyBib29sZWFucycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkodHJ1ZSksICd0cnVlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3RyaW5naWZpZXMgc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkoJ2ZvbycpLCAnXCJmb29cIicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N0cmluZ2lmaWVzIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KHtmb286IDQyfSksICd7XCJmb29cIjo0Mn0nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc2gnLCAoKSA9PiB7XG4gICAgaXQoJ2hhc2hlcyBudW1iZXJzIGFzIG51bWJlcnMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoaGFzaCgxMiksIDEyKTtcbiAgICB9KTtcblxuICAgIGl0KCdoYXNoZXMgYm9vbGVhbnMgYXMgc3RyaW5ncyBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgYXMga2V5cycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChoYXNoKHRydWUpLCAndHJ1ZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hhc2hlcyBzdHJpbmdzIGFzIHN0cmluZ3MnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoaGFzaCgnZm9vJyksICdmb28nKTtcbiAgICB9KTtcblxuICAgIGl0KCdoYXNoZXMgb2JqZWN0cycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChoYXNoKHtmb286IDQyfSksICd7XCJmb29cIjo0Mn0nKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdkZWxldGVOZXN0ZWRQcm9wZXJ0eScsICgpID0+IHtcbiAgICAgIGl0KCdyZW1vdmVzIGEgcHJvcGVydHkgZnJvbSBhbiBvYmplY3QnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsT2JqZWN0ID0ge1xuICAgICAgICAgIHByb3BlcnR5MToge3Byb3BlcnR5MTogJ3ZhbHVlMSd9LFxuICAgICAgICAgIHByb3BlcnR5Mjoge3Byb3BlcnR5NTogJ3ZhbHVlMid9LFxuICAgICAgICAgIHByb3BlcnR5Mzoge3Byb3BlcnR5NjogJ3ZhbHVlMycsIHByb3BlcnR5NzogJ3ZhbHVlNCd9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG5ld09iamVjdCA9IHtcbiAgICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgICBwcm9wZXJ0eTM6IHtwcm9wZXJ0eTY6ICd2YWx1ZTMnLCBwcm9wZXJ0eTc6ICd2YWx1ZTQnfVxuICAgICAgICB9O1xuICAgICAgICBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvcmlnaW5hbE9iamVjdCwgWydwcm9wZXJ0eTEnXSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkob3JpZ2luYWxPYmplY3QpLCBzdHJpbmdpZnkobmV3T2JqZWN0KSk7XG4gICAgICB9KTtcblxuICAgICAgaXQoJ3JlbW92ZXMgbmVzdGVkIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsT2JqZWN0ID0ge1xuICAgICAgICAgIHByb3BlcnR5MToge3Byb3BlcnR5NDogJ3ZhbHVlMSd9LFxuICAgICAgICAgIHByb3BlcnR5Mjoge3Byb3BlcnR5NTogJ3ZhbHVlMid9LFxuICAgICAgICAgIHByb3BlcnR5Mzoge3Byb3BlcnR5NjogJ3ZhbHVlMycsIHByb3BlcnR5NzogJ3ZhbHVlNCd9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG5ld09iamVjdCA9IHtcbiAgICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgICBwcm9wZXJ0eTM6IHtwcm9wZXJ0eTY6ICd2YWx1ZTMnLCBwcm9wZXJ0eTc6ICd2YWx1ZTQnfVxuICAgICAgICB9O1xuICAgICAgICBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvcmlnaW5hbE9iamVjdCwgWydwcm9wZXJ0eTEnLCAncHJvcGVydHk0J10pO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KG9yaWdpbmFsT2JqZWN0KSwgc3RyaW5naWZ5KG5ld09iamVjdCkpO1xuICAgICAgfSk7XG5cbiAgICAgIGl0KCdzdG9wcyB3aGVuIGl0IGRvZXMgbm90IGVtcHR5IHRoZSBsYXN0IGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsT2JqZWN0ID0ge1xuICAgICAgICAgIHByb3BlcnR5MToge3Byb3BlcnR5NDogJ3ZhbHVlMSd9LFxuICAgICAgICAgIHByb3BlcnR5Mjoge3Byb3BlcnR5NTogJ3ZhbHVlMid9LFxuICAgICAgICAgIHByb3BlcnR5Mzoge3Byb3BlcnR5NjogJ3ZhbHVlMycsIHByb3BlcnR5NzogJ3ZhbHVlNCd9XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG5ld09iamVjdCA9IHtcbiAgICAgICAgICBwcm9wZXJ0eTE6IHtwcm9wZXJ0eTQ6ICd2YWx1ZTEnfSxcbiAgICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgICBwcm9wZXJ0eTM6IHtwcm9wZXJ0eTY6ICd2YWx1ZTMnfVxuICAgICAgICB9O1xuICAgICAgICBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvcmlnaW5hbE9iamVjdCwgWydwcm9wZXJ0eTMnLCAncHJvcGVydHk3J10pO1xuICAgICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KG9yaWdpbmFsT2JqZWN0KSwgc3RyaW5naWZ5KG5ld09iamVjdCkpO1xuICAgICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
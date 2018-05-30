"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../src/util");
var util_2 = require("../src/util");
describe('util', function () {
    describe('varName', function () {
        it('replaces all non-alphanumeric characters with _', function () {
            chai_1.assert.equal(util_2.varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
        });
        it('prepends _ if the string starts with number', function () {
            chai_1.assert.equal(util_2.varName('1a'), '_1a');
        });
    });
    describe('stringify', function () {
        it('stringifies numbers', function () {
            chai_1.assert.equal(util_2.stringify(12), '12');
        });
        it('stringifies booleans', function () {
            chai_1.assert.equal(util_2.stringify(true), 'true');
        });
        it('stringifies strings', function () {
            chai_1.assert.equal(util_2.stringify('foo'), '"foo"');
        });
        it('stringifies objects', function () {
            chai_1.assert.equal(util_2.stringify({ foo: 42 }), '{"foo":42}');
        });
    });
    describe('hash', function () {
        it('hashes numbers as numbers', function () {
            chai_1.assert.equal(util_2.hash(12), 12);
        });
        it('hashes booleans as strings so that they can be used as keys', function () {
            chai_1.assert.equal(util_2.hash(true), 'true');
        });
        it('hashes strings as strings', function () {
            chai_1.assert.equal(util_2.hash('foo'), 'foo');
        });
        it('hashes objects', function () {
            chai_1.assert.equal(util_2.hash({ foo: 42 }), '{"foo":42}');
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
            util_2.deleteNestedProperty(originalObject, ['property1']);
            chai_1.assert.equal(util_2.stringify(originalObject), util_2.stringify(newObject));
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
            util_2.deleteNestedProperty(originalObject, ['property1', 'property4']);
            chai_1.assert.equal(util_2.stringify(originalObject), util_2.stringify(newObject));
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
            util_2.deleteNestedProperty(originalObject, ['property3', 'property7']);
            chai_1.assert.equal(util_2.stringify(originalObject), util_2.stringify(newObject));
        });
    });
    describe('accessPathWithDatum', function () {
        it('should parse foo', function () {
            chai_1.assert.equal(util_2.accessPathWithDatum('foo'), 'datum["foo"]');
        });
        it('should parse foo.bar', function () {
            chai_1.assert.equal(util_2.accessPathWithDatum('foo.bar'), 'datum["foo"] && datum["foo"]["bar"]');
        });
        it('should support cusotom datum', function () {
            chai_1.assert.equal(util_2.accessPathWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('flatAccessWithDatum', function () {
        it('should parse foo.bar', function () {
            chai_1.assert.equal(util_1.flatAccessWithDatum('foo.bar'), 'datum["foo.bar"]');
        });
        it('should return string value of field name', function () {
            chai_1.assert.equal(util_1.flatAccessWithDatum('foo["bar"].baz'), 'datum["foo.bar.baz"]');
        });
        it('should support cusotom datum', function () {
            chai_1.assert.equal(util_1.flatAccessWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('accessPathDepth', function () {
        it('should return 1 if the field is not nested', function () {
            chai_1.assert.equal(util_2.accessPathDepth('foo'), 1);
        });
        it('should return 1 if . is escaped', function () {
            chai_1.assert.equal(util_2.accessPathDepth('foo\\.bar'), 1);
        });
        it('should return 2 for foo.bar', function () {
            chai_1.assert.equal(util_2.accessPathDepth('foo.bar'), 2);
        });
    });
    describe('removePathFromField', function () {
        it('should convert nested accesses to \\.', function () {
            chai_1.assert.equal(util_2.replacePathInField('foo["bar"].baz'), 'foo\\.bar\\.baz');
        });
        it('should keep \\.', function () {
            chai_1.assert.equal(util_2.replacePathInField('foo\\.bar'), 'foo\\.bar');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC91dGlsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsb0NBQWdEO0FBRWhELG9DQVFxQjtBQUVyQixRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1lBQ2hELGFBQU0sQ0FBQyxLQUFLLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN4QixhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0JBQXNCLEVBQUU7WUFDekIsYUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1lBQ3hCLGFBQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN4QixhQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFTLENBQUMsRUFBQyxHQUFH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QixDQUFDLFdBQVcsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7ZmxhdEFjY2Vzc1dpdGhEYXR1bX0gZnJvbSAnLi4vc3JjL3V0aWwnO1xuXG5pbXBvcnQge1xuICBhY2Nlc3NQYXRoRGVwdGgsXG4gIGFjY2Vzc1BhdGhXaXRoRGF0dW0sXG4gIGRlbGV0ZU5lc3RlZFByb3BlcnR5LFxuICBoYXNoLFxuICByZXBsYWNlUGF0aEluRmllbGQsXG4gIHN0cmluZ2lmeSxcbiAgdmFyTmFtZSxcbn0gZnJvbSAnLi4vc3JjL3V0aWwnO1xuXG5kZXNjcmliZSgndXRpbCcsICgpID0+IHtcbiAgZGVzY3JpYmUoJ3Zhck5hbWUnLCAoKSA9PiB7XG4gICAgaXQoJ3JlcGxhY2VzIGFsbCBub24tYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgd2l0aCBfJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHZhck5hbWUoJ2Jpbi1tcGckIUAjJV8rMScpLCAnYmluX21wZ19fX19fX18xJyk7XG4gICAgfSk7XG5cbiAgICBpdCgncHJlcGVuZHMgXyBpZiB0aGUgc3RyaW5nIHN0YXJ0cyB3aXRoIG51bWJlcicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbCh2YXJOYW1lKCcxYScpLCAnXzFhJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzdHJpbmdpZnknLCAoKSA9PiB7XG4gICAgaXQoJ3N0cmluZ2lmaWVzIG51bWJlcnMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KDEyKSwgJzEyJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3RyaW5naWZpZXMgYm9vbGVhbnMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KHRydWUpLCAndHJ1ZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N0cmluZ2lmaWVzIHN0cmluZ3MnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KCdmb28nKSwgJ1wiZm9vXCInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzdHJpbmdpZmllcyBvYmplY3RzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0cmluZ2lmeSh7Zm9vOiA0Mn0pLCAne1wiZm9vXCI6NDJ9Jyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoYXNoJywgKCkgPT4ge1xuICAgIGl0KCdoYXNoZXMgbnVtYmVycyBhcyBudW1iZXJzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGhhc2goMTIpLCAxMik7XG4gICAgfSk7XG5cbiAgICBpdCgnaGFzaGVzIGJvb2xlYW5zIGFzIHN0cmluZ3Mgc28gdGhhdCB0aGV5IGNhbiBiZSB1c2VkIGFzIGtleXMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoaGFzaCh0cnVlKSwgJ3RydWUnKTtcbiAgICB9KTtcblxuICAgIGl0KCdoYXNoZXMgc3RyaW5ncyBhcyBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGhhc2goJ2ZvbycpLCAnZm9vJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGFzaGVzIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoaGFzaCh7Zm9vOiA0Mn0pLCAne1wiZm9vXCI6NDJ9Jyk7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZSgnZGVsZXRlTmVzdGVkUHJvcGVydHknLCAoKSA9PiB7XG4gICAgaXQoJ3JlbW92ZXMgYSBwcm9wZXJ0eSBmcm9tIGFuIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsT2JqZWN0ID0ge1xuICAgICAgICBwcm9wZXJ0eTE6IHtwcm9wZXJ0eTE6ICd2YWx1ZTEnfSxcbiAgICAgICAgcHJvcGVydHkyOiB7cHJvcGVydHk1OiAndmFsdWUyJ30sXG4gICAgICAgIHByb3BlcnR5Mzoge3Byb3BlcnR5NjogJ3ZhbHVlMycsIHByb3BlcnR5NzogJ3ZhbHVlNCd9XG4gICAgICB9O1xuICAgICAgY29uc3QgbmV3T2JqZWN0ID0ge1xuICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgcHJvcGVydHkzOiB7cHJvcGVydHk2OiAndmFsdWUzJywgcHJvcGVydHk3OiAndmFsdWU0J31cbiAgICAgIH07XG4gICAgICBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvcmlnaW5hbE9iamVjdCwgWydwcm9wZXJ0eTEnXSk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KG9yaWdpbmFsT2JqZWN0KSwgc3RyaW5naWZ5KG5ld09iamVjdCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3JlbW92ZXMgbmVzdGVkIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvcmlnaW5hbE9iamVjdCA9IHtcbiAgICAgICAgcHJvcGVydHkxOiB7cHJvcGVydHk0OiAndmFsdWUxJ30sXG4gICAgICAgIHByb3BlcnR5Mjoge3Byb3BlcnR5NTogJ3ZhbHVlMid9LFxuICAgICAgICBwcm9wZXJ0eTM6IHtwcm9wZXJ0eTY6ICd2YWx1ZTMnLCBwcm9wZXJ0eTc6ICd2YWx1ZTQnfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5ld09iamVjdCA9IHtcbiAgICAgICAgcHJvcGVydHkyOiB7cHJvcGVydHk1OiAndmFsdWUyJ30sXG4gICAgICAgIHByb3BlcnR5Mzoge3Byb3BlcnR5NjogJ3ZhbHVlMycsIHByb3BlcnR5NzogJ3ZhbHVlNCd9XG4gICAgICB9O1xuICAgICAgZGVsZXRlTmVzdGVkUHJvcGVydHkob3JpZ2luYWxPYmplY3QsIFsncHJvcGVydHkxJywgJ3Byb3BlcnR5NCddKTtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkob3JpZ2luYWxPYmplY3QpLCBzdHJpbmdpZnkobmV3T2JqZWN0KSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3RvcHMgd2hlbiBpdCBkb2VzIG5vdCBlbXB0eSB0aGUgbGFzdCBlbGVtZW50JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3JpZ2luYWxPYmplY3QgPSB7XG4gICAgICAgIHByb3BlcnR5MToge3Byb3BlcnR5NDogJ3ZhbHVlMSd9LFxuICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgcHJvcGVydHkzOiB7cHJvcGVydHk2OiAndmFsdWUzJywgcHJvcGVydHk3OiAndmFsdWU0J31cbiAgICAgIH07XG4gICAgICBjb25zdCBuZXdPYmplY3QgPSB7XG4gICAgICAgIHByb3BlcnR5MToge3Byb3BlcnR5NDogJ3ZhbHVlMSd9LFxuICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgcHJvcGVydHkzOiB7cHJvcGVydHk2OiAndmFsdWUzJ31cbiAgICAgIH07XG4gICAgICBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvcmlnaW5hbE9iamVjdCwgWydwcm9wZXJ0eTMnLCAncHJvcGVydHk3J10pO1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0cmluZ2lmeShvcmlnaW5hbE9iamVjdCksIHN0cmluZ2lmeShuZXdPYmplY3QpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FjY2Vzc1BhdGhXaXRoRGF0dW0nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBmb28nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoYWNjZXNzUGF0aFdpdGhEYXR1bSgnZm9vJyksICdkYXR1bVtcImZvb1wiXScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBmb28uYmFyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGFjY2Vzc1BhdGhXaXRoRGF0dW0oJ2Zvby5iYXInKSwgJ2RhdHVtW1wiZm9vXCJdICYmIGRhdHVtW1wiZm9vXCJdW1wiYmFyXCJdJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3Vzb3RvbSBkYXR1bScsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChhY2Nlc3NQYXRoV2l0aERhdHVtKCdmb28nLCAncGFyZW50JyksICdwYXJlbnRbXCJmb29cIl0nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2ZsYXRBY2Nlc3NXaXRoRGF0dW0nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBmb28uYmFyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGZsYXRBY2Nlc3NXaXRoRGF0dW0oJ2Zvby5iYXInKSwgJ2RhdHVtW1wiZm9vLmJhclwiXScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gc3RyaW5nIHZhbHVlIG9mIGZpZWxkIG5hbWUnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZmxhdEFjY2Vzc1dpdGhEYXR1bSgnZm9vW1wiYmFyXCJdLmJheicpLCAnZGF0dW1bXCJmb28uYmFyLmJhelwiXScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzdXBwb3J0IGN1c290b20gZGF0dW0nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZmxhdEFjY2Vzc1dpdGhEYXR1bSgnZm9vJywgJ3BhcmVudCcpLCAncGFyZW50W1wiZm9vXCJdJyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhY2Nlc3NQYXRoRGVwdGgnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gMSBpZiB0aGUgZmllbGQgaXMgbm90IG5lc3RlZCcsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChhY2Nlc3NQYXRoRGVwdGgoJ2ZvbycpLCAxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIDEgaWYgLiBpcyBlc2NhcGVkJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGFjY2Vzc1BhdGhEZXB0aCgnZm9vXFxcXC5iYXInKSwgMSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiAyIGZvciBmb28uYmFyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGFjY2Vzc1BhdGhEZXB0aCgnZm9vLmJhcicpLCAyKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3JlbW92ZVBhdGhGcm9tRmllbGQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IG5lc3RlZCBhY2Nlc3NlcyB0byBcXFxcLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChyZXBsYWNlUGF0aEluRmllbGQoJ2Zvb1tcImJhclwiXS5iYXonKSwgJ2Zvb1xcXFwuYmFyXFxcXC5iYXonKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQga2VlcCBcXFxcLicsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChyZXBsYWNlUGF0aEluRmllbGQoJ2Zvb1xcXFwuYmFyJyksICdmb29cXFxcLmJhcicpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
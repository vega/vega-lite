import { assert } from 'chai';
import { flatAccessWithDatum } from '../src/util';
import { accessPathDepth, accessPathWithDatum, deleteNestedProperty, hash, replacePathInField, stringify, varName, } from '../src/util';
describe('util', function () {
    describe('varName', function () {
        it('replaces all non-alphanumeric characters with _', function () {
            assert.equal(varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
        });
        it('prepends _ if the string starts with number', function () {
            assert.equal(varName('1a'), '_1a');
        });
    });
    describe('stringify', function () {
        it('stringifies numbers', function () {
            assert.equal(stringify(12), '12');
        });
        it('stringifies booleans', function () {
            assert.equal(stringify(true), 'true');
        });
        it('stringifies strings', function () {
            assert.equal(stringify('foo'), '"foo"');
        });
        it('stringifies objects', function () {
            assert.equal(stringify({ foo: 42 }), '{"foo":42}');
        });
    });
    describe('hash', function () {
        it('hashes numbers as numbers', function () {
            assert.equal(hash(12), 12);
        });
        it('hashes booleans as strings so that they can be used as keys', function () {
            assert.equal(hash(true), 'true');
        });
        it('hashes strings as strings', function () {
            assert.equal(hash('foo'), 'foo');
        });
        it('hashes objects', function () {
            assert.equal(hash({ foo: 42 }), '{"foo":42}');
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
            deleteNestedProperty(originalObject, ['property1']);
            assert.equal(stringify(originalObject), stringify(newObject));
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
            deleteNestedProperty(originalObject, ['property1', 'property4']);
            assert.equal(stringify(originalObject), stringify(newObject));
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
            deleteNestedProperty(originalObject, ['property3', 'property7']);
            assert.equal(stringify(originalObject), stringify(newObject));
        });
    });
    describe('accessPathWithDatum', function () {
        it('should parse foo', function () {
            assert.equal(accessPathWithDatum('foo'), 'datum["foo"]');
        });
        it('should parse foo.bar', function () {
            assert.equal(accessPathWithDatum('foo.bar'), 'datum["foo"] && datum["foo"]["bar"]');
        });
        it('should support cusotom datum', function () {
            assert.equal(accessPathWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('flatAccessWithDatum', function () {
        it('should parse foo.bar', function () {
            assert.equal(flatAccessWithDatum('foo.bar'), 'datum["foo.bar"]');
        });
        it('should return string value of field name', function () {
            assert.equal(flatAccessWithDatum('foo["bar"].baz'), 'datum["foo.bar.baz"]');
        });
        it('should support cusotom datum', function () {
            assert.equal(flatAccessWithDatum('foo', 'parent'), 'parent["foo"]');
        });
    });
    describe('accessPathDepth', function () {
        it('should return 1 if the field is not nested', function () {
            assert.equal(accessPathDepth('foo'), 1);
        });
        it('should return 1 if . is escaped', function () {
            assert.equal(accessPathDepth('foo\\.bar'), 1);
        });
        it('should return 2 for foo.bar', function () {
            assert.equal(accessPathDepth('foo.bar'), 2);
        });
    });
    describe('removePathFromField', function () {
        it('should convert nested accesses to \\.', function () {
            assert.equal(replacePathInField('foo["bar"].baz'), 'foo\\.bar\\.baz');
        });
        it('should keep \\.', function () {
            assert.equal(replacePathInField('foo\\.bar'), 'foo\\.bar');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC91dGlsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFaEQsT0FBTyxFQUNMLGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3BCLElBQUksRUFDSixrQkFBa0IsRUFDbEIsU0FBUyxFQUNULE9BQU8sR0FDUixNQUFNLGFBQWEsQ0FBQztBQUVyQixRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ2YsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1lBQ2hELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZEQUE2RCxFQUFFO1lBQ2hFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1lBQ25CLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsSUFBTSxjQUFjLEdBQUc7Z0JBQ3JCLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQzthQUN0RCxDQUFDO1lBQ0YsSUFBTSxTQUFTLEdBQUc7Z0JBQ2hCLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUM7Z0JBQ2hDLFNBQVMsRUFBRSxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQzthQUN0RCxDQUFDO1lBQ0Ysb0JBQW9CLENBQUMsY0FBYyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixJQUFNLGNBQWMsR0FBRztnQkFDckIsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQztnQkFDaEMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQztnQkFDaEMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDO2FBQ3RELENBQUM7WUFDRixJQUFNLFNBQVMsR0FBRztnQkFDaEIsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQztnQkFDaEMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDO2FBQ3RELENBQUM7WUFDRixvQkFBb0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNqRSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNsRCxJQUFNLGNBQWMsR0FBRztnQkFDckIsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQztnQkFDaEMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQztnQkFDaEMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDO2FBQ3RELENBQUM7WUFDRixJQUFNLFNBQVMsR0FBRztnQkFDaEIsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQztnQkFDaEMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQztnQkFDaEMsU0FBUyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQzthQUNqQyxDQUFDO1lBQ0Ysb0JBQW9CLENBQUMsY0FBYyxFQUFFLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsa0JBQWtCLEVBQUU7WUFDckIsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtZQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixFQUFFLENBQUMsc0JBQXNCLEVBQUU7WUFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDhCQUE4QixFQUFFO1lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1lBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1lBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQzFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlCQUFpQixFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtmbGF0QWNjZXNzV2l0aERhdHVtfSBmcm9tICcuLi9zcmMvdXRpbCc7XG5cbmltcG9ydCB7XG4gIGFjY2Vzc1BhdGhEZXB0aCxcbiAgYWNjZXNzUGF0aFdpdGhEYXR1bSxcbiAgZGVsZXRlTmVzdGVkUHJvcGVydHksXG4gIGhhc2gsXG4gIHJlcGxhY2VQYXRoSW5GaWVsZCxcbiAgc3RyaW5naWZ5LFxuICB2YXJOYW1lLFxufSBmcm9tICcuLi9zcmMvdXRpbCc7XG5cbmRlc2NyaWJlKCd1dGlsJywgKCkgPT4ge1xuICBkZXNjcmliZSgndmFyTmFtZScsICgpID0+IHtcbiAgICBpdCgncmVwbGFjZXMgYWxsIG5vbi1hbHBoYW51bWVyaWMgY2hhcmFjdGVycyB3aXRoIF8nLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwodmFyTmFtZSgnYmluLW1wZyQhQCMlXysxJyksICdiaW5fbXBnX19fX19fXzEnKTtcbiAgICB9KTtcblxuICAgIGl0KCdwcmVwZW5kcyBfIGlmIHRoZSBzdHJpbmcgc3RhcnRzIHdpdGggbnVtYmVyJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHZhck5hbWUoJzFhJyksICdfMWEnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3N0cmluZ2lmeScsICgpID0+IHtcbiAgICBpdCgnc3RyaW5naWZpZXMgbnVtYmVycycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkoMTIpLCAnMTInKTtcbiAgICB9KTtcblxuICAgIGl0KCdzdHJpbmdpZmllcyBib29sZWFucycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkodHJ1ZSksICd0cnVlJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc3RyaW5naWZpZXMgc3RyaW5ncycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkoJ2ZvbycpLCAnXCJmb29cIicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3N0cmluZ2lmaWVzIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KHtmb286IDQyfSksICd7XCJmb29cIjo0Mn0nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc2gnLCAoKSA9PiB7XG4gICAgaXQoJ2hhc2hlcyBudW1iZXJzIGFzIG51bWJlcnMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoaGFzaCgxMiksIDEyKTtcbiAgICB9KTtcblxuICAgIGl0KCdoYXNoZXMgYm9vbGVhbnMgYXMgc3RyaW5ncyBzbyB0aGF0IHRoZXkgY2FuIGJlIHVzZWQgYXMga2V5cycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChoYXNoKHRydWUpLCAndHJ1ZScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hhc2hlcyBzdHJpbmdzIGFzIHN0cmluZ3MnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoaGFzaCgnZm9vJyksICdmb28nKTtcbiAgICB9KTtcblxuICAgIGl0KCdoYXNoZXMgb2JqZWN0cycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChoYXNoKHtmb286IDQyfSksICd7XCJmb29cIjo0Mn0nKTtcbiAgICB9KTtcbiAgfSk7XG4gIGRlc2NyaWJlKCdkZWxldGVOZXN0ZWRQcm9wZXJ0eScsICgpID0+IHtcbiAgICBpdCgncmVtb3ZlcyBhIHByb3BlcnR5IGZyb20gYW4gb2JqZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3JpZ2luYWxPYmplY3QgPSB7XG4gICAgICAgIHByb3BlcnR5MToge3Byb3BlcnR5MTogJ3ZhbHVlMSd9LFxuICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgcHJvcGVydHkzOiB7cHJvcGVydHk2OiAndmFsdWUzJywgcHJvcGVydHk3OiAndmFsdWU0J31cbiAgICAgIH07XG4gICAgICBjb25zdCBuZXdPYmplY3QgPSB7XG4gICAgICAgIHByb3BlcnR5Mjoge3Byb3BlcnR5NTogJ3ZhbHVlMid9LFxuICAgICAgICBwcm9wZXJ0eTM6IHtwcm9wZXJ0eTY6ICd2YWx1ZTMnLCBwcm9wZXJ0eTc6ICd2YWx1ZTQnfVxuICAgICAgfTtcbiAgICAgIGRlbGV0ZU5lc3RlZFByb3BlcnR5KG9yaWdpbmFsT2JqZWN0LCBbJ3Byb3BlcnR5MSddKTtcbiAgICAgIGFzc2VydC5lcXVhbChzdHJpbmdpZnkob3JpZ2luYWxPYmplY3QpLCBzdHJpbmdpZnkobmV3T2JqZWN0KSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmVtb3ZlcyBuZXN0ZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsT2JqZWN0ID0ge1xuICAgICAgICBwcm9wZXJ0eTE6IHtwcm9wZXJ0eTQ6ICd2YWx1ZTEnfSxcbiAgICAgICAgcHJvcGVydHkyOiB7cHJvcGVydHk1OiAndmFsdWUyJ30sXG4gICAgICAgIHByb3BlcnR5Mzoge3Byb3BlcnR5NjogJ3ZhbHVlMycsIHByb3BlcnR5NzogJ3ZhbHVlNCd9XG4gICAgICB9O1xuICAgICAgY29uc3QgbmV3T2JqZWN0ID0ge1xuICAgICAgICBwcm9wZXJ0eTI6IHtwcm9wZXJ0eTU6ICd2YWx1ZTInfSxcbiAgICAgICAgcHJvcGVydHkzOiB7cHJvcGVydHk2OiAndmFsdWUzJywgcHJvcGVydHk3OiAndmFsdWU0J31cbiAgICAgIH07XG4gICAgICBkZWxldGVOZXN0ZWRQcm9wZXJ0eShvcmlnaW5hbE9iamVjdCwgWydwcm9wZXJ0eTEnLCAncHJvcGVydHk0J10pO1xuICAgICAgYXNzZXJ0LmVxdWFsKHN0cmluZ2lmeShvcmlnaW5hbE9iamVjdCksIHN0cmluZ2lmeShuZXdPYmplY3QpKTtcbiAgICB9KTtcblxuICAgIGl0KCdzdG9wcyB3aGVuIGl0IGRvZXMgbm90IGVtcHR5IHRoZSBsYXN0IGVsZW1lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvcmlnaW5hbE9iamVjdCA9IHtcbiAgICAgICAgcHJvcGVydHkxOiB7cHJvcGVydHk0OiAndmFsdWUxJ30sXG4gICAgICAgIHByb3BlcnR5Mjoge3Byb3BlcnR5NTogJ3ZhbHVlMid9LFxuICAgICAgICBwcm9wZXJ0eTM6IHtwcm9wZXJ0eTY6ICd2YWx1ZTMnLCBwcm9wZXJ0eTc6ICd2YWx1ZTQnfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG5ld09iamVjdCA9IHtcbiAgICAgICAgcHJvcGVydHkxOiB7cHJvcGVydHk0OiAndmFsdWUxJ30sXG4gICAgICAgIHByb3BlcnR5Mjoge3Byb3BlcnR5NTogJ3ZhbHVlMid9LFxuICAgICAgICBwcm9wZXJ0eTM6IHtwcm9wZXJ0eTY6ICd2YWx1ZTMnfVxuICAgICAgfTtcbiAgICAgIGRlbGV0ZU5lc3RlZFByb3BlcnR5KG9yaWdpbmFsT2JqZWN0LCBbJ3Byb3BlcnR5MycsICdwcm9wZXJ0eTcnXSk7XG4gICAgICBhc3NlcnQuZXF1YWwoc3RyaW5naWZ5KG9yaWdpbmFsT2JqZWN0KSwgc3RyaW5naWZ5KG5ld09iamVjdCkpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYWNjZXNzUGF0aFdpdGhEYXR1bScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhcnNlIGZvbycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChhY2Nlc3NQYXRoV2l0aERhdHVtKCdmb28nKSwgJ2RhdHVtW1wiZm9vXCJdJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHBhcnNlIGZvby5iYXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoYWNjZXNzUGF0aFdpdGhEYXR1bSgnZm9vLmJhcicpLCAnZGF0dW1bXCJmb29cIl0gJiYgZGF0dW1bXCJmb29cIl1bXCJiYXJcIl0nKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc3VwcG9ydCBjdXNvdG9tIGRhdHVtJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGFjY2Vzc1BhdGhXaXRoRGF0dW0oJ2ZvbycsICdwYXJlbnQnKSwgJ3BhcmVudFtcImZvb1wiXScpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZmxhdEFjY2Vzc1dpdGhEYXR1bScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhcnNlIGZvby5iYXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoZmxhdEFjY2Vzc1dpdGhEYXR1bSgnZm9vLmJhcicpLCAnZGF0dW1bXCJmb28uYmFyXCJdJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBzdHJpbmcgdmFsdWUgb2YgZmllbGQgbmFtZScsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChmbGF0QWNjZXNzV2l0aERhdHVtKCdmb29bXCJiYXJcIl0uYmF6JyksICdkYXR1bVtcImZvby5iYXIuYmF6XCJdJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3Vzb3RvbSBkYXR1bScsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbChmbGF0QWNjZXNzV2l0aERhdHVtKCdmb28nLCAncGFyZW50JyksICdwYXJlbnRbXCJmb29cIl0nKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FjY2Vzc1BhdGhEZXB0aCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiAxIGlmIHRoZSBmaWVsZCBpcyBub3QgbmVzdGVkJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKGFjY2Vzc1BhdGhEZXB0aCgnZm9vJyksIDEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gMSBpZiAuIGlzIGVzY2FwZWQnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoYWNjZXNzUGF0aERlcHRoKCdmb29cXFxcLmJhcicpLCAxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIDIgZm9yIGZvby5iYXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwoYWNjZXNzUGF0aERlcHRoKCdmb28uYmFyJyksIDIpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmVtb3ZlUGF0aEZyb21GaWVsZCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbmVzdGVkIGFjY2Vzc2VzIHRvIFxcXFwuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJlcGxhY2VQYXRoSW5GaWVsZCgnZm9vW1wiYmFyXCJdLmJheicpLCAnZm9vXFxcXC5iYXJcXFxcLmJheicpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBrZWVwIFxcXFwuJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmVxdWFsKHJlcGxhY2VQYXRoSW5GaWVsZCgnZm9vXFxcXC5iYXInKSwgJ2Zvb1xcXFwuYmFyJyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
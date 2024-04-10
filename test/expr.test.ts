import {deepReplaceExprRef} from '../src/expr';

describe('expr', () => {
  describe('deepReplaceExprRef', () => {
    it('should replace expression refs', () => {
      expect(deepReplaceExprRef({expr: 'foo'})).toEqual({signal: 42});
      expect(deepReplaceExprRef({foo: {bar: {expr: 'foo'}}})).toEqual({foo: {bar: {signal: 42}}});
      expect(deepReplaceExprRef({foo: {expr: 'foo'}, bar: 12})).toEqual({foo: {signal: 42}, bar: 12});
      expect(deepReplaceExprRef([{expr: 'foo'}])).toEqual([{signal: 42}]);
    });

    it('should ignore values to avoid expensive recursion', () => {
      expect(deepReplaceExprRef({values: {expr: 'foo'}})).toEqual({values: {expr: 'foo'}});
    });
  });
});

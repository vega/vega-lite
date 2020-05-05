import {mergeTitle} from '../../src/compile/common';

describe('Common', () => {
  describe('mergeTitle()', () => {
    it('should drop falsy title(s) when merged', () => {
      expect(mergeTitle('title', null)).toBe('title');
      expect(mergeTitle(null, 'title')).toBe('title');
      expect(mergeTitle(null, null)).toBeNull();
    });

    it('should drop one title when both are the same', () => {
      expect(mergeTitle('title', 'title')).toBe('title');
    });

    it('should join 2 titles with comma when both titles are not falsy and difference', () => {
      expect(mergeTitle('title1', 'title2')).toBe('title1, title2');
    });
  });
});

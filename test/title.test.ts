import {extractTitleConfig} from '../src/title.js';
describe('title', () => {
  describe('extractTitleConfig', () => {
    it('extract angle and limit of config.title as title property', () => {
      expect(extractTitleConfig({angle: 1, limit: 5}).nonMarkTitleProperties).toEqual({angle: 1, limit: 5});
    });
  });
});

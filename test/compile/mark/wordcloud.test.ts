import {compile} from '../../../src/compile/compile.js';
import {wordcloud} from '../../../src/compile/mark/wordcloud.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util.js';

describe('Mark: Wordcloud', () => {
  describe('encodeEntry', () => {
    it('should encode text and set align/baseline defaults', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
        data: {values: [{word: 'hello', count: 10}]},
        config: {mark: {tooltip: null}},
      });
      const props = wordcloud.encodeEntry(model);

      expect(props.text).toEqual({signal: 'isValid(datum["word"]) ? datum["word"] : ""+datum["word"]'});
      expect(props.align).toEqual({value: 'center'});
      expect(props.baseline).toEqual({value: 'alphabetic'});
    });

    it('should map x, y, fontSize, angle from transform output fields', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
        data: {values: [{word: 'hello'}]},
        config: {mark: {tooltip: null}},
      });
      const props = wordcloud.encodeEntry(model);

      expect(props.x).toEqual({field: 'x'});
      expect(props.y).toEqual({field: 'y'});
      expect(props.fontSize).toEqual({field: 'fontSize'});
      expect(props.angle).toEqual({field: 'rotate'});
      expect(props.font).toEqual({field: 'font'});
      expect(props.fontStyle).toEqual({field: 'fontStyle'});
      expect(props.fontWeight).toEqual({field: 'fontWeight'});
    });

    it('should encode color', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          color: {field: 'category', type: 'nominal'},
        },
        data: {values: [{word: 'hello', category: 'a'}]},
        config: {mark: {tooltip: null}},
      });
      const props = wordcloud.encodeEntry(model);
      expect(props.fill).toEqual({scale: 'color', field: 'category'});
    });

    it('should read fontSize from transform output (not from size encoding directly)', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          size: {field: 'count', type: 'quantitative'},
        },
        data: {values: [{word: 'hello', count: 10}]},
        config: {mark: {tooltip: null}},
      });
      const props = wordcloud.encodeEntry(model);
      expect(props.fontSize).toEqual({field: 'fontSize'});
      expect(props.size).toBeUndefined();
    });
  });

  describe('postEncodingTransform', () => {
    it('should produce a wordcloud transform with text field', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
        data: {values: [{word: 'hello'}]},
      });
      const transforms = wordcloud.postEncodingTransform(model);

      expect(transforms).toHaveLength(1);
      const t = transforms[0];
      expect(t.type).toBe('wordcloud');
      expect((t as any).text).toEqual({field: 'datum.word'});
    });

    it('should set fontSize and fontSizeRange from size encoding with scale.range', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          size: {field: 'count', type: 'quantitative', scale: {range: [10, 56]}},
        },
        data: {values: [{word: 'hello', count: 10}]},
      });
      const transforms = wordcloud.postEncodingTransform(model);
      const t = transforms[0] as any;

      expect(t.fontSize).toEqual({field: 'datum.count'});
      expect(t.fontSizeRange).toEqual([10, 56]);
    });

    it('should use markDef fontSize when no size encoding', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'wordcloud', fontSize: 14},
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
        data: {values: [{word: 'hello'}]},
      });
      const transforms = wordcloud.postEncodingTransform(model);
      const t = transforms[0] as any;

      expect(t.fontSize).toBe(14);
    });

    it('should set rotate from angle encoding', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          angle: {field: 'rotation', type: 'quantitative'},
        },
        data: {values: [{word: 'hello', rotation: 45}]},
      });
      const transforms = wordcloud.postEncodingTransform(model);
      const t = transforms[0] as any;

      expect(t.rotate).toEqual({field: 'datum.rotation'});
    });

    it('should pass font properties from mark def', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'wordcloud', font: 'Helvetica', fontStyle: 'italic', fontWeight: 'bold'},
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
        data: {values: [{word: 'hello'}]},
      });
      const transforms = wordcloud.postEncodingTransform(model);
      const t = transforms[0] as any;

      expect(t.font).toBe('Helvetica');
      expect(t.fontStyle).toBe('italic');
      expect(t.fontWeight).toBe('bold');
    });

    it('should pass wordcloud-specific properties', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'wordcloud', padding: 4, spiral: 'rectangular'},
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
        data: {values: [{word: 'hello'}]},
      });
      const transforms = wordcloud.postEncodingTransform(model);
      const t = transforms[0] as any;

      expect(t.padding).toBe(4);
      expect(t.spiral).toBe('rectangular');
    });

    it('should use width/height signal refs for transform size', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
        data: {values: [{word: 'hello'}]},
      });
      const transforms = wordcloud.postEncodingTransform(model);
      const t = transforms[0] as any;

      expect(t.size).toHaveLength(2);
      expect(t.size[0]).toHaveProperty('signal');
      expect(t.size[1]).toHaveProperty('signal');
    });
  });

  describe('compile', () => {
    it('should compile a basic wordcloud spec to a text mark with wordcloud transform', () => {
      const {spec} = compile({
        data: {values: [{word: 'hello', count: 10}]},
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          size: {field: 'count', type: 'quantitative', scale: {range: [10, 56]}},
        },
      });

      const marks = spec.marks;
      expect(marks).toHaveLength(1);
      expect(marks[0].type).toBe('text');
      expect(marks[0].transform).toBeDefined();
      expect(marks[0].transform[0].type).toBe('wordcloud');
    });

    it('should not generate a scale for size', () => {
      const {spec} = compile({
        data: {values: [{word: 'hello', count: 10}]},
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          size: {field: 'count', type: 'quantitative', scale: {range: [10, 56]}},
        },
      });

      const sizeScale = (spec.scales ?? []).find((s: any) => s.name === 'size');
      expect(sizeScale).toBeUndefined();
    });

    it('should not generate a scale for angle', () => {
      const {spec} = compile({
        data: {values: [{word: 'hello', count: 10, angle: 45}]},
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          angle: {field: 'angle', type: 'quantitative'},
        },
      });

      const angleScale = (spec.scales ?? []).find((s: any) => s.name === 'angle');
      expect(angleScale).toBeUndefined();
    });
  });
});

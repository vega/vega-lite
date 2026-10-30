import {compile} from '../../src/compile/compile.js';
import {normalize} from '../../src/normalize/index.js';
import {defaultConfig} from '../../src/config.js';

describe('wordcloud composite mark', () => {
  describe('normalizeWordcloud', () => {
    it('normalizes mark string "wordcloud" to a text mark unit spec', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
            size: {field: 'count', type: 'quantitative'},
          },
        },
        defaultConfig,
      );

      expect((output as any).mark.type).toBe('text');
    });

    it('normalizes mark object {type: "wordcloud"} to a text mark unit spec', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: {type: 'wordcloud'},
          encoding: {
            text: {field: 'word', type: 'nominal'},
          },
        },
        defaultConfig,
      );

      expect((output as any).mark.type).toBe('text');
    });

    it('prepends a wordcloud transform using the text encoding field', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
            size: {field: 'count', type: 'quantitative'},
          },
        },
        defaultConfig,
      ) as any;

      const wcTransform = output.transform?.[0];
      expect(wcTransform).toBeDefined();
      expect(wcTransform.wordcloud).toBe('word');
    });

    it('maps size encoding field to wordcloud fontSize parameter', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
            size: {field: 'count', type: 'quantitative'},
          },
        },
        defaultConfig,
      ) as any;

      const wcTransform = output.transform?.[0];
      expect(wcTransform.fontSize).toEqual({field: 'count'});
    });

    it('applies default fontSizeRange from config', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
            size: {field: 'count', type: 'quantitative'},
          },
        },
        defaultConfig,
      ) as any;

      const wcTransform = output.transform?.[0];
      expect(wcTransform.fontSizeRange).toEqual([10, 56]);
    });

    it('uses custom fontSizeRange from mark def', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: {type: 'wordcloud', fontSizeRange: [8, 80]},
          encoding: {
            text: {field: 'word', type: 'nominal'},
            size: {field: 'count', type: 'quantitative'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.transform?.[0].fontSizeRange).toEqual([8, 80]);
    });

    it('uses custom spiral from mark def', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: {type: 'wordcloud', spiral: 'rectangular'},
          encoding: {
            text: {field: 'word', type: 'nominal'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.transform?.[0].spiral).toBe('rectangular');
    });

    it('uses custom font from mark def', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: {type: 'wordcloud', font: 'Georgia'},
          encoding: {
            text: {field: 'word', type: 'nominal'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.transform?.[0].font).toBe('Georgia');
    });

    it('maps angle encoding field to wordcloud rotate parameter', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10, rotation: 45}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
            angle: {field: 'rotation', type: 'quantitative'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.transform?.[0].rotate).toEqual({field: 'rotation'});
    });

    it('maps fixed angle value to wordcloud rotate parameter', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
            angle: {value: 45},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.transform?.[0].rotate).toBe(45);
    });

    it('propagates color encoding to the output spec', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
            color: {field: 'word', type: 'nominal'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.encoding?.color).toEqual({field: 'word', type: 'nominal'});
    });

    it('encodes x and y as ExprRef values to bypass scale system', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.encoding?.x?.value?.expr).toContain('__wc_x');
      expect(output.encoding?.y?.value?.expr).toContain('__wc_y');
    });

    it('encodes size as ExprRef to use raw computed font size', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          encoding: {
            text: {field: 'word', type: 'nominal'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.encoding?.size?.value?.expr).toContain('__wc_fontSize');
    });

    it('preserves existing transforms, placing wordcloud first', () => {
      const output = normalize(
        {
          data: {values: [{word: 'hello', count: 10}]},
          mark: 'wordcloud',
          transform: [{filter: 'datum.count > 5'}],
          encoding: {
            text: {field: 'word', type: 'nominal'},
          },
        },
        defaultConfig,
      ) as any;

      expect(output.transform?.[0].wordcloud).toBeDefined();
      expect(output.transform?.[1]).toEqual({filter: 'datum.count > 5'});
    });
  });

  describe('compile wordcloud', () => {
    it('compiles to a Vega spec with a wordcloud data transform', () => {
      const result = compile({
        data: {values: [{word: 'hello', count: 10}]},
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          size: {field: 'count', type: 'quantitative'},
        },
      });

      const vgSpec = result.spec;
      const wcTransform = vgSpec.data
        ?.find((d: any) => d.transform?.some((t: any) => t.type === 'wordcloud'))
        ?.transform?.find((t: any) => t.type === 'wordcloud');

      expect(wcTransform).toBeDefined();
      expect(wcTransform.type).toBe('wordcloud');
      expect(wcTransform.text).toEqual({field: 'word'});
      expect(wcTransform.fontSize).toEqual({field: 'count'});
    });

    it('compiled Vega spec uses signal expressions for x/y (no positional scales)', () => {
      const result = compile({
        data: {values: [{word: 'hello', count: 10}]},
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
          size: {field: 'count', type: 'quantitative'},
        },
      });

      const vgSpec = result.spec;
      const mark = vgSpec.marks?.[0] as any;

      expect(mark.encode.update.x.signal).toContain('__wc_x');
      expect(mark.encode.update.y.signal).toContain('__wc_y');
      expect(mark.encode.update.fontSize.signal).toContain('__wc_fontSize');

      // No x or y positional scales should be present
      const scaleNames = vgSpec.scales?.map((s: any) => s.name) ?? [];
      expect(scaleNames).not.toContain('x');
      expect(scaleNames).not.toContain('y');
    });

    it('compiled Vega wordcloud transform uses view width/height signals by default', () => {
      const result = compile({
        width: 600,
        height: 400,
        data: {values: [{word: 'hello', count: 10}]},
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
      });

      const vgSpec = result.spec;
      const wcTransform = vgSpec.data
        ?.find((d: any) => d.transform?.some((t: any) => t.type === 'wordcloud'))
        ?.transform?.find((t: any) => t.type === 'wordcloud');

      expect(wcTransform.size).toEqual([{signal: 'width'}, {signal: 'height'}]);
    });

    it('compiled Vega spec text mark has center alignment', () => {
      const result = compile({
        data: {values: [{word: 'hello', count: 10}]},
        mark: 'wordcloud',
        encoding: {
          text: {field: 'word', type: 'nominal'},
        },
      });

      const mark = result.spec.marks?.[0] as any;
      expect(mark.encode.update.align?.value).toBe('center');
    });
  });
});

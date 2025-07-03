import type {SignalRef} from 'vega';
import {
  Config,
  defaultConfig,
  DEFAULT_COLOR,
  DEFAULT_FONT_SIZE,
  initConfig,
  isVgScheme,
  stripAndRedirectConfig,
} from '../src/config.js';
import {PRIMITIVE_MARKS} from '../src/mark.js';
import {duplicate} from '../src/util.js';

describe('config', () => {
  describe('initConfig', () => {
    it('converts `expr`s in config to `signal`s', () => {
      expect(
        initConfig({
          background: {expr: "'yellow'"},
          padding: {expr: '5'},
          mark: {color: {expr: "'red'"}},
          point: {color: {expr: "'green'"}},
          scale: {
            bandPaddingInner: {expr: '0.1'},
          },
          style: {
            foo: {color: {expr: "'blue'"}},
          },
          title: {color: {expr: "'violet'"}},
        }),
      ).toMatchObject({
        background: {signal: "'yellow'"},
        padding: {signal: '5'},
        mark: {color: {signal: "'red'"}},
        point: {color: {signal: "'green'"}},
        scale: {
          bandPaddingInner: {signal: '0.1'},
        },
        style: {
          foo: {color: {signal: "'blue'"}},
        },
        title: {color: {signal: "'violet'"}},
      });
    });

    it('produces correct default color, font, and fontSize config', () => {
      expect(initConfig({color: true, fontSize: true, font: 'abc'})).toEqual({
        ...defaultConfig,
        signals: [
          {
            name: 'fontSize',
            value: DEFAULT_FONT_SIZE,
          },
          {
            name: 'color',
            value: DEFAULT_COLOR,
          },
        ],
        mark: {...defaultConfig.mark, color: {signal: 'color.blue'}},
        rule: {color: {signal: 'color.gray0'}},
        text: {
          color: {signal: 'color.gray0'},
          font: 'abc',
          fontSize: {signal: 'fontSize.text'},
        },
        style: {
          'guide-label': {
            fill: {signal: 'color.gray0'},
            font: 'abc',
            fontSize: {signal: 'fontSize.guideLabel'},
          },
          'guide-title': {
            fill: {signal: 'color.gray0'},
            font: 'abc',
            fontSize: {signal: 'fontSize.guideTitle'},
          },
          'group-title': {
            fill: {signal: 'color.gray0'},
            font: 'abc',
            fontSize: {signal: 'fontSize.groupTitle'},
          },
          'group-subtitle': {
            fill: {signal: 'color.gray0'},
            font: 'abc',
            fontSize: {signal: 'fontSize.groupSubtitle'},
          },
          cell: {
            stroke: {signal: 'color.gray8'},
          },
        },
        axis: {
          domainColor: {signal: 'color.gray13'},
          gridColor: {signal: 'color.gray8'},
          tickColor: {signal: 'color.gray13'},
        },
        range: {
          category: [
            {signal: 'color.blue'},
            {signal: 'color.orange'},
            {signal: 'color.red'},
            {signal: 'color.teal'},
            {signal: 'color.green'},
            {signal: 'color.yellow'},
            {signal: 'color.purple'},
            {signal: 'color.pink'},
            {signal: 'color.brown'},
            {signal: 'color.grey8'},
          ],
        },
      });
    });

    it('correctly merge color signals for color and fontSize config', () => {
      expect(initConfig({color: {newColor: 'red'}, fontSize: {newFontSize: 123}}).signals).toEqual([
        {
          name: 'fontSize',
          value: {...DEFAULT_FONT_SIZE, newFontSize: 123},
        },
        {
          name: 'color',
          value: {...DEFAULT_COLOR, newColor: 'red'},
        },
      ]);
    });

    it('correctly merges object-valued configs', () => {
      const cfg = initConfig({selection: {point: {on: 'pointerover'}, interval: {encodings: ['x']}}});
      expect(cfg.selection).toHaveProperty('point');
      expect(cfg.selection).toHaveProperty('interval');

      // Overrides correctly
      expect(cfg.selection.point).toHaveProperty('on', 'pointerover');
      expect(cfg.selection.interval).toHaveProperty('encodings', ['x']);

      // Preserves defaults
      expect(cfg.selection.point).toHaveProperty('toggle', 'event.shiftKey');
      expect(cfg.selection.interval).toHaveProperty('zoom', 'wheel!');
    });
  });

  describe('stripAndRedirectConfig', () => {
    const config: Config<SignalRef> = {
      ...defaultConfig,
      mark: {
        ...defaultConfig.mark,
        opacity: 0.3,
        tooltip: {content: 'encoding'},
      },
      bar: {
        opacity: 0.5,
        ...defaultConfig.bar,
      },
      axis: {
        gridDash: {
          condition: {test: {field: 'value', timeUnit: 'month', equal: 1}, value: null},
          value: [2, 2],
        },
      },
      view: {
        fill: '#eee',
      },
      title: {
        color: 'red',
        fontWeight: 'bold',
        align: 'center',
        baseline: 'middle',
        dx: 5,
        dy: 5,
        angle: 1,
        limit: 5,
      },
      boxplot: {
        rule: {
          fill: 'red',
        },
        median: {
          color: 'white',
        },
      },
    };
    const copy = duplicate(config);
    const output = stripAndRedirectConfig(config);

    it('should not cause side-effect to the input', () => {
      expect(config).toEqual(copy);
    });

    it('should remove VL only mark config but keep Vega mark config', () => {
      expect(output.mark.color).toBeUndefined();
      expect(output.mark.opacity).toBe(0.3);
    });

    it('should remove VL tooltip object', () => {
      expect(output.mark.tooltip).toBeUndefined();
    });

    it('should remove conditional axis config', () => {
      expect(output.axis).toBeUndefined();
    });

    it('should redirect mark config to style and remove VL only mark-specific config', () => {
      for (const mark of PRIMITIVE_MARKS) {
        expect(output[mark]).toBeUndefined();
      }
      expect(output.style.bar['binSpacing']).toBeUndefined();
      expect((output.style.cell as any).width).toBeUndefined();
      expect((output.style.cell as any).height).toBeUndefined();
      expect((output.style.cell as any).fill).toBe('#eee');

      expect(output.style.bar.opacity).toBe(0.5);
    });

    it('should redirect config.title to config.style.group-title and rename color to fill', () => {
      expect(output).not.toHaveProperty('title');
      expect(output.style['group-title'].fontWeight).toBe('bold');
      expect(output.style['group-title'].fill).toBe('red');
    });

    it('redirects align, baseline, dx, dy, and limit of config.title to config.style.group-subtitle', () => {
      expect(output.style['group-subtitle']).toEqual({align: 'center', baseline: 'middle', dx: 5, dy: 5, limit: 5});
    });

    it('should remove empty config object', () => {
      expect(output.axisTop).toBeUndefined();
    });

    it('should keep subtitle config in config.title if specified', () => {
      const cfg = initConfig({
        title: {subtitleColor: 'red'},
      });
      expect(stripAndRedirectConfig(cfg).title).toEqual({subtitleColor: 'red'});
    });

    it('converts params config into signals', () => {
      const cfg = initConfig({
        signals: [
          {
            name: 'x',
            update: 'foo',
          },
        ],
        params: [
          {
            name: 'a',
            expr: 'bar',
          },
          {
            name: 'b',
            bind: {input: 'range', min: -6.28, max: 6.28},
          },
        ],
      });

      expect(stripAndRedirectConfig(cfg).signals).toEqual([
        {
          name: 'x',
          update: 'foo',
        },
        {
          name: 'a',
          update: 'bar',
        },
        {
          name: 'b',
          bind: {input: 'range', min: -6.28, max: 6.28},
        },
      ]);
    });
  });

  describe('isVgScheme', () => {
    it('should return true for valid scheme object', () => {
      expect(isVgScheme({scheme: 'viridis', count: 2})).toBe(true);
    });

    it('should return false for non-scheme object', () => {
      expect(isVgScheme(['#EA98D2', '#659CCA'])).toBe(false);
    });
  });
});

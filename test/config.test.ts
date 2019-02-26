import {Config, defaultConfig, isVgScheme, stripAndRedirectConfig} from '../src/config';
import {PRIMITIVE_MARKS} from '../src/mark';
import {duplicate} from '../src/util';

describe('config', () => {
  describe('stripAndRedirectConfig', () => {
    const config: Config = {
      ...defaultConfig,
      mark: {
        ...defaultConfig.mark,
        opacity: 0.3
      },
      bar: {
        opacity: 0.5,
        ...defaultConfig.bar
      },
      view: {
        fill: '#eee'
      },
      title: {
        color: 'red',
        fontWeight: 'bold'
      },
      boxplot: {
        rule: {
          fill: 'red'
        },
        median: {
          color: 'white'
        }
      }
    };
    const copy = duplicate(config);
    const output = stripAndRedirectConfig(config);

    it('should not cause side-effect to the input', () => {
      expect(config).toEqual(copy);
    });

    it('should remove VL only mark config but keep Vega mark config', () => {
      expect(output.mark.color).not.toBeDefined();
      expect(output.mark.opacity).toEqual(0.3);
    });

    it('should redirect mark config to style and remove VL only mark-specific config', () => {
      for (const mark of PRIMITIVE_MARKS) {
        expect(output[mark]).not.toBeDefined();
      }
      expect(output.style.bar['binSpacing']).not.toBeDefined();
      expect(output.style.cell['width']).not.toBeDefined();
      expect(output.style.cell['height']).not.toBeDefined();
      expect(output.style.cell['fill']).toEqual('#eee');

      expect(output.style.bar.opacity).toEqual(0.5);
    });

    it('should redirect config.title to config.style.group-title and rename color to fill', () => {
      expect(output).not.toHaveProperty('title');
      expect(output.style['group-title'].fontWeight).toEqual('bold');
      expect(output.style['group-title'].fill).toEqual('red');
    });

    it('should remove empty config object', () => {
      expect(output.axisTop).not.toBeDefined();
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

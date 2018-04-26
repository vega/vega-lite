
import {assert} from 'chai';
import {Config, defaultConfig, stripAndRedirectConfig} from '../src/config';
import {PRIMITIVE_MARKS} from '../src/mark';
import {duplicate} from '../src/util';

describe('config', () => {
  describe('stripAndRedirectConfig', () => {
    const config: Config = {
      ...defaultConfig,
      mark: {
        ...defaultConfig.mark,
        opacity: 0.3,
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
        whisker: {
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
      assert.deepEqual(config, copy);
    });

    it('should remove VL only mark config but keep Vega mark config', () => {
      assert.isUndefined(output.mark.color);
      assert.equal(output.mark.opacity, 0.3);
    });

    it('should redirect mark config to style and remove VL only mark-specific config', () => {
      for (const mark of PRIMITIVE_MARKS) {
        assert.isUndefined(output[mark], `${mark} config should be redirected`);
      }
      assert.isUndefined(output.style.bar['binSpacing'], `VL only Bar config should be removed`);
      assert.isUndefined(output.style.cell['width'], `VL only cell config should be removed`);
      assert.isUndefined(output.style.cell['height'], `VL only cell config should be removed`);
      assert.equal(output.style.cell['fill'], '#eee', `config.view should be redirect to config.style.cell`);

      assert.deepEqual(output.style.bar.opacity, 0.5, 'Bar config should be redirected to config.style.bar');
    });

    it('should redirect config.title to config.style.group-title and rename color to fill', () => {
      assert.deepEqual(output.title, undefined);
      assert.deepEqual(output.style['group-title'].fontWeight, 'bold');
      assert.deepEqual(output.style['group-title'].fill, 'red');
    });

    it('should remove empty config object', () => {
      assert.isUndefined(output.axisTop);
    });
  });
});

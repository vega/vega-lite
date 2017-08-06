
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

      assert.deepEqual(output.style.bar.opacity, 0.5, 'Bar config should be redirected to config.style.bar');
    });

    it('should remove empty config object', () => {
      assert.isUndefined(output.title);
    });
  });
});

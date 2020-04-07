import {text} from '../../../../src/compile/mark/encode';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

describe('compile/mark/encode/text', () => {
  it('text support signals', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'text',
      encoding: {
        text: {
          signal: '"Hello Vega"'
        }
      },
      data: {url: 'data/population.json'}
    });

    const textMixins = text(model);
    expect(textMixins.text).toEqual({signal: '"Hello Vega"'});
  });
});

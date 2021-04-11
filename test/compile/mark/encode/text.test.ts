import {text} from '../../../../src/compile/mark/encode';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

describe('compile/mark/encode/text', () => {
  it('text support signals', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'text',
      encoding: {
        text: {
          value: {signal: 'Hello'}
        }
      },
      data: {url: 'data/population.json'}
    });

    const textMixins = text(model);
    expect(textMixins.text).toEqual({signal: 'Hello'});
  });

  it('text supports datum with format', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'text',
      encoding: {
        text: {
          datum: 0.12342342134324,
          type: 'quantitative',
          format: '.2f'
        }
      },
      data: {url: 'data/population.json'}
    });

    const textMixins = text(model);
    expect(textMixins.text).toEqual({signal: 'format(0.12342342134324, ".2f")'});
  });
});

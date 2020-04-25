import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';
import {aria} from '../../../../src/compile/mark/encode';

describe('compile/mark/encoding/aria', () => {
  it('aria should be added to bar mark', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal'
        },
        y: {
          field: 'value',
          type: 'quantitative'
        }
      },
      data: {values: []}
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      description: {
        signal:
          '"category" + ": " + (isValid(datum["category"]) ? datum["category"] : ""+datum["category"]) + "; " + "value" + ": " + (format(datum["value"], ""))'
      },
      ariaRoleDescription: {
        value: 'bar'
      }
    });
  });

  it('aria set to false should hide everything', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'bar',
        aria: false
      },
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal'
        },
        y: {
          field: 'value',
          type: 'quantitative'
        }
      },
      data: {values: []}
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      aria: {
        value: false
      }
    });
  });
});

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
      ariaLabel: {
        signal:
          '"category" + " is " + (isValid(datum["category"]) ? datum["category"] : ""+datum["category"]) + ", " + "value" + " is " + (format(datum["value"], ""))'
      },
      ariaRole: {
        value: 'graphics-symbol'
      },
      ariaRoleDescription: {
        value: 'bar'
      }
    });
  });

  it('ariaHidden should hide everything', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'bar',
        ariaHidden: true
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
      ariaHidden: {
        value: true
      }
    });
  });
});

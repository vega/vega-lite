import {aria} from '../../../../src/compile/mark/encode';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util';

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
          '"category: " + (isValid(datum["category"]) ? datum["category"] : ""+datum["category"]) + "; value: " + (format(datum["value"], ""))'
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
        aria: false,
        description: 'this will not show'
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

    expect(ariaMixins).toEqual({}); // we set aria: false in getMarkGroups
  });

  it('should not generate default description when aria is to false in config', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal'
        }
      },
      data: {values: []},
      config: {
        aria: false
      }
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({});
  });

  it('should support setting a description even if aria is set to false in config', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'bar',
        description: 'An awesome mark'
      },
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal'
        }
      },
      data: {values: []},
      config: {
        aria: false
      }
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      description: {
        value: 'An awesome mark'
      }
    });
  });

  it('should support custom ariaRoleDescription', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'bar',
        ariaRoleDescription: 'mark'
      },
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal'
        }
      },
      data: {values: []}
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      ariaRoleDescription: {
        value: 'mark'
      },
      description: {
        signal: '"category: " + (isValid(datum["category"]) ? datum["category"] : ""+datum["category"])'
      }
    });
  });
});

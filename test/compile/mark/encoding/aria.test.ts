import {aria} from '../../../../src/compile/mark/encode/index.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../../util.js';

describe('compile/mark/encoding/aria', () => {
  it('aria should be added to bar mark', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal',
        },
        y: {
          field: 'value',
          type: 'quantitative',
        },
      },
      data: {values: []},
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      description: {
        signal:
          '"category: " + (isValid(datum["category"]) ? isArray(datum["category"]) ? join(datum["category"], \' \') : datum["category"] : ""+datum["category"]) + "; value: " + (format(datum["value"], ""))',
      },
      ariaRoleDescription: {
        value: 'bar',
      },
    });
  });

  it('aria set to false should hide everything', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'bar',
        aria: false,
        description: 'this will not show',
      },
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal',
        },
        y: {
          field: 'value',
          type: 'quantitative',
        },
      },
      data: {values: []},
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
          type: 'ordinal',
        },
      },
      data: {values: []},
      config: {
        aria: false,
      },
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({});
  });

  it('should support setting a description even if aria is set to false in config', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'bar',
        description: 'An awesome mark',
      },
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal',
        },
      },
      data: {values: []},
      config: {
        aria: false,
      },
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      description: {
        value: 'An awesome mark',
      },
    });
  });

  it('should support description encoding', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        description: {
          value: 'An encoded description',
        },
      },
      data: {values: []},
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      ariaRoleDescription: {
        value: 'bar',
      },
      description: {
        value: 'An encoded description',
      },
    });
  });

  it('should support custom ariaRoleDescription', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'bar',
        ariaRoleDescription: 'mark',
      },
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal',
        },
      },
      data: {values: []},
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      ariaRoleDescription: {
        value: 'mark',
      },
      description: {
        signal:
          '"category: " + (isValid(datum["category"]) ? isArray(datum["category"]) ? join(datum["category"], \' \') : datum["category"] : ""+datum["category"])',
      },
    });
  });

  it('omits internal/private fields from the generated description', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        x: {
          field: 'category',
          type: 'ordinal',
        },
        detail: {
          field: '__internal_key',
          type: 'nominal',
        },
      },
      data: {values: []},
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      description: {
        signal:
          '"category: " + (isValid(datum["category"]) ? isArray(datum["category"]) ? join(datum["category"], \' \') : datum["category"] : ""+datum["category"])',
      },
      ariaRoleDescription: {
        value: 'bar',
      },
    });
  });

  it('omits a filtered tooltip field from the generated description when its predicate fails', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'bar',
      encoding: {
        tooltip: [
          {
            field: 'Date',
            type: 'nominal',
          },
          {
            field: 'type2',
            type: 'quantitative',
            filter: {valid: true},
          },
        ],
      },
      data: {values: []},
    });

    const ariaMixins = aria(model);

    expect(ariaMixins).toEqual({
      description: {
        signal:
          '"Date: " + (isValid(datum["Date"]) ? isArray(datum["Date"]) ? join(datum["Date"], \' \') : datum["Date"] : ""+datum["Date"]) + ((isValid(datum["type2"]) && isFinite(+datum["type2"])) ? ("; " + "type2: " + (format(datum["type2"], ""))) : "")',
      },
      ariaRoleDescription: {
        value: 'bar',
      },
    });
  });
});

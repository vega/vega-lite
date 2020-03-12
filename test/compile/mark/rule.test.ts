import {COLOR, X, Y} from '../../../src/channel';
import {rule} from '../../../src/compile/mark/rule';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Rule', () => {
  describe('without encoding', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {}
    });

    const props = rule.encodeEntry(model);

    it('should not show anything', () => {
      expect(props.x).toBeUndefined();
      expect(props.y).toBeUndefined();
    });
  });

  describe('with x-only', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {x: {field: 'a', type: 'quantitative'}}
    });

    const props = rule.encodeEntry(model);

    it('should create vertical rule that fits height', () => {
      expect(props.x).toEqual({scale: X, field: 'a'});
      expect(props.y).toEqual({value: 0});
      expect(props.y2).toEqual({field: {group: 'height'}});
    });
  });

  describe('with y-only', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {y: {field: 'a', type: 'quantitative'}}
    });

    const props = rule.encodeEntry(model);

    it('should create horizontal rule that fits height', () => {
      expect(props.y).toEqual({scale: Y, field: 'a'});
      expect(props.x).toEqual({field: {group: 'width'}});
      expect(props.x2).toEqual({value: 0});
    });
  });

  describe('with y-only and log scale', () => {
    () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'rule',
        encoding: {y: {field: 'a', type: 'quantitative', scale: {type: 'log'}}}
      });

      const props = rule.encodeEntry(model);

      it('should create horizontal rule that fits height', () => {
        expect(props.y).toEqual({scale: Y, field: 'a'});
        expect(props.x).toEqual({value: 0});
        expect(props.x2).toEqual({field: {group: 'width'}});
      });
    };
  });

  describe('with x and x2 only', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        x2: {field: 'a2'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create horizontal rule on the axis', () => {
      expect(props.x).toEqual({scale: X, field: 'a'});
      expect(props.x2).toEqual({scale: X, field: 'a2'});
      expect(props.y).toEqual({
        mult: 0.5,
        signal: 'height'
      });
    });
  });

  describe('with y and y2 only', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        y: {field: 'a', type: 'quantitative'},
        y2: {field: 'a2'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create horizontal rules on the axis', () => {
      expect(props.y).toEqual({scale: Y, field: 'a'});
      expect(props.y2).toEqual({scale: Y, field: 'a2'});
      expect(props.x).toEqual({
        mult: 0.5,
        signal: 'width'
      });
    });
  });

  describe('with x, x2, and y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        x2: {field: 'a2'},
        y: {field: 'b', type: 'quantitative'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create horizontal rules', () => {
      expect(props.x).toEqual({scale: X, field: 'a'});
      expect(props.x2).toEqual({scale: X, field: 'a2'});
      expect(props.y).toEqual({scale: Y, field: 'b'});
    });
  });

  describe('with x, x2, y, and y2', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        x2: {field: 'a2'},
        y: {field: 'b', type: 'quantitative'},
        y2: {field: 'b2'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create oblique rules', () => {
      expect(props.x).toEqual({scale: X, field: 'a'});
      expect(props.x2).toEqual({scale: X, field: 'a2'});
      expect(props.y).toEqual({scale: Y, field: 'b'});
      expect(props.y2).toEqual({scale: Y, field: 'b2'});
    });
  });

  describe('with x and y', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'quantitative'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create oblique rules', () => {
      expect(props.x).toEqual({scale: X, field: 'a'});
      expect(props.y).toEqual({scale: Y, field: 'b'});
    });
  });

  describe('with y, y2, and x', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        y: {field: 'a', type: 'quantitative'},
        y2: {field: 'a2'},
        x: {field: 'b', type: 'quantitative'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create vertical rules', () => {
      expect(props.y).toEqual({scale: Y, field: 'a'});
      expect(props.y2).toEqual({scale: Y, field: 'a2'});
      expect(props.x).toEqual({scale: X, field: 'b'});
    });
  });

  describe('with nominal x, quantitative y with no y2', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        x: {field: 'a', type: 'ordinal'},
        y: {field: 'b', type: 'quantitative'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create vertical rule that emulates bar chart', () => {
      expect(model.markDef.orient).toBe('vertical');

      expect(props.x).toEqual({scale: X, field: 'a', band: 0.5});
      expect(props.y).toEqual({scale: Y, field: 'b'});
      expect(props.y2).toEqual({scale: Y, value: 0});
    });
  });

  describe('with nominal y, quantitative x with no y2', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        y: {field: 'a', type: 'ordinal'},
        x: {field: 'b', type: 'quantitative'}
      }
    });

    const props = rule.encodeEntry(model);

    it('should create horizontal rule that emulates bar chart', () => {
      expect(model.markDef.orient).toBe('horizontal');

      expect(props.x).toEqual({scale: X, field: 'b'});
      expect(props.x2).toEqual({scale: X, value: 0});
      expect(props.y).toEqual({scale: Y, field: 'a', band: 0.5});
    });
  });

  describe('horizontal stacked rule with color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        y: {field: 'a', type: 'ordinal'},
        x: {aggregate: 'sum', field: 'b', type: 'quantitative', stack: 'zero'},
        color: {field: 'Origin', type: 'nominal'}
      },
      config: {
        mark: {invalid: null}
      }
    });

    const props = rule.encodeEntry(model);

    it('should have the correct value for x, x2, and color', () => {
      expect(props.x).toEqual({scale: 'x', field: 'sum_b_end'});
      expect(props.x2).toEqual({scale: 'x', field: 'sum_b_start'});
      expect(props.stroke).toEqual({scale: COLOR, field: 'Origin'});
    });
  });

  describe('vertical stacked rule with color', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'rule',
      encoding: {
        x: {field: 'a', type: 'ordinal'},
        y: {aggregate: 'sum', field: 'b', type: 'quantitative', stack: 'zero'},
        color: {field: 'Origin', type: 'nominal'}
      },
      config: {
        mark: {invalid: null}
      }
    });

    const props = rule.encodeEntry(model);

    it('should have the correct value for y, y2, and color', () => {
      expect(props.y).toEqual({scale: 'y', field: 'sum_b_end'});
      expect(props.y2).toEqual({scale: 'y', field: 'sum_b_start'});
      expect(props.stroke).toEqual({scale: COLOR, field: 'Origin'});
    });
  });
});

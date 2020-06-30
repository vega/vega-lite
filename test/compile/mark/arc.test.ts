import {arc} from '../../../src/compile/mark/arc';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('Mark: Arc', () => {
  describe('with theta in mark def', () => {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {
        type: 'arc',
        theta: 1.57,
        theta2: 3.14
      }
    });

    const props = arc.encodeEntry(model);

    it('applies theta to startAngle and endAngle and not theta', () => {
      expect(props.startAngle).toEqual({value: 1.57});
      expect(props.endAngle).toEqual({value: 3.14});
      expect(props.theta).toBeUndefined();
    });
  });

  describe('for pie', () => {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'arc',
      encoding: {
        theta: {field: 'field', type: 'quantitative'},
        color: {field: 'id', type: 'nominal'}
      }
    });

    const props = arc.encodeEntry(model);

    it('applies theta to startAngle and endAngle', () => {
      expect(props.startAngle).toEqual({scale: 'theta', field: 'field_end'});
      expect(props.endAngle).toEqual({scale: 'theta', field: 'field_start'});
    });
  });

  describe('for pie with thetaOffset', () => {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marks.
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: {type: 'arc', thetaOffset: 5},
      encoding: {
        theta: {field: 'field', type: 'quantitative'},
        color: {field: 'id', type: 'nominal'}
      }
    });

    const props = arc.encodeEntry(model);

    it('applies thetaOffset to both startAngle and endAngle', () => {
      expect(props.startAngle).toEqual({scale: 'theta', field: 'field_end', offset: 5});
      expect(props.endAngle).toEqual({scale: 'theta', field: 'field_start', offset: 5});
    });
  });

  describe('for radial histogram', () => {
    // This is a simplified example for stacked text.
    // In reality this will be used as stacked's overlayed marker
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'arc',
      encoding: {
        theta: {bin: true, field: 'field', type: 'quantitative'},
        radius: {aggregate: 'count', type: 'quantitative'}
      },
      config: {mark: {invalid: null}} // don't apply invalid check to simplify the test
    });

    const props = arc.encodeEntry(model);

    it('applies binned to startAngle and endAngle', () => {
      expect(props.endAngle).toEqual({scale: 'theta', field: 'bin_maxbins_10_field'});
      expect(props.startAngle).toEqual({scale: 'theta', field: 'bin_maxbins_10_field_end'});
    });
  });
});

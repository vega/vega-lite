import {range} from 'd3';
import {AxisOrient, Orient, SignalRef} from 'vega';
import {codegen, parse} from 'vega-expression';
import {stringValue} from 'vega-util';
import {getAxisConfigs} from '../../../src/compile/axis/config';
import * as properties from '../../../src/compile/axis/properties';
import {defaultLabelAlign, defaultLabelBaseline, getLabelAngle} from '../../../src/compile/axis/properties';
import {TimeUnit} from '../../../src/timeunit';
import {normalizeAngle} from '../../../src/util';
import {isSignalRef} from '../../../src/vega.schema';

describe('compile/axis/properties', () => {
  function evalValueOrSignal(valueOrSignalRef: string | SignalRef, o: Orient) {
    if (isSignalRef(valueOrSignalRef)) {
      const ast = parse(valueOrSignalRef.signal);
      const {code} = codegen({
        globalvar: ((v: string) => (v === 'o' ? stringValue(o) : undefined)) as any
      })(ast);
      return eval(code);
    } else {
      return valueOrSignalRef;
    }
  }

  describe('defaultGrid()', () => {
    it('should return true by default for continuous scale that is not binned', () => {
      const grid = properties.defaultGrid('linear', {field: 'a', type: 'quantitative'});
      expect(grid).toBe(true);
    });

    it('should return false by default for binned field', () => {
      const grid = properties.defaultGrid('linear', {bin: true, field: 'a', type: 'quantitative'});
      expect(grid).toBe(false);
    });

    it('should return false by default for a discrete scale', () => {
      const grid = properties.defaultGrid('point', {field: 'a', type: 'quantitative'});
      expect(grid).toBe(false);
    });
  });

  describe('orient()', () => {
    it('should return bottom for x by default', () => {
      const orient = properties.defaultOrient('x');
      expect(orient).toBe('bottom');
    });

    it('should return left for y by default', () => {
      const orient = properties.defaultOrient('y');
      expect(orient).toBe('left');
    });
  });

  describe('defaultTickCount()', () => {
    it('should return size/10 by default for a binned field', () => {
      const tickCount = properties.defaultTickCount({
        fieldOrDatumDef: {bin: {maxbins: 10}, field: 'a', type: 'quantitative'},
        scaleType: 'linear',
        size: {signal: 'a'}
      });
      expect(tickCount).toEqual({signal: 'ceil(a/10)'});
    });

    it('should return undefined if values is specified', () => {
      const tickCount = properties.defaultTickCount({
        fieldOrDatumDef: {bin: {maxbins: 10}, field: 'a', type: 'quantitative'},
        scaleType: 'linear',
        size: {signal: 'a'},
        values: [1, 2, 3]
      });
      expect(tickCount).toBeUndefined();
    });

    for (const timeUnit of ['month', 'hours', 'day', 'quarter'] as TimeUnit[]) {
      it(`should return undefined by default for a temporal field with timeUnit=${timeUnit}`, () => {
        const tickCount = properties.defaultTickCount({
          fieldOrDatumDef: {timeUnit, field: 'a', type: 'temporal'},
          scaleType: 'linear',
          size: {signal: 'a'}
        });
        expect(tickCount).not.toBeDefined();
      });
    }

    it('should return size/40 by default for linear scale', () => {
      const tickCount = properties.defaultTickCount({
        fieldOrDatumDef: {field: 'a', type: 'quantitative'},
        scaleType: 'linear',
        size: {signal: 'a'}
      });
      expect(tickCount).toEqual({signal: 'ceil(a/40)'});
    });

    it('should return undefined by default for log scale', () => {
      const tickCount = properties.defaultTickCount({
        fieldOrDatumDef: {field: 'a', type: 'quantitative'},
        scaleType: 'log'
      });
      expect(tickCount).toBeUndefined();
    });

    it('should return undefined by default for point scale', () => {
      const tickCount = properties.defaultTickCount({
        fieldOrDatumDef: {field: 'a', type: 'quantitative'},
        scaleType: 'point'
      });
      expect(tickCount).toBeUndefined();
    });
  });

  describe('values', () => {
    it('should return correct timestamp values for DateTimes', () => {
      const values = properties.values({values: [{year: 1970}, {year: 1980}]}, {field: 'a', type: 'temporal'});

      expect(values).toEqual([
        {signal: 'datetime(1970, 0, 1, 0, 0, 0, 0)'},
        {signal: 'datetime(1980, 0, 1, 0, 0, 0, 0)'}
      ]);
    });

    it('should simply return values for non-DateTime', () => {
      const values = properties.values({values: [1, 2, 3, 4]}, {field: 'a', type: 'quantitative'});
      expect(values).toEqual([1, 2, 3, 4]);
    });

    it('returns signal correctly for non-DateTime', () => {
      const values = properties.values({values: {signal: 'a'}}, {field: 'a', type: 'quantitative'});
      expect(values).toEqual({signal: 'a'});
    });

    it('should simply drop values when domain is specified', () => {
      const values = properties.values(
        {},
        {
          type: 'quantitative',
          field: 'US_Gross',
          bin: {extent: [0, 1]}
        }
      );

      expect(values).toBeUndefined();
    });
  });

  describe('labelAngle', () => {
    const axis = {labelAngle: 600};
    const configWithLabelAngle = {axis: {labelAngle: 500}};
    it('should return the correct labelAngle from the axis definition', () => {
      expect(240).toEqual(getLabelAngle({type: 'quantitative', field: 'US_Gross', axis}, axis, 'y', {}));
    });

    it('should return the correct labelAngle from the axis config definition', () => {
      const axisConfigs = getAxisConfigs('y', 'linear', 'left', configWithLabelAngle);
      expect(140).toEqual(
        getLabelAngle({type: 'quantitative', field: 'US_Gross'}, {}, 'y', configWithLabelAngle, axisConfigs)
      );
    });

    it('should return the correct default labelAngle when not specified', () => {
      expect(270).toEqual(getLabelAngle({field: 'a', type: 'ordinal'}, {}, 'x', {}));
    });

    it('should return the labelAngle declared in the axis when both the axis and axis config have labelAngle', () => {
      expect(240).toEqual(
        getLabelAngle({type: 'quantitative', field: 'US_Gross', axis}, axis, 'y', configWithLabelAngle)
      );
    });

    it('should return undefined when there is no default and no specified labelAngle', () => {
      expect(undefined).toEqual(getLabelAngle({type: 'quantitative', field: 'US_Gross'}, {}, 'y', {}));
    });
  });

  describe('defaultLabelAlign', () => {
    it('correctly aligns the x-labels for all degrees', () => {
      expect(defaultLabelAlign(0, 'top', 'x')).toBeNull();
      expect(defaultLabelAlign(15, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(30, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(45, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(60, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(75, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(90, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(105, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(120, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(135, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(150, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(165, 'top', 'x')).toBe('right');
      expect(defaultLabelAlign(180, 'top', 'x')).toBeNull();
      expect(defaultLabelAlign(195, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(210, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(225, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(240, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(255, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(270, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(285, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(300, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(315, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(330, 'bottom', 'x')).toBe('right');
      expect(defaultLabelAlign(345, 'bottom', 'x')).toBe('right');
    });

    it('correctly aligns the y-labels for all degrees', () => {
      expect(defaultLabelAlign(0, 'left', 'y')).toBe('right');
      expect(defaultLabelAlign(15, 'left', 'y')).toBe('right');
      expect(defaultLabelAlign(30, 'left', 'y')).toBe('right');
      expect(defaultLabelAlign(45, 'left', 'y')).toBe('right');
      expect(defaultLabelAlign(60, 'left', 'y')).toBe('right');
      expect(defaultLabelAlign(75, 'left', 'y')).toBe('right');
      expect(defaultLabelAlign(90, 'left', 'y')).toBe('center');
      expect(defaultLabelAlign(105, 'left', 'y')).toBe('left');
      expect(defaultLabelAlign(120, 'left', 'y')).toBe('left');
      expect(defaultLabelAlign(135, 'left', 'y')).toBe('left');
      expect(defaultLabelAlign(150, 'left', 'y')).toBe('left');
      expect(defaultLabelAlign(165, 'left', 'y')).toBe('left');
      expect(defaultLabelAlign(180, 'left', 'y')).toBe('left');
      expect(defaultLabelAlign(195, 'right', 'y')).toBe('right');
      expect(defaultLabelAlign(210, 'right', 'y')).toBe('right');
      expect(defaultLabelAlign(225, 'right', 'y')).toBe('right');
      expect(defaultLabelAlign(240, 'right', 'y')).toBe('right');
      expect(defaultLabelAlign(255, 'right', 'y')).toBe('right');
      expect(defaultLabelAlign(270, 'right', 'y')).toBe('center');
      expect(defaultLabelAlign(285, 'right', 'y')).toBe('left');
      expect(defaultLabelAlign(300, 'right', 'y')).toBe('left');
      expect(defaultLabelAlign(315, 'right', 'y')).toBe('left');
      expect(defaultLabelAlign(330, 'right', 'y')).toBe('left');
      expect(defaultLabelAlign(345, 'right', 'y')).toBe('left');
    });

    it('should return undefined if angle is undefined', () => {
      expect(defaultLabelAlign(undefined, 'left', 'y')).toBeUndefined();
    });

    it('correctly align y-axis labels for labelAngle and orient signals', () => {
      const ast = parse(defaultLabelAlign({signal: 'a'}, {signal: 'o'}, 'y')['signal']);
      let a: number;
      let o: AxisOrient;
      // test all angles
      for (a of range(-360, 375, 15)) {
        for (o of ['left', 'right'] as AxisOrient[]) {
          const {code} = codegen({
            globalvar: ((v: string) => (v === 'a' ? a : v === 'o' ? stringValue(o) : undefined)) as any
          })(ast);

          const result = eval(code);
          const expected = defaultLabelAlign(normalizeAngle(a), o, 'y');
          expect(result).toEqual(expected);
        }
      }
    });

    it('correctly align x-axis labels for labelAngle and orient signals', () => {
      return new Promise<void>(done => {
        const ast = parse(defaultLabelAlign({signal: 'a'}, {signal: 'o'}, 'x')['signal']);
        let a: number;
        let o: AxisOrient;
        // test all angles
        for (a of range(-360, 375, 15)) {
          for (o of ['top', 'bottom'] as AxisOrient[]) {
            const {code} = codegen({
              globalvar: ((v: string) => (v === 'a' ? a : v === 'o' ? stringValue(o) : undefined)) as any
            })(ast);

            const result = eval(code);
            const expected = defaultLabelAlign(normalizeAngle(a), o, 'x');
            expect(result).toEqual(expected);
          }
        }
        done();
      });
    });

    it('correctly align y-axis labels for orient signal', () => {
      return new Promise<void>(done => {
        let a: number;
        let o: AxisOrient;
        // test all angles
        for (a of range(-360, 375, 15)) {
          a = normalizeAngle(a);
          const align = defaultLabelAlign(a, {signal: 'o'}, 'y');
          for (o of ['left', 'right'] as AxisOrient[]) {
            const result = evalValueOrSignal(align, o);
            const expected = defaultLabelAlign(a, o, 'y');
            expect(result).toEqual(expected);
          }
        }
        done();
      });
    });

    it('correctly align x-axis labels for orient signal', () => {
      return new Promise<void>(done => {
        let a: number;
        let o: AxisOrient;
        // test all angles
        for (a of range(-360, 375, 15)) {
          a = normalizeAngle(a);
          const align = defaultLabelAlign(a, {signal: 'o'}, 'x');
          for (o of ['top', 'bottom'] as AxisOrient[]) {
            const result = evalValueOrSignal(align, o);
            const expected = defaultLabelAlign(a, o, 'x');
            expect(result).toEqual(expected);
          }
        }
        done();
      });
    });
  });

  describe('defaultLabelBaseline', () => {
    it('is middle for perpendiculars horizontal orients', () => {
      expect(defaultLabelBaseline(90, 'top', 'x')).toBe('middle');
      expect(defaultLabelBaseline(270, 'bottom', 'x')).toBe('middle');
    });

    it('is top for bottom orients for 1st and 4th quadrants', () => {
      expect(defaultLabelBaseline(45, 'bottom', 'x')).toBe('top');
      expect(defaultLabelBaseline(180, 'top', 'x')).toBe('top');
    });

    it('is bottom for bottom orients for 2nd and 3rd quadrants', () => {
      expect(defaultLabelBaseline(100, 'bottom', 'x')).toBe('middle');
      expect(defaultLabelBaseline(260, 'bottom', 'x')).toBe('middle');
    });

    it('is middle for 0 and 180 horizontal orients', () => {
      expect(defaultLabelBaseline(0, 'left', 'y')).toBeNull();
      expect(defaultLabelBaseline(180, 'right', 'y')).toBeNull();
    });

    it('is top for bottom orients for 1st and 2nd quadrants', () => {
      expect(defaultLabelBaseline(80, 'left', 'y')).toBe('top');
      expect(defaultLabelBaseline(100, 'left', 'y')).toBe('top');
    });

    it('is bottom for bottom orients for 3rd and 4th quadrants', () => {
      expect(defaultLabelBaseline(280, 'left', 'y')).toBe('bottom');
      expect(defaultLabelBaseline(260, 'left', 'y')).toBe('bottom');
    });

    it('should return undefined if angle is undefined', () => {
      expect(defaultLabelBaseline(undefined, 'left', 'y')).toBeUndefined();
    });

    it('correctly align y-axis labels for labelAngle and orient signals', () => {
      return new Promise<void>(done => {
        const ast = parse(defaultLabelBaseline({signal: 'a'}, {signal: 'o'}, 'y')['signal']);
        let a: number;
        let o: AxisOrient;
        // test all angles
        for (a of range(-360, 375, 15)) {
          for (o of ['left', 'right'] as AxisOrient[]) {
            const {code} = codegen({
              globalvar: ((v: string) => (v === 'a' ? a : v === 'o' ? stringValue(o) : undefined)) as any
            })(ast);

            const result = eval(code);
            const expected = defaultLabelBaseline(normalizeAngle(a), o, 'y');
            expect(result).toEqual(expected);
          }
        }
        done();
      });
    });

    it('correctly align x-axis labels for labelAngle and orient signals', () => {
      return new Promise<void>(done => {
        const ast = parse(defaultLabelBaseline({signal: 'a'}, {signal: 'o'}, 'x')['signal']);
        let a: number;
        let o: AxisOrient;
        // test all angles
        for (a of range(-360, 375, 15)) {
          for (o of ['top', 'bottom'] as AxisOrient[]) {
            const {code} = codegen({
              globalvar: ((v: string) => (v === 'a' ? a : v === 'o' ? stringValue(o) : undefined)) as any
            })(ast);

            const result = eval(code);
            const expected = defaultLabelBaseline(normalizeAngle(a), o, 'x');
            expect(result).toEqual(expected);
          }
        }
        done();
      });
    });

    it('correctly align y-axis labels for orient signal', () => {
      return new Promise<void>(done => {
        let a: number;
        let o: AxisOrient;
        // test all angles
        for (a of range(-360, 375, 15)) {
          a = normalizeAngle(a);
          const baseline = defaultLabelBaseline(a, {signal: 'o'}, 'y');

          for (o of ['left', 'right'] as AxisOrient[]) {
            const result = evalValueOrSignal(baseline, o);

            const expected = defaultLabelBaseline(a, o, 'y');
            expect(result).toEqual(expected);
          }
        }
        done();
      });
    });

    it('correctly align x-axis labels for orient signal', () => {
      return new Promise<void>(done => {
        let a: number;
        let o: AxisOrient;
        // test all angles
        for (a of range(-360, 375, 15)) {
          a = normalizeAngle(a);
          const baseline = defaultLabelBaseline(a, {signal: 'o'}, 'x');
          for (o of ['top', 'bottom'] as AxisOrient[]) {
            const result = evalValueOrSignal(baseline, o);

            const expected = defaultLabelBaseline(a, o, 'x');
            expect(result).toEqual(expected);
          }
        }
        done();
      });
    });
  });
  describe('defaultLabelOverlap', () => {
    it('returns true for time unit ordinal without sort', () => {
      expect(properties.defaultLabelOverlap('ordinal', 'band', true)).toBe(true);
    });

    it('returns true for time unit ordinal with sort', () => {
      expect(properties.defaultLabelOverlap('ordinal', 'band', true, {field: 'x', op: 'min'})).toBeUndefined();
    });

    it('returns undefined for ordinal and nominal', () => {
      expect(properties.defaultLabelOverlap('ordinal', 'band', false)).toBeUndefined();
      expect(properties.defaultLabelOverlap('nominal', 'band', false)).toBeUndefined();
    });

    it('returns greedy for log and symlog scale', () => {
      expect(properties.defaultLabelOverlap('quantitative', 'log', false)).toBe('greedy');
      expect(properties.defaultLabelOverlap('quantitative', 'symlog', false)).toBe('greedy');
    });
  });

  describe('defaultZindex', () => {
    it('returns 1 for discrete axes of rect marks', () => {
      expect(properties.defaultZindex('rect', {field: 'a', type: 'nominal'})).toBe(1);
    });
  });
});

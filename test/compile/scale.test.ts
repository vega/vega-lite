/* tslint:disable:quotemark */

import {assert} from 'chai';

import {scaleBandSize, scaleType, domain, parseScaleComponent} from '../../src/compile/scale';
import {SOURCE, SUMMARY} from '../../src/data';
import {parseUnitModel} from '../util';

import {X, Y, ROW, DETAIL} from '../../src/channel';
import {BANDSIZE_FIT, ScaleType, defaultScaleConfig} from '../../src/scale';
import {POINT} from '../../src/mark';

describe('Scale', function() {
  describe('scaleType()', function() {
    it('should return null for channel without scale', function() {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          detail: {
            field: 'a',
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.encoding().detail;
      assert.deepEqual(scaleType(null, fieldDef, DETAIL, model.mark()), null);
    });

    it('should return time for yearmonth', function() {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          y: {
            field: 'a',
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.encoding().y;
      const scale = model.scale(Y);
      assert.deepEqual(scaleType(scale, fieldDef, Y, model.mark()), ScaleType.TIME);
    });

    it('should return ordinal for month', function() {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          y: {
            field: 'a',
            type: 'temporal',
            timeUnit: 'month'
          }
        }
      });
      const fieldDef = model.encoding().y;
      const scale = model.scale(Y);
      assert.deepEqual(scaleType(scale, fieldDef, Y, model.mark()), ScaleType.ORDINAL);
    });

    it('should return ordinal for row', function() {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          row: {
            field: 'a',
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.encoding().row;
      const scale = model.scale(ROW);
      assert.deepEqual(scaleType(scale, fieldDef, ROW, model.mark()), ScaleType.ORDINAL);
    });
  });

  describe('scaleBandSize()', () => {
    it('should return undefined for non-ordinal scale.', () => {
      assert.equal(scaleBandSize(ScaleType.LINEAR, undefined, defaultScaleConfig, 180, POINT, X), undefined);
      assert.equal(scaleBandSize(ScaleType.LINEAR, 21, defaultScaleConfig, undefined, POINT, X), undefined);
    });

    it('should return "fit" if top-level size is provided for ordinal scale', () => {
      const bandSize = scaleBandSize(ScaleType.ORDINAL, undefined, defaultScaleConfig, 180, POINT, X);
      assert.deepEqual(bandSize, BANDSIZE_FIT);
    });

    it('should return provided bandSize for ordinal scale', () => {
      const bandSize = scaleBandSize(ScaleType.ORDINAL, 21, defaultScaleConfig, undefined, POINT, X);
      assert.deepEqual(bandSize, 21);
    });
  });

  describe('domain()', function() {
    it('should return domain for stack', function() {
      const model = parseUnitModel({
        mark: "bar",
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'origin'
          },
          x: {field: 'x', type: "ordinal"},
          color: {field: 'color', type: "ordinal"},
          row: {field: 'row'}
        }
      });

      const _domain = domain(model.scale(Y), model, Y);

      assert.deepEqual(_domain, {
        data: 'stacked_scale',
        field: 'sum_sum_origin'
      });
    });

    describe('for quantitative', function() {
      it('should return the right domain for binned Q',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                bin: {maxbins: 15},
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain, {
            data: SOURCE,
            field: [
              'bin_origin_start',
              'bin_origin_end'
            ]
          });
        });

      it('should return the raw domain if useRawDomain is true for non-bin, non-sum Q',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SOURCE);
        });

      it('should return the aggregate domain for sum Q',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'sum',
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SUMMARY);
        });

      it('should return the right custom domain', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              field: 'horsepower',
              type: "quantitative",
              scale: {domain: [0,200]}
            }
          }
        });
        const _domain = domain(model.scale(Y), model, Y);

        assert.deepEqual(_domain, [0, 200]);
      });

      it('should return the aggregated domain if useRawDomain is false', function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'min',
                field: 'origin',
                scale: {useRawDomain: false},
                type: "quantitative"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SUMMARY);
        });
    });

    describe('for time', function() {
      it('should return the raw domain if useRawDomain is true for raw T',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal"
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SOURCE);
        });

      it('should return the raw domain if useRawDomain is true for year T',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal",
                timeUnit: 'year'
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain.data, SOURCE);
          assert.operator(_domain.field.indexOf('year'), '>', -1);
        });

      it('should return the correct domain for month T',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal",
                timeUnit: 'month'
              }
            }
          });
          const _domain = domain(model.scale(Y), model, Y);

          assert.deepEqual(_domain, { data: 'month', field: 'date' });
        });

        it('should return the correct domain for yearmonth T',
          function() {
            const model = parseUnitModel({
              mark: "point",
              encoding: {
                y: {
                  field: 'origin',
                  scale: {useRawDomain: true},
                  type: "temporal",
                  timeUnit: 'yearmonth'
                }
              }
            });
            const _domain = domain(model.scale(Y), model, Y);

            assert.deepEqual(_domain, {
              data: 'source', field: 'yearmonth_origin',
              sort: {field: 'yearmonth_origin', op: 'min'}
            });
          });

      it('should return the right custom domain with DateTime objects', () => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              field: 'year',
              type: "temporal",
              scale: {domain: [{year: 1970}, {year: 1980}]}
            }
          }
        });
        const _domain = domain(model.scale(Y), model, Y);

        assert.deepEqual(_domain, [
          new Date(1970, 0, 1).getTime(),
          new Date(1980, 0, 1).getTime()
        ]);
      });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        const sortDef = {op: 'min', field:'Acceleration'};
        const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal", sort: sortDef}
            }
          });

        assert.deepEqual(domain(model.scale(Y), model, Y), {
            data: "source",
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal"}
            }
          });

        assert.deepEqual(domain(model.scale(Y), model, Y), {
            data: "source",
            field: 'origin',
            sort: true
          });
      });
    });
  });

  describe('ordinal with color', function() {
    const model = parseUnitModel({
      mark: "point",
      encoding: {
        color: { field: 'origin', type: "ordinal"}
      }
    });

    const scales = parseScaleComponent(model)['color'];

    it('should create color and inverse scales', function() {
      assert.equal(scales.main.name, 'color');
      assert.equal(scales.colorLegend.name, 'color_legend');
      assert.equal(scales.binColorLegend, undefined);
    });

    it('should create correct inverse scale', function() {
      assert.equal(scales.colorLegend.type, 'ordinal');
      assert.deepEqual(scales.colorLegend.domain, {
        data: 'source',
        field: 'rank_origin',
        sort: true
      });
      assert.deepEqual(scales.colorLegend.range, {
        data: 'source',
        field: 'origin',
        sort: true
      });
    });

    it('should create correct color scale', function() {
      assert.equal(scales.main.type, 'linear');
      assert.deepEqual(scales.main.domain, {
        data: 'source',
        field: 'rank_origin'
      });
    });
  });

  describe('color with bin', function() {
    const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: { field: 'origin', type: "quantitative", bin: true}
        }
      });

    const scales = parseScaleComponent(model)['color'];

    it('should add correct scales', function() {
      assert.equal(scales.main.name, 'color');
      assert.equal(scales.colorLegend.name, 'color_legend');
      assert.equal(scales.binColorLegend.name, 'color_legend_label');
    });

    it('should create correct identity scale', function() {
      assert.equal(scales.colorLegend.type, 'ordinal');
      assert.deepEqual(scales.colorLegend.domain, {
        data: 'source',
        field: 'bin_origin_start',
        sort: true
      });
      assert.deepEqual(scales.colorLegend.range, {
        data: 'source',
        field: 'bin_origin_start',
        sort: true
      });
    });

    it('should sort range of color labels', function() {
      assert.deepEqual(scales.binColorLegend.domain, {
        data: 'source',
        field: 'bin_origin_start',
        sort: true
      });
      assert.deepEqual(scales.binColorLegend.range, {
        data: 'source',
        field: 'bin_origin_range',
        sort: {"field": "bin_origin_start","op": "min"}
      });
    });
  });

  describe('color with time unit', function() {
    const model = parseUnitModel({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "temporal", timeUnit: "year"}
        }
      });

    const scales = parseScaleComponent(model)['color'];

    it('should add correct scales', function() {
      assert.equal(scales.main.name, 'color');
      assert.equal(scales.colorLegend.name, 'color_legend');
      assert.equal(scales.binColorLegend, undefined);
    });

    it('should create correct identity scale', function() {
      assert.equal(scales.colorLegend.type, 'ordinal');
      assert.deepEqual(scales.colorLegend.domain, {
        data: 'source',
        field: 'year_origin',
        sort: true
      });
      assert.deepEqual(scales.colorLegend.range, {
        data: 'source',
        field: 'year_origin',
        sort: true
      });
    });
  });

  describe('rangeMixins()', function() {
    describe('row', function() {
      // TODO:
    });

    describe('column', function() {
      // TODO:
    });

    describe('x', function() {
      // TODO: X
    });

    describe('y', function() {
      // TODO: Y
    });

    describe('size', function() {
      describe('bar', function() {
        // TODO:
      });

      describe('text', function() {
        // TODO:
      });

      describe('rule', function() {
        // TODO:
      });

      describe('point, square, circle', function() {
        // TODO:
      });
    });

    describe('shape', function() {
      // TODO:
    });

    describe('color', function() {
      // TODO:
    });
  });

  describe('bandSize()', function() {
    // TODO:
  });

  describe('nice()', function() {
    // FIXME
  });

  describe('outerPadding()', function() {
    // FIXME
  });

  describe('points()', function() {
    // FIXME
  });

  describe('reverse()', function() {
    // FIXME
  });

  describe('zero()', function() {
    // FIXME
  });
});

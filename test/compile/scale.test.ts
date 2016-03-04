/* tslint:disable:quotemark */

import {assert} from 'chai';

import * as vlscale from '../../src/compile/scale';
import {SOURCE, SUMMARY} from '../../src/data';
import {parseModel} from '../util';
import {Y, ROW} from '../../src/channel';
import {ScaleType} from '../../src/scale';


describe('Scale', function() {
  describe('scaleType()', function() {
    it('should return time for yearmonth', function() {
      const model = parseModel({
        mark: 'point',
        encoding: {
          y: {
            field: 'a',
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.fieldDef(Y);
      const scale = model.scale(Y);
      assert.deepEqual(vlscale.scaleType(scale, fieldDef, Y, model.mark()), ScaleType.TIME);
    });

    it('should return ordinal for month', function() {
      const model = parseModel({
        mark: 'point',
        encoding: {
          y: {
            field: 'a',
            type: 'temporal',
            timeUnit: 'month'
          }
        }
      });
      const fieldDef = model.fieldDef(Y);
      const scale = model.scale(Y);
      assert.deepEqual(vlscale.scaleType(scale, fieldDef, Y, model.mark()), ScaleType.ORDINAL);
    });

    it('should return ordinal for row', function() {
      const model = parseModel({
        mark: 'point',
        encoding: {
          row: {
            field: 'a',
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.fieldDef(ROW);
      const scale = model.scale(ROW);
      assert.deepEqual(vlscale.scaleType(scale, fieldDef, ROW, model.mark()), ScaleType.ORDINAL);
    });
  });

  describe('domain()', function() {
    it('should return domain for stack', function() {
      const model = parseModel({
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

      const domain = vlscale.domain(model.scale(Y), model, Y);

      assert.deepEqual(domain, {
        data: 'stacked_scale',
        field: 'sum_sum_origin'
      });
    });

    describe('for quantitative', function() {
      it('should return the right domain for binned Q',
        function() {
          const model = parseModel({
            mark: "point",
            encoding: {
              y: {
                bin: {maxbins: 15},
                field: 'origin',
                scale: {includeRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const domain = vlscale.domain(model.scale(Y), model, Y);

          assert.deepEqual(domain, {
            data: SOURCE,
            field: [
              'bin_origin_start',
              'bin_origin_end'
            ]
          });
        });

      it('should return the raw domain if includeRawDomain is true for non-bin, non-sum Q',
        function() {
          const model = parseModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'origin',
                scale: {includeRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const domain = vlscale.domain(model.scale(Y), model, Y);

          assert.deepEqual(domain.data, SOURCE);
        });

      it('should return the aggregate domain for sum Q',
        function() {
          const model = parseModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'sum',
                field: 'origin',
                scale: {includeRawDomain: true},
                type: "quantitative"
              }
            }
          });
          const domain = vlscale.domain(model.scale(Y), model, Y);

          assert.deepEqual(domain.data, SUMMARY);
        });


      it('should return the aggregated domain if includeRawDomain is false', function() {
          const model = parseModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'min',
                field: 'origin',
                scale: {includeRawDomain: false},
                type: "quantitative"
              }
            }
          });
          const domain = vlscale.domain(model.scale(Y), model, Y);

          assert.deepEqual(domain.data, SUMMARY);
        });
    });

    describe('for time', function() {
      it('should return the raw domain if includeRawDomain is true for raw T',
        function() {
          const model = parseModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {includeRawDomain: true},
                type: "temporal"
              }
            }
          });
          const domain = vlscale.domain(model.scale(Y), model, Y);

          assert.deepEqual(domain.data, SOURCE);
        });

      it('should return the raw domain if includeRawDomain is true for year T',
        function() {
          const model = parseModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {includeRawDomain: true},
                type: "temporal",
                timeUnit: 'year'
              }
            }
          });
          const domain = vlscale.domain(model.scale(Y), model, Y);

          assert.deepEqual(domain.data, SOURCE);
          assert.operator(domain.field.indexOf('year'), '>', -1);
        });

      it('should return the correct domain for month T',
        function() {
          const model = parseModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {includeRawDomain: true},
                type: "temporal",
                timeUnit: 'month'
              }
            }
          });
          const domain = vlscale.domain(model.scale(Y), model, Y);

          assert.deepEqual(domain, { data: 'month', field: 'date' });
        });

        it('should return the correct domain for yearmonth T',
          function() {
            const model = parseModel({
              mark: "point",
              encoding: {
                y: {
                  field: 'origin',
                  scale: {includeRawDomain: true},
                  type: "temporal",
                  timeUnit: 'yearmonth'
                }
              }
            });
            const domain = vlscale.domain(model.scale(Y), model, Y);

            assert.deepEqual(domain, {
              data: 'source', field: 'yearmonth_origin',
              sort: {field: 'yearmonth_origin', op: 'min'}
            });
          });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        const sortDef = {op: 'min', field:'Acceleration'};
        const model = parseModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal", sort: sortDef}
            }
          });

        assert.deepEqual(vlscale.domain(model.scale(Y), model, Y), {
            data: "source",
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        const model = parseModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal"}
            }
          });

        assert.deepEqual(vlscale.domain(model.scale(Y), model, Y), {
            data: "source",
            field: 'origin',
            sort: true
          });
      });
    });
  });

  describe('ordinal with color', function() {
    const model = parseModel({
      mark: "point",
      encoding: {
        color: { field: 'origin', type: "ordinal"}
      }
    });

    const scales = vlscale.parseScaleComponent(model)['color'];

    it('should create color and inverse scales', function() {
      assert.equal(scales.length, 2);
      assert.equal(scales[0].name, 'color_legend');
      assert.equal(scales[1].name, 'color');
    });

    it('should create correct inverse scale', function() {
      assert.equal(scales[0].type, 'ordinal');
      assert.deepEqual(scales[0].domain, {
        data: 'source',
        field: 'rank_origin',
        sort: true
      });
      assert.deepEqual(scales[0].range, {
        data: 'source',
        field: 'origin',
        sort: true
      });
    });

    it('should create correct color scale', function() {
      assert.equal(scales[1].type, 'linear');
      assert.deepEqual(scales[1].domain, {
        data: 'source',
        field: 'rank_origin'
      });
    });
  });

  describe('color with bin', function() {
    const model = parseModel({
        mark: "point",
        encoding: {
          color: { field: 'origin', type: "quantitative", bin: true}
        }
      });

    const scales = vlscale.parseScaleComponent(model)['color'];

    it('should add correct scales', function() {
      assert.equal(scales.length, 3);

      assert.equal(scales[0].name, 'color_legend');
      assert.equal(scales[1].name, 'color_legend_label');
      assert.equal(scales[2].name, 'color');
    });

    it('should create correct identity scale', function() {
      assert.equal(scales[0].type, 'ordinal');
      assert.deepEqual(scales[0].domain, {
        data: 'source',
        field: 'bin_origin_start',
        sort: true
      });
      assert.deepEqual(scales[0].range, {
        data: 'source',
        field: 'bin_origin_start',
        sort: true
      });
    });

    it('should sort range of color labels', function() {
      assert.deepEqual(scales[1].range, {
        data: 'source',
        field: 'bin_origin_range',
        sort: {"field": "bin_origin_start","op": "min"}
      });
    });
  });

  describe('color with time unit', function() {
    const model = parseModel({
        mark: "point",
        encoding: {
          color: {field: 'origin', type: "temporal", timeUnit: "year"}
        }
      });

    const scales = vlscale.parseScaleComponent(model)['color'];

    it('should add correct scales', function() {
      assert.equal(scales.length, 2);

      assert.equal(scales[0].name, 'color_legend');
      assert.equal(scales[1].name, 'color');
    });

    it('should create correct identity scale', function() {
      assert.equal(scales[0].type, 'ordinal');
      assert.deepEqual(scales[0].domain, {
        data: 'source',
        field: 'year_origin',
        sort: true
      });
      assert.deepEqual(scales[0].range, {
        data: 'source',
        field: 'year_origin',
        sort: true
      });
    });
  });

  describe('rangeMixins()', function() {
    // FIXME
  });

  describe('bandSize()', function() {
    // FIXME
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

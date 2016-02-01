/* tslint:disable:quotemark */

import {assert} from 'chai';

import * as vlscale from '../../src/compile/scale';
import {SOURCE, SUMMARY} from '../../src/data';
import {parseModel} from '../util';
import {Y, ROW} from '../../src/channel';


describe('Scale', function() {
  describe('type()', function() {
    it('should return time for yearmonth', function() {
      const model = parseModel({
        mark: 'point',
        encoding: {
          y: {
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.fieldDef(Y);
      assert.deepEqual(vlscale.type(fieldDef, Y, model.mark()), 'time');
    });

    it('should return ordinal for month', function() {
      const model = parseModel({
        mark: 'point',
        encoding: {
          y: {
            type: 'temporal',
            timeUnit: 'month'
          }
        }
      });
      const fieldDef = model.fieldDef(Y);
      assert.deepEqual(vlscale.type(fieldDef, Y, model.mark()), 'ordinal');
    });

    it('should return ordinal for bar chart', function() {
      const model = parseModel({
        mark: 'bar',
        encoding: {
          y: {
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.fieldDef(Y);
      assert.deepEqual(vlscale.type(fieldDef, Y, model.mark()), 'ordinal');
    });

    it('should return ordinal for row', function() {
      const model = parseModel({
        mark: 'point',
        encoding: {
          row: {
            type: 'temporal',
            timeUnit: 'yearMonth'
          }
        }
      });
      const fieldDef = model.fieldDef(ROW);
      assert.deepEqual(vlscale.type(fieldDef, ROW, model.mark()), 'ordinal');
    });
  });

  describe('domain()', function() {
    it('should return domain for stack', function() {
      const domain = vlscale.domain(parseModel({
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
      }), Y, 'linear');

      assert.deepEqual(domain, {
        data: 'stacked_scale',
        field: 'sum_sum_origin'
      });
    });

    describe('for quantitative', function() {
      it('should return the right domain for binned Q',
        function() {
          const domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                bin: {maxbins: 15},
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          }), Y, 'ordinal');

          assert.deepEqual(domain, {
            data: SOURCE,
            field: 'bin_origin_range',
            sort: {
              field: 'bin_origin_start',
              op: 'min'
            }
          });
        });

      it('should return the raw domain if useRawDomain is true for non-bin, non-sum Q',
        function() {
          const domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          }), Y, 'linear');

          assert.deepEqual(domain.data, SOURCE);
        });

      it('should return the aggregate domain for sum Q',
        function() {
          const domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'sum',
                field: 'origin',
                scale: {useRawDomain: true},
                type: "quantitative"
              }
            }
          }), Y, 'linear');

          assert.deepEqual(domain.data, SUMMARY);
        });


      it('should return the aggregated domain if useRawDomain is false', function() {
          const domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'min',
                field: 'origin',
                scale: {useRawDomain: false},
                type: "quantitative"
              }
            }
          }), Y, 'linear');

          assert.deepEqual(domain.data, SUMMARY);
        });
    });

    describe('for time', function() {
      it('should return the raw domain if useRawDomain is true for raw T',
        function() {
          const domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal"
              }
            }
          }), Y, 'time');

          assert.deepEqual(domain.data, SOURCE);
        });

      it('should return the raw domain if useRawDomain is true for year T',
        function() {
          const domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal",
                timeUnit: 'year'
              }
            }
          }), Y, 'ordinal');

          assert.deepEqual(domain.data, SOURCE);
          assert.operator(domain.field.indexOf('year'), '>', -1);
        });

      it('should return the correct domain for month T',
        function() {
          const domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal",
                timeUnit: 'month'
              }
            }
          }), Y, 'ordinal');

          assert.deepEqual(domain, { data: 'month', field: 'date' });
        });

        it('should return the correct domain for yearmonth T',
          function() {
            const domain = vlscale.domain(parseModel({
              mark: "point",
              encoding: {
                y: {
                  field: 'origin',
                  scale: {useRawDomain: true},
                  type: "temporal",
                  timeUnit: 'yearmonth'
                }
              }
            }), Y, 'ordinal');

            assert.deepEqual(domain, {
              data: 'source', field: 'yearmonth_origin',
              sort: {field: 'yearmonth_origin', op: 'min'}
            });
          });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        const sortDef = {op: 'min', field:'Acceleration'};
        const encoding = parseModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal", sort: sortDef}
            }
          });

        assert.deepEqual(vlscale.domain(encoding, Y, 'ordinal'), {
            data: "source",
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        const encoding = parseModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal"}
            }
          });

        assert.deepEqual(vlscale.domain(encoding, Y, 'ordinal'), {
            data: "source",
            field: 'origin',
            sort: true
          });
      });
    });
  });

  describe('rangeMixins()', function() {
    // FIXME
  });

  describe('bandWidth()', function() {
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

import {expect} from 'chai';

import * as vlscale from '../../src/compiler/scale';
import {SOURCE, SUMMARY} from '../../src/data';
import {Model} from '../../src/compiler/Model';
import {ORDINAL, QUANTITATIVE, TEMPORAL} from '../../src/type';
import {POINT, BAR} from '../../src/mark';
import {Y} from '../../src/channel';


describe('vl.compile.scale', function() {
  describe('domain()', function() {
    describe('for stack', function() {
      it('should return correct stack', function() {
        var domain = vlscale.domain(new Model({
          mark: BAR,
          encoding: {
            y: {
              aggregate: 'sum',
              field: 'origin'
            },
            x: {field: 'x', type: ORDINAL},
            color: {field: 'color', type: ORDINAL},
            row: {field: 'row'}
          }
        }), Y, 'linear');

        expect(domain).to.eql({
          data: 'stacked_scale',
          field: 'max_sum_sum_origin'
        });
      });

      it('should return correct aggregated stack', function() {
        var domain = vlscale.domain(new Model({
          mark: BAR,
          encoding: {
            y: {
              aggregate: 'sum',
              field: 'origin'
            },
            x: {field: 'x', type: ORDINAL},
            color: {field: 'color', type: ORDINAL},
            row: {field: 'row'}
          }
        }), Y, 'linear');

        expect(domain).to.eql({
          data: 'stacked_scale',
          field: 'max_sum_sum_origin'
        });
      });
    });

    describe('for quantitative', function() {
      it('should return the right domain if binned Q',
        function() {
          var domain = vlscale.domain(new Model({
            mark: POINT,
            encoding: {
              y: {
                bin: {maxbins: 15},
                field: 'origin',
                scale: {useRawDomain: true},
                type: QUANTITATIVE
              }
            }
          }), Y, 'ordinal');

          expect(domain).to.eql({
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
          var domain = vlscale.domain(new Model({
            mark: POINT,
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'origin',
                scale: {useRawDomain: true},
                type: QUANTITATIVE
              }
            }
          }), Y, 'linear');

          expect(domain.data).to.eql(SOURCE);
        });

      it('should return the aggregate domain for sum Q',
        function() {
          var domain = vlscale.domain(new Model({
            mark: POINT,
            encoding: {
              y: {
                aggregate: 'sum',
                field: 'origin',
                scale: {useRawDomain: true},
                type: QUANTITATIVE
              }
            }
          }), Y, 'linear');

          expect(domain.data).to.eql(SUMMARY);
        });


      it('should return the aggregated domain if useRawDomain is false', function() {
          var domain = vlscale.domain(new Model({
            mark: POINT,
            encoding: {
              y: {
                aggregate: 'min',
                field: 'origin',
                scale: {useRawDomain: false},
                type: QUANTITATIVE
              }
            }
          }), Y, 'linear');

          expect(domain.data).to.eql(SUMMARY);
        });
    });

    describe('for time', function() {
      it('should return the raw domain if useRawDomain is true for raw T',
        function() {
          var domain = vlscale.domain(new Model({
            mark: POINT,
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: TEMPORAL
              }
            }
          }), Y, 'time');

          expect(domain.data).to.eql(SOURCE);
        });

      it('should return the raw domain if useRawDomain is true for year T',
        function() {
          var domain = vlscale.domain(new Model({
            mark: POINT,
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: TEMPORAL,
                timeUnit: 'year'
              }
            }
          }), Y, 'ordinal');

          expect(domain.data).to.eql(SOURCE);
          expect(domain.field.indexOf('year')).to.gt(-1);
        });

      it('should return the correct domain for month T',
        function() {
          var domain = vlscale.domain(new Model({
            mark: POINT,
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: TEMPORAL,
                timeUnit: 'month'
              }
            }
          }), Y, 'ordinal');

          expect(domain).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        var sortDef = {op: 'min', field:'Acceleration'};
        var encoding = new Model({
            mark: POINT,
            encoding: {
              y: { field: 'origin', type: ORDINAL, sort: sortDef}
            }
          });

        expect(vlscale.domain(encoding, Y, 'ordinal'))
          .to.eql({
            data: SOURCE,
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        var encoding = new Model({
            mark: POINT,
            encoding: {
              y: { field: 'origin', type: ORDINAL}
            }
          });

        expect(vlscale.domain(encoding, Y, 'ordinal'))
          .to.eql({
            data: SOURCE,
            field: 'origin',
            sort: true
          });
      });
    });
  });
});

/* tslint:disable:quotemark */

import {expect} from 'chai';

import * as vlscale from '../../src/compile/scale';
import {SOURCE, SUMMARY} from '../../src/data';
import {parseModel} from '../util';
import {Y} from '../../src/channel';


describe('Scale', function() {
  describe('domain()', function() {
    describe('for stack', function() {
      it('should return correct stacked_scale', function() {
        var domain = vlscale.domain(parseModel({
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

        expect(domain).to.eql({
          data: 'stacked_scale',
          field: 'sum_sum_origin'
        });
      });
    });

    describe('for quantitative', function() {
      it('should return the right domain if binned Q',
        function() {
          var domain = vlscale.domain(parseModel({
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
          var domain = vlscale.domain(parseModel({
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

          expect(domain.data).to.eql(SOURCE);
        });

      it('should return the aggregate domain for sum Q',
        function() {
          var domain = vlscale.domain(parseModel({
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

          expect(domain.data).to.eql(SUMMARY);
        });


      it('should return the aggregated domain if useRawDomain is false', function() {
          var domain = vlscale.domain(parseModel({
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

          expect(domain.data).to.eql(SUMMARY);
        });
    });

    describe('for time', function() {
      it('should return the raw domain if useRawDomain is true for raw T',
        function() {
          var domain = vlscale.domain(parseModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                scale: {useRawDomain: true},
                type: "temporal"
              }
            }
          }), Y, 'time');

          expect(domain.data).to.eql(SOURCE);
        });

      it('should return the raw domain if useRawDomain is true for year T',
        function() {
          var domain = vlscale.domain(parseModel({
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

          expect(domain.data).to.eql(SOURCE);
          expect(domain.field.indexOf('year')).to.gt(-1);
        });

      it('should return the correct domain for month T',
        function() {
          var domain = vlscale.domain(parseModel({
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

          expect(domain).to.eql({ data: 'month', field: 'date' });
        });

        it('should return the correct domain for yearmonth T',
          function() {
            var domain = vlscale.domain(parseModel({
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

            expect(domain).to.eql({
              data: 'source', field: 'yearmonth_origin',
              sort: {field: 'yearmonth_origin', op: 'min'}
            });
          });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        var sortDef = {op: 'min', field:'Acceleration'};
        var encoding = parseModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal", sort: sortDef}
            }
          });

        expect(vlscale.domain(encoding, Y, 'ordinal'))
          .to.eql({
            data: "source",
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        var encoding = parseModel({
            mark: "point",
            encoding: {
              y: { field: 'origin', type: "ordinal"}
            }
          });

        expect(vlscale.domain(encoding, Y, 'ordinal'))
          .to.eql({
            data: "source",
            field: 'origin',
            sort: true
          });
      });
    });
  });

  describe('rangeMixins()', function() {
    // TODO
  });
});

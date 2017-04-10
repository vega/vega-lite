/* tslint:disable:quotemark */


import {assert} from 'chai';
import {parseDomain, unionDomains} from '../../../src/compile/scale/domain';
import {SUMMARY} from '../../../src/data';
import {PositionFieldDef} from '../../../src/fielddef';
import * as log from '../../../src/log';
import {FieldRefUnionDomain, VgDataRef} from '../../../src/vega.schema';
import {parseUnitModel} from '../../util';

describe('compile/scale', () => {
  describe('parseDomain()', () => {
    it('should have correct domain with x and x2 channel', function() {
      const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {field: 'a', type: 'quantitative'},
            x2: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'},
            y2: {field: 'd', type: 'quantitative'}
          }
        });

      const xDomain = parseDomain(model, 'x');
      assert.deepEqual(xDomain, {data: 'source', fields: ['a', 'b']});

      const yDomain = parseDomain(model, 'y');
      assert.deepEqual(yDomain, {data: 'source', fields: ['c', 'd']});
    });

    it('should have correct domain for color', function() {
      const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            color: {field: 'a', type: 'quantitative'},
          }
        });

      const xDomain = parseDomain(model, 'color');
      assert.deepEqual(xDomain, {data: 'source', field: 'a'});
    });

    it('should return domain for stack', function() {
      const model = parseUnitModel({
        mark: "bar",
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'origin',
            type: 'quantitative'
          },
          x: {field: 'x', type: "ordinal"},
          color: {field: 'color', type: "ordinal"}
        }
      });

      assert.deepEqual(parseDomain(model,'y'), {
        data: 'stacked',
        fields: ['sum_origin_start', 'sum_origin_end']
      });
    });

    it('should return normalize domain for stack if specified', function() {
      const model = parseUnitModel({
        mark: "bar",
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'origin',
            type: 'quantitative'
          },
          x: {field: 'x', type: "ordinal"},
          color: {field: 'color', type: "ordinal"}
        },
        config: {
          stack: "normalize"
        }
      });

      assert.deepEqual(parseDomain(model,'y'), [0, 1]);
    });

    describe('for quantitative', function() {
      it('should return the right domain for binned Q', log.wrap((localLogger) => {
        const fieldDef: PositionFieldDef = {
          bin: {maxbins: 15},
          field: 'origin',
          scale: {domain: 'unaggregated'},
          type: 'quantitative'
        };
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: fieldDef
          }
        });

        assert.deepEqual(parseDomain(model,'y'), {
          signal: 'sequence(bin_maxbins_15_origin_bins.start, bin_maxbins_15_origin_bins.stop + bin_maxbins_15_origin_bins.step, bin_maxbins_15_origin_bins.step)'
        });

        assert.equal(localLogger.warns[0], log.message.unaggregateDomainHasNoEffectForRawField(fieldDef));
      }));

      it('should return the unaggregated domain if requested for non-bin, non-sum Q',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                aggregate: 'mean',
                field: 'acceleration',
                scale: {domain: 'unaggregated'},
                type: "quantitative"
              }
            }
          });
          const _domain = parseDomain(model,'y') as FieldRefUnionDomain;

          assert.deepEqual(_domain.data, SUMMARY);
          assert.deepEqual(_domain.fields, ['min_acceleration', 'max_acceleration']);
        });

      it('should return the aggregated domain for sum Q', log.wrap((localLogger) => {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              aggregate: 'sum',
              field: 'origin',
              scale: {domain: 'unaggregated'},
              type: "quantitative"
            }
          }
        });
        const _domain = parseDomain(model,'y') as VgDataRef;
        assert.deepEqual(_domain.data, SUMMARY);
        assert.equal(
          localLogger.warns[0], log.message.unaggregateDomainWithNonSharedDomainOp('sum')
        );
      }));

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
        const _domain = parseDomain(model,'y');

        assert.deepEqual(_domain, [0, 200]);
      });

      it('should return the aggregated domain if we do not overrride it', function() {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              aggregate: 'min',
              field: 'origin',
              type: "quantitative"
            }
          }
        });
        const _domain = parseDomain(model,'y') as VgDataRef;

        assert.deepEqual(_domain.data, SUMMARY);
      });

      it('should return the aggregated domain if specified in config', function() {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {
              aggregate: 'min',
              field: 'acceleration',
              type: "quantitative"
            }
          },
          config: {
            scale: {
              useUnaggregatedDomain: true
            }
          }
        });
        const _domain = parseDomain(model,'y') as FieldRefUnionDomain;

        assert.deepEqual(_domain.data, SUMMARY);
        assert.deepEqual(_domain.fields, ['min_acceleration', 'max_acceleration']);
      });
    });

    describe('for time', function() {
      it('should return the correct domain for month T',
        function() {
          const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {
                field: 'origin',
                type: "temporal",
                timeUnit: 'month'
              }
            }
          });
          const _domain = parseDomain(model,'y');
          assert.deepEqual(_domain, {data: 'source', field: 'month_origin', sort: true});
        });

        it('should return the correct domain for yearmonth T',
          function() {
            const model = parseUnitModel({
              mark: "point",
              encoding: {
                y: {
                  field: 'origin',
                  type: "temporal",
                  timeUnit: 'yearmonth'
                }
              }
            });
            const _domain = parseDomain(model,'y');

            assert.deepEqual(_domain, {data: 'source', field: 'yearmonth_origin'});
          });


        it('should return the correct domain for yearmonth T when specify sort',
          function() {
            const model = parseUnitModel({
              mark: "line",
              encoding: {
                x: {
                  timeUnit: 'month',
                  field: 'date',
                  type: 'temporal',
                  sort: {
                    op: 'mean',
                    field: 'precipitation',
                    order: 'descending'
                  }
                },
                y: {
                  aggregate: 'mean',
                  field: 'precipitation',
                  type: 'quantitative'
                }
              }
            });
            const _domain = parseDomain(model,'x');

            assert.deepEqual(_domain, {
              data: 'source',
              field: 'month_date',
              sort: {
                op: 'mean',
                field: 'precipitation'
              }
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
        const _domain = parseDomain(model,'y');

        assert.deepEqual(_domain, [
          new Date(1970, 0, 1).getTime(),
          new Date(1980, 0, 1).getTime()
        ]);
      });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        const sortDef = {op: 'min' as 'min', field:'Acceleration'};
        const model = parseUnitModel({
            mark: "point",
            encoding: {
              y: {field: 'origin', type: "ordinal", sort: sortDef}
            }
          });

        assert.deepEqual(parseDomain(model,'y'), {
            data: "source",
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        const model = parseUnitModel({
          mark: "point",
          encoding: {
            y: {field: 'origin', type: "ordinal"}
          }
        });

        assert.deepEqual(parseDomain(model,'y'), {
          data: "source",
          field: 'origin',
          sort: true
        });
      });
    });
  });

  describe('unionDomains()', () => {
    it('should union field and data ref union domains', () => {
      const domain1 = {
        data: 'foo',
        fields: ['a', 'b']
      };
      const domain2 = {
        fields: [{
          data: 'foo',
          field: 'b'
        },{
          data: 'foo',
          field: 'c'
        }]
      };

      const unioned = unionDomains(domain1, domain2);
      assert.deepEqual(unioned, {
        data: 'foo',
        fields: ['a', 'b', 'c']
      });
    });

    it('should union data ref union domains', () => {
      const domain1 = {
        data: 'foo',
        fields: ['a', 'b']
      };

      const domain2 = {
        data: 'foo',
        fields: ['b', 'c']
      };

      const unioned = unionDomains(domain1, domain2);
      assert.deepEqual(unioned, {
        data: 'foo',
        fields: ['a', 'b', 'c']
      });
    });
  });
});

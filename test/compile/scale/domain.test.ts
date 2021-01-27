import {SignalRef} from 'vega';
import {ScaleChannel} from '../../../src/channel';
import {PositionFieldDef} from '../../../src/channeldef';
import {domainSort, mergeDomains, parseDomainForChannel} from '../../../src/compile/scale/domain';
import {parseScaleCore} from '../../../src/compile/scale/parse';
import {UnitModel} from '../../../src/compile/unit';
import * as log from '../../../src/log';
import {ScaleType} from '../../../src/scale';
import {EncodingSortField} from '../../../src/sort';
import {parseUnitModel} from '../../util';

describe('compile/scale', () => {
  describe('parseDomainForChannel()', () => {
    function testParseDomainForChannel(model: UnitModel, channel: ScaleChannel) {
      // Cannot parseDomain before parseScaleCore
      parseScaleCore(model);
      return parseDomainForChannel(model, channel).value;
    }

    it('should have correct domain with x and x2 channel', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          x2: {field: 'b'},
          y: {field: 'c', type: 'quantitative'},
          y2: {field: 'd'}
        }
      });

      const xDomain = testParseDomainForChannel(model, 'x');
      expect(xDomain).toEqual([
        {data: 'main', field: 'a'},
        {data: 'main', field: 'b'}
      ]);

      const yDomain = testParseDomainForChannel(model, 'y');
      expect(yDomain).toEqual([
        {data: 'main', field: 'c'},
        {data: 'main', field: 'd'}
      ]);
    });

    it('should have correct domain unionWith', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', scale: {domain: {unionWith: [0, 100]}}}
        }
      });

      const xDomain = testParseDomainForChannel(model, 'x');
      expect(xDomain).toEqual([{data: 'main', field: 'a'}, [0, 100]]);
    });

    it('correctly parse signal domain', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', scale: {domain: {signal: 'a'}}}
        }
      });

      const xDomain = testParseDomainForChannel(model, 'x');
      expect(xDomain).toEqual([{signal: 'a'}]);
    });

    it('correctly parse signal domain array', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', scale: {domain: [{signal: 'a'}, {signal: 'b'}]}}
        }
      });

      const xDomain = testParseDomainForChannel(model, 'x');
      expect(xDomain).toEqual([[{signal: 'a'}, {signal: 'b'}]]);
    });

    it('should have correct domain for color', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          color: {field: 'a', type: 'quantitative'}
        }
      });

      const xDomain = testParseDomainForChannel(model, 'color');
      expect(xDomain).toEqual([{data: 'main', field: 'a'}]);
    });

    it('should have correct domain for color ConditionField', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          color: {
            condition: {param: 'sel', field: 'a', type: 'quantitative'}
          }
        }
      });

      const xDomain = testParseDomainForChannel(model, 'color');
      expect(xDomain).toEqual([{data: 'main', field: 'a'}]);
    });

    it('should return domain for stack', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'origin',
            type: 'quantitative'
          },
          x: {field: 'x', type: 'ordinal'},
          color: {field: 'color', type: 'ordinal'}
        }
      });

      expect(testParseDomainForChannel(model, 'y')).toEqual([
        {
          data: 'main',
          field: 'sum_origin_start'
        },
        {
          data: 'main',
          field: 'sum_origin_end'
        }
      ]);
    });

    it('should return normalize domain for stack if specified', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          y: {
            aggregate: 'sum',
            field: 'origin',
            type: 'quantitative',
            stack: 'normalize'
          },
          x: {field: 'x', type: 'ordinal'},
          color: {field: 'color', type: 'ordinal'}
        }
      });

      expect(testParseDomainForChannel(model, 'y')).toEqual([[0, 1]]);
    });

    describe('for quantitative', () => {
      it(
        'should return the right domain for binned Q',
        log.wrap(localLogger => {
          const fieldDef: PositionFieldDef<string> = {
            bin: {maxbins: 15},
            field: 'origin',
            scale: {domain: 'unaggregated'},
            type: 'quantitative'
          };
          const model = parseUnitModel({
            mark: 'point',
            encoding: {
              y: fieldDef
            }
          });
          const domain = testParseDomainForChannel(model, 'y')[0] as SignalRef;
          expect(domain.signal).toBe('[bin_maxbins_15_origin_bins.start, bin_maxbins_15_origin_bins.stop]');

          expect(localLogger.warns[0]).toEqual(log.message.unaggregateDomainHasNoEffectForRawField(fieldDef));
        })
      );

      it('should return the unaggregated domain if requested for non-bin, non-sum Q', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              aggregate: 'mean',
              field: 'acceleration',
              scale: {domain: 'unaggregated'},
              type: 'quantitative'
            }
          }
        });

        expect(testParseDomainForChannel(model, 'y')).toEqual([
          {
            data: 'main',
            field: 'min_acceleration'
          },
          {
            data: 'main',
            field: 'max_acceleration'
          }
        ]);
      });

      it(
        'should return the aggregated domain for sum Q',
        log.wrap(localLogger => {
          const model = parseUnitModel({
            mark: 'point',
            encoding: {
              y: {
                aggregate: 'sum',
                field: 'origin',
                scale: {domain: 'unaggregated'},
                type: 'quantitative'
              }
            }
          });
          testParseDomainForChannel(model, 'y');
          expect(localLogger.warns[0]).toEqual(log.message.unaggregateDomainWithNonSharedDomainOp('sum'));
        })
      );

      it('should return the right custom domain', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'horsepower',
              type: 'quantitative',
              scale: {domain: [0, 200]}
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([[0, 200]]);
      });

      it('should follow the custom domain despite bin', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'origin',
              type: 'quantitative',
              scale: {domain: [0, 200]},
              bin: {maxbins: 15}
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([[0, 200]]);
      });

      it('should return the aggregated domain if we do not override it', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              aggregate: 'min',
              field: 'origin',
              type: 'quantitative'
            }
          }
        });

        expect(testParseDomainForChannel(model, 'y')).toEqual([
          {
            data: 'main',
            field: 'min_origin'
          }
        ]);
      });

      it('should use the aggregated data for domain if specified in config', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              aggregate: 'min',
              field: 'acceleration',
              type: 'quantitative'
            }
          },
          config: {
            scale: {
              useUnaggregatedDomain: true
            }
          }
        });

        expect(testParseDomainForChannel(model, 'y')).toEqual([
          {
            data: 'main',
            field: 'min_acceleration'
          },
          {
            data: 'main',
            field: 'max_acceleration'
          }
        ]);
      });
    });

    describe('for time', () => {
      it('should return the correct domain for month T', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'origin',
              type: 'temporal',
              timeUnit: 'month'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');
        expect(_domain).toEqual([{data: 'main', field: 'month_origin'}]);
      });

      it('should return the correct domain for month O', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'origin',
              type: 'ordinal',
              timeUnit: 'month'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');
        expect(_domain).toEqual([{data: 'main', field: 'month_origin', sort: true}]);
      });

      it('should return the correct domain for yearmonth T with point marks', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'origin',
              type: 'temporal',
              timeUnit: 'yearmonth'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([{data: 'main', field: 'yearmonth_origin'}]);
      });

      it('should return the correct domain for yearmonth T with bar marks', () => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            y: {
              field: 'origin',
              type: 'temporal',
              timeUnit: 'yearmonth'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([
          {data: 'main', field: 'yearmonth_origin'},
          {data: 'main', field: 'yearmonth_origin_end'}
        ]);
      });

      it('should return the correct domain for month O when specify sort', () => {
        const sortDef: EncodingSortField<string> = {op: 'mean', field: 'precipitation', order: 'descending'};
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'month',
              field: 'date',
              type: 'ordinal',
              sort: sortDef
            },
            y: {
              aggregate: 'mean',
              field: 'precipitation',
              type: 'quantitative'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'x');

        expect(_domain).toEqual([
          {
            data: 'raw',
            field: 'month_date',
            sort: sortDef
          }
        ]);
      });

      it('should return the correct domain for month O when specify sort does not have op', () => {
        const sortDef: EncodingSortField<string> = {field: 'precipitation', order: 'descending'};
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'month',
              field: 'date',
              type: 'ordinal',
              sort: sortDef
            },
            y: {
              aggregate: 'min',
              field: 'precipitation',
              type: 'quantitative'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'x');

        expect(_domain).toEqual([
          {
            data: 'raw',
            field: 'month_date',
            sort: {...sortDef, op: 'min'}
          }
        ]);
      });

      it('should return the correct domain for month O when the field is sorted by another encoding (long form)', () => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'month',
              field: 'date',
              type: 'ordinal',
              sort: {encoding: 'y'}
            },
            y: {
              aggregate: 'median',
              field: 'precipitation',
              type: 'quantitative'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'x');

        expect(_domain).toEqual([
          {
            data: 'raw',
            field: 'month_date',
            sort: {op: 'median', field: 'precipitation'}
          }
        ]);
      });

      it('should return the correct domain for month O when the field is sorted by another encoding (short form)', () => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'month',
              field: 'date',
              type: 'ordinal',
              sort: 'y'
            },
            y: {
              aggregate: 'median',
              field: 'precipitation',
              type: 'quantitative'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'x');

        expect(_domain).toEqual([
          {
            data: 'raw',
            field: 'month_date',
            sort: {op: 'median', field: 'precipitation'}
          }
        ]);
      });

      it('should return the correct domain for month O when the field is sorted by another encoding (desc)', () => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'month',
              field: 'date',
              type: 'ordinal',
              sort: '-y'
            },
            y: {
              aggregate: 'median',
              field: 'precipitation',
              type: 'quantitative'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'x');

        expect(_domain).toEqual([
          {
            data: 'raw',
            field: 'month_date',
            sort: {op: 'median', field: 'precipitation', order: 'descending'}
          }
        ]);
      });

      it('should return the correct domain for month O when specify sort does not have op and the plot is stacked', () => {
        const sortDef: EncodingSortField<string> = {field: 'precipitation', order: 'descending'};
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {
              timeUnit: 'month',
              field: 'date',
              type: 'ordinal',
              sort: sortDef
            },
            y: {
              aggregate: 'sum',
              field: 'precipitation',
              type: 'quantitative'
            },
            color: {
              field: 'weather_type',
              type: 'nominal'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'x');

        expect(_domain).toEqual([
          {
            data: 'raw',
            field: 'month_date',
            sort: {...sortDef, op: 'sum'}
          }
        ]);
      });

      it('should return the right custom domain with DateTime objects', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'year',
              type: 'temporal',
              scale: {domain: [{year: 1970}, {year: 1980}]}
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([
          {signal: '{data: datetime(1970, 0, 1, 0, 0, 0, 0)}'},
          {signal: '{data: datetime(1980, 0, 1, 0, 0, 0, 0)}'}
        ]);
      });

      it('should return the right custom domain with single time unit', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              timeUnit: 'year',
              field: 'date',
              type: 'temporal',
              scale: {domain: [1970, {year: 1980}]}
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([
          {signal: '{data: datetime(1970, 0, 1, 0, 0, 0, 0)}'},
          {signal: '{data: datetime(1980, 0, 1, 0, 0, 0, 0)}'}
        ]);
      });

      it('should return the right custom domain with month', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              timeUnit: 'month',
              field: 'date',
              type: 'temporal',
              scale: {domain: [2134512352, 'February']}
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([
          {signal: '{data: datetime(2134512352)}'},
          {signal: '{data: datetime(2012, 1, 1, 0, 0, 0, 0)}'}
        ]);
      });

      it('should return the right custom domain with DateTime object and signal', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'year',
              type: 'temporal',
              scale: {domain: [{year: 1970}, {signal: 'a'}]}
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([{signal: '{data: datetime(1970, 0, 1, 0, 0, 0, 0)}'}, {signal: '{data: a}'}]);
      });

      it('should return the right custom domain with date strings', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'year',
              type: 'temporal',
              scale: {domain: ['Jan 1, 2007', 'Jan 1, 2009']}
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([
          {signal: `{data: datetime("Jan 1, 2007")}`},
          {signal: `{data: datetime("Jan 1, 2009")}`}
        ]);
      });

      it('should return the right custom domain when timeUnit is used', () => {
        const model = parseUnitModel({
          mark: 'point',
          encoding: {
            y: {
              field: 'year',
              type: 'temporal',
              scale: {domain: ['Jan 1, 2007', 'Jan 1, 2009']},
              timeUnit: 'yearmonthdate'
            }
          }
        });
        const _domain = testParseDomainForChannel(model, 'y');

        expect(_domain).toEqual([
          {signal: `{data: datetime("Jan 1, 2007")}`},
          {signal: `{data: datetime("Jan 1, 2009")}`}
        ]);
      });

      describe('for ordinal', () => {
        it('should have correct domain for binned ordinal color', () => {
          const model = parseUnitModel({
            mark: 'bar',
            encoding: {
              color: {field: 'a', bin: true, type: 'ordinal'}
            }
          });

          const xDomain = testParseDomainForChannel(model, 'color');
          expect(xDomain).toEqual([
            {data: 'main', field: 'bin_maxbins_6_a_range', sort: {field: 'bin_maxbins_6_a', op: 'min'}}
          ]);
        });
      });

      describe('for nominal', () => {
        it('should return correct domain with the provided sort property', () => {
          const sortDef: EncodingSortField<string> = {op: 'min', field: 'Acceleration'};
          const model = parseUnitModel({
            mark: 'point',
            encoding: {
              y: {field: 'origin', type: 'nominal', sort: sortDef}
            }
          });
          expect(testParseDomainForChannel(model, 'y')).toEqual([
            {
              data: 'raw',
              field: 'origin',
              sort: sortDef
            }
          ]);
        });

        it('should return correct domain with the provided sort property with order property', () => {
          const sortDef: EncodingSortField<string> = {op: 'min', field: 'Acceleration', order: 'descending'};
          const model = parseUnitModel({
            mark: 'point',
            encoding: {
              y: {field: 'origin', type: 'nominal', sort: sortDef}
            }
          });

          expect(testParseDomainForChannel(model, 'y')).toEqual([
            {
              data: 'raw',
              field: 'origin',
              sort: sortDef
            }
          ]);
        });

        it('should return correct domain without sort if sort is not provided', () => {
          const model = parseUnitModel({
            mark: 'point',
            encoding: {
              y: {field: 'origin', type: 'nominal'}
            }
          });

          expect(testParseDomainForChannel(model, 'y')).toEqual([
            {
              data: 'main',
              field: 'origin',
              sort: true
            }
          ]);
        });
      });
    });
  });

  describe('mergeDomains()', () => {
    it('should merge the same domains', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: {field: 'b', op: 'mean'}
        },
        {
          data: 'foo',
          field: 'a',
          sort: {field: 'b', op: 'mean'}
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        field: 'a',
        sort: {field: 'b', op: 'mean'}
      });
    });

    it('should drop field if op is count', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: {op: 'count', field: 'b'}
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        field: 'a',
        sort: {op: 'count'}
      });
    });

    it('should sort the output domain if one domain is sorted', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a'
        },
        {
          data: 'foo',
          field: 'a',
          sort: {field: 'b', op: 'mean', order: 'descending'}
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        field: 'a',
        sort: {field: 'b', op: 'mean', order: 'descending'}
      });
    });

    it('should sort the output domain if one domain is sorted with true', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: true
        },
        {
          data: 'foo',
          field: 'b'
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        fields: ['a', 'b'],
        sort: true
      });
    });

    it('should not sort if no domain is sorted', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a'
        },
        {
          data: 'foo',
          field: 'b'
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        fields: ['a', 'b']
      });
    });

    it('should ignore order ascending as it is the default', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: {field: 'b', op: 'mean', order: 'ascending'}
        },
        {
          data: 'foo',
          field: 'a',
          sort: {field: 'b', op: 'mean'}
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        field: 'a',
        sort: {field: 'b', op: 'mean'}
      });
    });

    it('should merge domains with the same data', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a'
        },
        {
          data: 'foo',
          field: 'a'
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        field: 'a'
      });
    });

    it('should merge domains with the same data source', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a'
        },
        {
          data: 'foo',
          field: 'b'
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        fields: ['a', 'b']
      });
    });

    it('should merge domains with different data source', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: true
        },
        {
          data: 'bar',
          field: 'a',
          sort: true
        }
      ]);

      expect(domain).toEqual({
        fields: [
          {
            data: 'foo',
            field: 'a'
          },
          {
            data: 'bar',
            field: 'a'
          }
        ],
        sort: true
      });
    });

    it('should merge domains with different data and sort by count', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: {
            op: 'count'
          }
        },
        {
          data: 'bar',
          field: 'a'
        }
      ]);

      expect(domain).toEqual({
        fields: [
          {
            data: 'foo',
            field: 'a'
          },
          {
            data: 'bar',
            field: 'a'
          }
        ],
        sort: {
          op: 'count'
        }
      });
    });

    it('should merge domains with different data and no sort op', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a'
        },
        {
          data: 'bar',
          field: 'a'
        }
      ]);

      expect(domain).toEqual({
        fields: [
          {
            data: 'foo',
            field: 'a'
          },
          {
            data: 'bar',
            field: 'a'
          }
        ]
      });
    });

    it('should merge domains with different data and sort by min or max', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: {
            op: 'min',
            field: 'b'
          }
        },
        {
          data: 'bar',
          field: 'a'
        }
      ]);

      expect(domain).toEqual({
        fields: [
          {
            data: 'foo',
            field: 'a'
          },
          {
            data: 'bar',
            field: 'a'
          }
        ],
        sort: {
          op: 'min',
          field: 'b'
        }
      });
    });

    it('should merge domains with the same and different data', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a'
        },
        {
          data: 'foo',
          field: 'b'
        },
        {
          data: 'bar',
          field: 'a'
        }
      ]);

      expect(domain).toEqual({
        fields: [
          {
            data: 'foo',
            field: 'a'
          },
          {
            data: 'foo',
            field: 'b'
          },
          {
            data: 'bar',
            field: 'a'
          }
        ]
      });
    });

    it('should merge signal domains', () => {
      const domain = mergeDomains([
        {
          signal: 'foo'
        },
        {
          data: 'bar',
          field: 'a'
        }
      ]);

      expect(domain).toEqual({
        fields: [
          {
            signal: 'foo'
          },
          {
            data: 'bar',
            field: 'a'
          }
        ]
      });
    });

    it(
      'should warn if sorts conflict',
      log.wrap(localLogger => {
        const domain = mergeDomains([
          {
            data: 'foo',
            field: 'a',
            sort: {
              op: 'count'
            }
          },
          {
            data: 'foo',
            field: 'b',
            sort: true
          }
        ]);

        expect(domain).toEqual({
          data: 'foo',
          fields: ['a', 'b'],
          sort: true
        });

        expect(localLogger.warns[0]).toEqual(log.message.MORE_THAN_ONE_SORT);
      })
    );

    it(
      'should warn if sorts conflict even if we do not union',
      log.wrap(localLogger => {
        const domain = mergeDomains([
          {
            data: 'foo',
            field: 'a',
            sort: {
              op: 'count'
            }
          },
          {
            data: 'foo',
            field: 'a',
            sort: true
          }
        ]);

        expect(domain).toEqual({
          data: 'foo',
          field: 'a',
          sort: true
        });

        expect(localLogger.warns[0]).toEqual(log.message.MORE_THAN_ONE_SORT);
      })
    );

    it(
      'should warn if we had to drop complex sort',
      log.wrap(localLogger => {
        const domain = mergeDomains([
          {
            data: 'foo',
            field: 'a',
            sort: {
              op: 'mean',
              field: 'c'
            }
          },
          {
            data: 'foo',
            field: 'b'
          }
        ]);

        expect(domain).toEqual({
          data: 'foo',
          fields: ['a', 'b'],
          sort: true
        });

        expect(localLogger.warns[0]).toEqual(
          log.message.domainSortDropped({
            op: 'mean',
            field: 'c'
          })
        );
      })
    );

    it('should not sort explicit domains', () => {
      const domain = mergeDomains([
        [1, 2, 3, 4],
        [3, 4, 5, 6]
      ]);

      expect(domain).toEqual({
        fields: [
          [1, 2, 3, 4],
          [3, 4, 5, 6]
        ]
      });
    });

    it('should return single explicit domain', () => {
      const domain = mergeDomains([[1, 2, 3, 4]]);

      expect(domain).toEqual([1, 2, 3, 4]);
    });

    it('should simplify sort', () => {
      const domain = mergeDomains([
        {
          data: 'foo',
          field: 'a',
          sort: {
            field: 'a',
            op: 'min',
            order: 'descending'
          }
        }
      ]);

      expect(domain).toEqual({
        data: 'foo',
        field: 'a',
        sort: {
          order: 'descending'
        }
      });
    });
  });

  describe('domainSort()', () => {
    it('should return undefined for continuous domain', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'}
        }
      });
      const sort = domainSort(model, 'x', ScaleType.LINEAR);
      expect(sort).toBeUndefined();
    });

    it('should sort stacked groupby dimension', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal'},
          color: {field: 'c', type: 'quantitative'}
        }
      });
      const sort = domainSort(model, 'y', ScaleType.BAND);
      expect(sort).toBe(true);
    });

    it('should use sum aggregation for stacked measure', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal', sort: 'x'},
          color: {field: 'c', type: 'quantitative'}
        }
      });
      const sort = domainSort(model, 'y', ScaleType.BAND);
      expect(sort).toEqual({field: 'a', op: 'sum'});
    });

    it('should use min aggregation for stacked dimension', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          y: {field: 'b', type: 'nominal', sort: 'color'},
          color: {field: 'c', type: 'quantitative'}
        }
      });
      const sort = domainSort(model, 'y', ScaleType.BAND);
      expect(sort).toEqual({field: 'c', op: 'min'});
    });

    it('should return true by default for discrete domain', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'}
        }
      });
      const sort = domainSort(model, 'x', ScaleType.ORDINAL);
      expect(sort).toBe(true);
    });

    it('should return true for ascending', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', sort: 'ascending'}
        }
      });
      const sort = domainSort(model, 'x', ScaleType.ORDINAL);
      expect(sort).toEqual(true);
    });

    it('should return undefined if sort = null', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'quantitative', sort: null}
        }
      });
      const sort = domainSort(model, 'x', ScaleType.ORDINAL);
      expect(sort).toBeUndefined();
    });

    it('should return normal sort spec if specified and aggregration is not count', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'nominal', sort: {op: 'sum', field: 'y'}},
          y: {field: 'b', aggregate: 'sum', type: 'quantitative'}
        }
      });
      const sort = domainSort(model, 'x', ScaleType.ORDINAL);
      expect(sort).toEqual({op: 'sum', field: 'y'});
    });

    it('should return normal sort spec if aggregration is count and field not specified', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'nominal', sort: {op: 'count'}},
          y: {field: 'b', aggregate: 'sum', type: 'quantitative'}
        }
      });
      const sort = domainSort(model, 'x', ScaleType.ORDINAL);
      expect(sort).toEqual({op: 'count'});
    });

    it('should return true if sort is not specified', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'nominal'},
          y: {field: 'b', aggregate: 'sum', type: 'quantitative'}
        }
      });
      const sort = domainSort(model, 'x', ScaleType.ORDINAL);
      expect(sort).toEqual(true);
    });

    it('should return sort if it is specified', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'nominal', sort: 'descending'},
          y: {field: 'b', aggregate: 'sum', type: 'quantitative'}
        }
      });
      expect(domainSort(model, 'x', ScaleType.ORDINAL)).toEqual({
        op: 'min',
        field: 'a',
        order: 'descending'
      });
    });

    it('should return sort spec using derived sort index', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'ordinal', sort: ['B', 'A', 'C']},
          y: {field: 'b', type: 'quantitative'}
        }
      });
      expect(domainSort(model, 'x', ScaleType.ORDINAL)).toEqual({
        op: 'min',
        field: 'x_a_sort_index',
        order: 'ascending'
      });
    });

    it('should return sort with flattened field access', () => {
      const model = parseUnitModel({
        mark: 'bar',
        encoding: {
          x: {field: 'a', type: 'ordinal', sort: {field: 'foo.bar', op: 'mean'}}
        }
      });
      expect(domainSort(model, 'x', ScaleType.ORDINAL)).toEqual({op: 'mean', field: 'foo\\.bar'});
    });
  });
});

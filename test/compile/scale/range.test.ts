import {
  defaultContinuousToDiscreteCount,
  interpolateRange,
  MAX_SIZE_RANGE_STEP_RATIO,
  parseRangeForChannel
} from '../../../src/compile/scale/range';
import {makeExplicit, makeImplicit} from '../../../src/compile/split';
import {Config, defaultConfig, DEFAULT_STEP} from '../../../src/config';
import * as log from '../../../src/log';
import {Mark} from '../../../src/mark';
import {QUANTITATIVE_SCALES, ScaleType} from '../../../src/scale';
import {parseUnitModelWithScaleExceptRange} from '../../util';

describe('compile/scale', () => {
  describe('parseRange()', () => {
    describe('position', () => {
      it('should return [0, width] / [height, 0] for x/y-continuous scales by default.', () => {
        for (const scaleType of QUANTITATIVE_SCALES) {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'point',
            encoding: {
              x: {field: 'x', type: 'quantitative', scale: {type: scaleType}},
              y: {field: 'y', type: 'quantitative', scale: {type: scaleType}}
            }
          });

          expect(parseRangeForChannel('x', model)).toEqual(makeImplicit([0, {signal: 'width'}]));

          expect(parseRangeForChannel('y', model)).toEqual(makeImplicit([{signal: 'height'}, 0]));
        }
      });

      it('should return [0, width] / [height, 0] for x/y-discrete scales with width/height by default.', () => {
        for (const scaleType of [ScaleType.BAND, ScaleType.POINT]) {
          const model = parseUnitModelWithScaleExceptRange({
            width: 200,
            height: 200,
            mark: 'point',
            encoding: {
              x: {field: 'x', type: 'nominal', scale: {type: scaleType}},
              y: {field: 'y', type: 'nominal', scale: {type: scaleType}}
            }
          });

          expect(parseRangeForChannel('x', model)).toEqual(makeImplicit([0, {signal: 'width'}]));

          expect(parseRangeForChannel('y', model)).toEqual(makeImplicit([0, {signal: 'height'}]));
        }
      });

      it('should return [0, width] / [height, 0] for x/y-discrete scales with numberic config.view.discreteWidth/Height', () => {
        for (const scaleType of [ScaleType.BAND, ScaleType.POINT]) {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'point',
            encoding: {
              x: {field: 'x', type: 'nominal', scale: {type: scaleType}},
              y: {field: 'y', type: 'nominal', scale: {type: scaleType}}
            },
            config: {
              view: {discreteWidth: 200, discreteHeight: 200}
            }
          });

          expect(parseRangeForChannel('x', model)).toEqual(makeImplicit([0, {signal: 'width'}]));

          expect(parseRangeForChannel('y', model)).toEqual(makeImplicit([0, {signal: 'height'}]));
        }
      });

      it('should return signal for width and height strings in range', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            x: {field: 'x', type: 'nominal', scale: {range: [40, 'width']}},
            y: {field: 'y', type: 'nominal', scale: {range: ['height', 40]}}
          }
        });

        expect(parseRangeForChannel('x', model)).toEqual(makeExplicit([40, {signal: 'width'}]));

        expect(parseRangeForChannel('y', model)).toEqual(makeExplicit([{signal: 'height'}, 40]));
      });

      it('should return step * stepCount when there is a nested offset', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'xSub', type: 'nominal'},
            y: {field: 'y', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('x', model)).toEqual(
          makeImplicit({step: {signal: "20 * domain('xOffset').length / (1-0.2)"}})
        );
      });

      it('should return step * bandspace when there is a nested offset with band scale', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'xSub', type: 'nominal'},
            y: {field: 'y', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('x', model)).toEqual(
          makeImplicit({step: {signal: "20 * bandspace(domain('xOffset').length, 0, 0) / (1-0.2)"}})
        );
      });

      it('should return [0, year duration] when there is a nested offset with year time scale', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'temporal', timeUnit: 'year'},
            xOffset: {field: 'xSub', type: 'nominal'},
            y: {field: 'y', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('xOffset', model)).toEqual(
          makeImplicit([
            0,
            {
              signal: "scale('x', datetime(2002, 0, 1, 0, 0, 0, 0)) - scale('x', datetime(2001, 0, 1, 0, 0, 0, 0))"
            }
          ])
        );
      });

      it('should return step * bandspace when there is a nested offset with band scale with custom padding', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'xSub', type: 'nominal', scale: {padding: 0.2}},
            y: {field: 'y', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('x', model)).toEqual(
          makeImplicit({step: {signal: "20 * bandspace(domain('xOffset').length, 0.2, 0.2) / (1-0.2)"}})
        );
      });

      it('should return step * bandspace when there is a nested offset with band scale with custom paddingInner and -Outer', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'xSub', type: 'nominal', scale: {paddingInner: 0.1, paddingOuter: 0.3}},
            y: {field: 'y', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('x', model)).toEqual(
          makeImplicit({step: {signal: "20 * bandspace(domain('xOffset').length, 0.1, 0.3) / (1-0.2)"}})
        );
      });

      it('should return config.view.discreteWidth for x/y-band/point scales by default.', () => {
        for (const scaleType of [ScaleType.BAND, ScaleType.POINT]) {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'point',
            encoding: {
              x: {field: 'x', type: 'nominal', scale: {type: scaleType}},
              y: {field: 'y', type: 'nominal', scale: {type: scaleType}}
            }
          });

          expect(parseRangeForChannel('x', model)).toEqual(makeImplicit({step: 20}));

          expect(parseRangeForChannel('y', model)).toEqual(makeImplicit({step: 20}));
        }
      });

      it('should return specified step for band/point scales', () => {
        for (const scaleType of [ScaleType.BAND, ScaleType.POINT]) {
          const model = parseUnitModelWithScaleExceptRange({
            width: {step: 23},
            height: {step: 24},
            mark: 'point',
            encoding: {
              x: {field: 'x', type: 'nominal', scale: {type: scaleType}},
              y: {field: 'y', type: 'nominal', scale: {type: scaleType}}
            }
          });

          expect(parseRangeForChannel('x', model)).toEqual(makeExplicit({step: 23}));

          expect(parseRangeForChannel('y', model)).toEqual(makeExplicit({step: 24}));
        }
      });

      it('should drop rangeStep for continuous scales', () => {
        for (const scaleType of QUANTITATIVE_SCALES) {
          log.wrap(localLogger => {
            const model = parseUnitModelWithScaleExceptRange({
              width: {step: 23},
              mark: 'point',
              encoding: {
                x: {field: 'x', type: 'quantitative', scale: {type: scaleType}}
              }
            });

            expect(parseRangeForChannel('x', model)).toEqual(makeImplicit([0, {signal: 'width'}]));
            expect(localLogger.warns[0]).toEqual(log.message.stepDropped('width'));
          })();
        }
      });
    });

    describe('xOffset', () => {
      it('returns [0, bandwidth] if x is band scale with fixed width', () => {
        const model = parseUnitModelWithScaleExceptRange({
          width: 500,
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'subx', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('xOffset', model)).toEqual(makeImplicit([0, {signal: "bandwidth('x')"}]));
      });
      it("returns [0, bandwidth('x')] if x has a fixed step for position", () => {
        const model = parseUnitModelWithScaleExceptRange({
          width: {step: 23, for: 'position'},
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'subx', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('xOffset', model)).toEqual(makeImplicit([0, {signal: "bandwidth('x')"}]));
      });

      it('returns step if x is band scale with fixed step with default for', () => {
        const model = parseUnitModelWithScaleExceptRange({
          width: {step: 23},
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'subx', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('xOffset', model)).toEqual(makeExplicit({step: 23}));
      });

      it('returns step if x is band scale with default step', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'subx', type: 'nominal'}
          },
          config: {
            view: {
              discreteWidth: {step: 23}
            }
          }
        });

        expect(parseRangeForChannel('xOffset', model)).toEqual(makeImplicit({step: 23}));
      });

      it('returns step if x is band scale with fixed step for offset', () => {
        const model = parseUnitModelWithScaleExceptRange({
          width: {step: 23, for: 'offset'},
          mark: 'bar',
          encoding: {
            x: {field: 'x', type: 'nominal'},
            xOffset: {field: 'subx', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('xOffset', model)).toEqual(makeExplicit({step: 23}));
      });
    });

    describe('color', () => {
      it('should support custom scheme.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'quantitative', scale: {scheme: 'viridis'}}
          }
        });

        expect(parseRangeForChannel('color', model)).toEqual(makeExplicit({scheme: 'viridis'}));
      });

      it('should use the specified scheme with extent for a nominal color field.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'quantitative', scale: {scheme: {name: 'warm', extent: [0.2, 1]}}}
          }
        });

        expect(parseRangeForChannel('color', model)).toEqual(makeExplicit({scheme: 'warm', extent: [0.2, 1]}));
      });

      it('should support custom range.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'nominal', scale: {range: ['red', 'blue']}}
          }
        });
        expect(parseRangeForChannel('color', model)).toEqual(makeExplicit(['red', 'blue']));
      });

      it('should support custom field range.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'nominal', scale: {range: {field: 'c'}}}
          }
        });
        expect(parseRangeForChannel('color', model)).toEqual(
          makeExplicit({
            data: 'main',
            field: 'c',
            sort: {op: 'min', field: 'x'}
          })
        );
      });

      it('should use default category range in Vega for a nominal color field.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'nominal'}
          }
        });

        expect(parseRangeForChannel('color', model)).toEqual(makeImplicit('category'));
      });

      it('should use default ordinal range in Vega for an ordinal color field.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'ordinal'}
          }
        });

        expect(parseRangeForChannel('color', model)).toEqual(makeImplicit('ordinal'));
      });

      it('should use default ramp range in Vega for a temporal/quantitative color field.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'quantitative'}
          }
        });

        expect(parseRangeForChannel('color', model)).toEqual(makeImplicit('ramp'));
      });

      it('should use default diverging range in Vega for a quantitative color field.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'quantitative', scale: {domainMid: 1}}
          }
        });

        expect(parseRangeForChannel('color', model)).toEqual(makeImplicit('diverging'));
      });

      it('should use the specified scheme with count for a quantitative color field.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            color: {field: 'x', type: 'quantitative', scale: {scheme: {name: 'viridis', count: 3}}}
          }
        });

        expect(parseRangeForChannel('color', model)).toEqual(makeExplicit({scheme: 'viridis', count: 3}));
      });

      it('should use default ramp range for quantile/quantize/threshold scales', () => {
        const scales: ScaleType[] = ['quantile', 'quantize', 'threshold'];
        scales.forEach(discretizingScale => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'point',
            encoding: {
              color: {field: 'x', type: 'quantitative', scale: {type: discretizingScale}}
            }
          });

          expect(parseRangeForChannel('color', model)).toEqual(makeImplicit('ramp'));
        });
      });
    });

    describe('opacity', () => {
      it("should use default opacityRange as opacity's scale range.", () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            opacity: {field: 'x', type: 'quantitative'}
          }
        });

        expect(parseRangeForChannel('opacity', model)).toEqual(
          makeImplicit([defaultConfig.scale.minOpacity, defaultConfig.scale.maxOpacity])
        );
      });
    });

    describe('angle', () => {
      it('should use default angle.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            angle: {field: 'x', type: 'quantitative'}
          }
        });

        expect(parseRangeForChannel('angle', model)).toEqual(makeImplicit([0, 360]));
      });
      it('should use default rangeMin if specified.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            angle: {field: 'x', type: 'quantitative', scale: {rangeMin: 20}}
          }
        });

        expect(parseRangeForChannel('angle', model)).toEqual(makeExplicit([20, 360]));
      });
      it('should use default rangeMax if specified.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            angle: {field: 'x', type: 'quantitative', scale: {rangeMax: 90}}
          }
        });

        expect(parseRangeForChannel('angle', model)).toEqual(makeExplicit([0, 90]));
      });
    });

    describe('radius', () => {
      it('should use default radius.', () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'text',
          encoding: {
            radius: {field: 'x', type: 'quantitative'}
          }
        });
        const r = parseRangeForChannel('radius', model);
        expect(r.value[0]).toBe(0);
        expect(r.value[1]).toEqual({signal: 'min(width,height)/2'});
      });
    });

    describe('size', () => {
      describe('bar', () => {
        it('should return [minBandSize, maxBandSize] from config.bar when zero is excluded if both are specified', () => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'bar',
            encoding: {
              size: {field: 'x', type: 'quantitative', scale: {zero: false}}
            },
            config: {
              scale: {minBandSize: 2, maxBandSize: 9}
            }
          });

          expect(parseRangeForChannel('size', model)).toEqual(makeImplicit([2, 9]));
        });

        it('returns formula signal if zero is signal', () => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'bar',
            encoding: {
              size: {field: 'x', type: 'quantitative', scale: {zero: {signal: 'a'}}}
            },
            config: {
              scale: {minBandSize: 2, maxBandSize: 9}
            }
          });

          expect(parseRangeForChannel('size', model)).toEqual(makeImplicit([{signal: 'a ? 0 : 2'}, 9]));
        });

        it('should return [continuousBandSize, xRangeStep-1] when zero is excluded by default since min/maxSize config are not specified', () => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'bar',
            encoding: {
              size: {field: 'x', type: 'quantitative', scale: {zero: false}}
            }
          });

          expect(parseRangeForChannel('size', model)).toEqual(makeImplicit([2, DEFAULT_STEP - 1]));
        });
      });

      describe('tick', () => {
        it('should return [minBandSize, maxBandSize] when zero is excluded if both are specified', () => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'tick',
            encoding: {
              size: {field: 'x', type: 'quantitative', scale: {zero: false}}
            },
            config: {
              scale: {minBandSize: 2, maxBandSize: 9}
            }
          });

          expect(parseRangeForChannel('size', model)).toEqual(makeImplicit([2, 9]));
        });

        it('should return [(default)minBandSize, step-1] when zero is excluded by default since maxSize config is not specified', () => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'tick',
            encoding: {
              size: {field: 'x', type: 'quantitative', scale: {zero: false}}
            }
          });

          expect(parseRangeForChannel('size', model)).toEqual(makeImplicit([2, DEFAULT_STEP - 1]));
        });
      });

      describe('text', () => {
        it('should return [minFontSize, maxFontSize] when zero is excluded', () => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'text',
            encoding: {
              size: {field: 'x', type: 'quantitative', scale: {zero: false}}
            }
          });

          expect(parseRangeForChannel('size', model)).toEqual(
            makeImplicit([defaultConfig.scale.minFontSize, defaultConfig.scale.maxFontSize])
          );
        });
      });

      describe('rule', () => {
        it('should return [minStrokeWidth, maxStrokeWidth] when zero is excluded', () => {
          const model = parseUnitModelWithScaleExceptRange({
            mark: 'rule',
            encoding: {
              size: {field: 'x', type: 'quantitative', scale: {zero: false}}
            }
          });

          expect(parseRangeForChannel('size', model)).toEqual(
            makeImplicit([defaultConfig.scale.minStrokeWidth, defaultConfig.scale.maxStrokeWidth])
          );
        });
      });

      describe('point, square, circle', () => {
        it('should return [minSize, maxSize] when zero is excluded', () => {
          for (const mark of ['point', 'square', 'circle'] as Mark[]) {
            const model = parseUnitModelWithScaleExceptRange({
              mark,
              encoding: {
                size: {field: 'x', type: 'quantitative', scale: {zero: false}}
              },
              config: {
                scale: {
                  minSize: 5,
                  maxSize: 25
                }
              }
            });

            expect(parseRangeForChannel('size', model)).toEqual(makeImplicit([5, 25]));
          }
        });

        it('should return [0, maxSize] when zero is included', () => {
          for (const mark of ['point', 'square', 'circle'] as Mark[]) {
            const model = parseUnitModelWithScaleExceptRange({
              mark,
              encoding: {
                size: {field: 'x', type: 'quantitative'}
              },
              config: {
                scale: {
                  minSize: 5,
                  maxSize: 25
                }
              }
            });

            expect(parseRangeForChannel('size', model)).toEqual(makeImplicit([0, 25]));
          }
        });

        it('should return [0, (minBandSize-2)^2] if both x and y are discrete and size is quantitative (thus use zero=true, by default)', () => {
          for (const mark of ['point', 'square', 'circle'] as Mark[]) {
            const model = parseUnitModelWithScaleExceptRange({
              width: {step: 11},
              height: {step: 13},
              mark,
              encoding: {
                x: {field: 'x', type: 'nominal'},
                y: {field: 'y', type: 'nominal'},
                size: {field: 'x', type: 'quantitative'}
              }
            });
            expect(parseRangeForChannel('size', model)).toEqual(
              makeImplicit([0, MAX_SIZE_RANGE_STEP_RATIO * 11 * MAX_SIZE_RANGE_STEP_RATIO * 11])
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is not quantitative (thus use zero=false, by default)', () => {
          for (const mark of ['point', 'square', 'circle'] as Mark[]) {
            const model = parseUnitModelWithScaleExceptRange({
              width: {step: 11},
              height: {step: 13},
              mark,
              encoding: {
                x: {field: 'x', type: 'nominal'},
                y: {field: 'y', type: 'nominal'},
                size: {field: 'x', type: 'ordinal'}
              }
            });
            expect(parseRangeForChannel('size', model)).toEqual(
              makeImplicit([9, MAX_SIZE_RANGE_STEP_RATIO * 11 * MAX_SIZE_RANGE_STEP_RATIO * 11])
            );
          }
        });

        it('should return [9, (minBandSize-2)^2] if both x and y are discrete and size is quantitative but use zero=false', () => {
          for (const mark of ['point', 'square', 'circle'] as Mark[]) {
            const model = parseUnitModelWithScaleExceptRange({
              width: {step: 11},
              height: {step: 13},
              mark,
              encoding: {
                x: {field: 'x', type: 'nominal'},
                y: {field: 'y', type: 'nominal'},
                size: {field: 'x', type: 'quantitative', scale: {zero: false}}
              }
            });
            expect(parseRangeForChannel('size', model)).toEqual(
              makeImplicit([9, MAX_SIZE_RANGE_STEP_RATIO * 11 * MAX_SIZE_RANGE_STEP_RATIO * 11])
            );
          }
        });

        it('should return [0, (xRangeStep-2)^2] if x is discrete and y is continuous and size is quantitative (thus use zero=true, by default)', () => {
          for (const mark of ['point', 'square', 'circle'] as Mark[]) {
            const model = parseUnitModelWithScaleExceptRange({
              width: {step: 11},
              mark,
              encoding: {
                x: {field: 'x', type: 'nominal'},
                y: {field: 'y', type: 'quantitative'},
                size: {field: 'x', type: 'quantitative'}
              }
            });
            expect(parseRangeForChannel('size', model)).toEqual(
              makeImplicit([0, MAX_SIZE_RANGE_STEP_RATIO * 11 * MAX_SIZE_RANGE_STEP_RATIO * 11])
            );
          }
        });

        it('should return signal to calculate appropriate size if x is discrete and y is binned continuous and size is quantitative', () => {
          for (const mark of ['point', 'square', 'circle'] as Mark[]) {
            const model = parseUnitModelWithScaleExceptRange({
              width: {step: 11},
              mark,
              encoding: {
                x: {field: 'x', type: 'nominal'},
                y: {bin: true, field: 'y', type: 'quantitative'},
                size: {field: 'x', type: 'quantitative'}
              }
            });
            expect(parseRangeForChannel('size', model)).toEqual(
              makeImplicit([
                0,
                {
                  signal:
                    'pow(0.95 * min(11, height / ((bin_maxbins_10_y_bins.stop - bin_maxbins_10_y_bins.start) / bin_maxbins_10_y_bins.step)), 2)'
                }
              ])
            );
          }
        });

        it('should return range interpolation of length 4 for quantile/quantize scales', () => {
          const scales: ScaleType[] = ['quantile', 'quantize'];
          scales.forEach(type => {
            const model = parseUnitModelWithScaleExceptRange({
              mark: 'point',
              encoding: {
                size: {field: 'x', type: 'quantitative', scale: {type}}
              }
            });
            expect(parseRangeForChannel('size', model)).toEqual(
              makeImplicit({signal: 'sequence(9, 361 + (361 - 9) / (4 - 1), (361 - 9) / (4 - 1))'})
            );
          });
        });

        it(
          'should return range interpolation of length 4 for threshold scale',
          log.wrap(localLogger => {
            const model = parseUnitModelWithScaleExceptRange({
              mark: 'point',
              encoding: {
                size: {field: 'x', type: 'quantitative', scale: {type: 'threshold'}}
              }
            });
            expect(parseRangeForChannel('size', model)).toEqual(
              makeImplicit({signal: 'sequence(9, 361 + (361 - 9) / (3 - 1), (361 - 9) / (3 - 1))'})
            );
            expect(localLogger.warns[0]).toEqual(log.message.domainRequiredForThresholdScale('size'));
          })
        );
      });
    });

    describe('shape', () => {
      it("should use default symbol range in Vega as shape's scale range.", () => {
        const model = parseUnitModelWithScaleExceptRange({
          mark: 'point',
          encoding: {
            shape: {field: 'x', type: 'nominal'}
          }
        });
        expect(parseRangeForChannel('shape', model)).toEqual(makeImplicit('symbol'));
      });
    });
  });

  describe('defaultContinuousToDiscreteCount', () => {
    it('should use config.scale.quantileCount for quantile scale', () => {
      const config: Config = {
        scale: {
          quantileCount: 4
        }
      };
      expect(defaultContinuousToDiscreteCount('quantile', config, undefined, 'x')).toBe(4);
    });

    it('should use config.scale.quantizeCount for quantize scale', () => {
      const config: Config = {
        scale: {
          quantizeCount: 4
        }
      };
      expect(defaultContinuousToDiscreteCount('quantize', config, undefined, 'x')).toBe(4);
    });

    it('should use domain size for threshold scale', () => {
      expect(defaultContinuousToDiscreteCount('threshold', {}, [1, 10], 'x')).toBe(3);
    });

    it('should throw warning and default to 4 for scale without domain', () => {
      log.wrap(localLogger => {
        expect(defaultContinuousToDiscreteCount('quantize', {}, undefined, 'x')).toBe(4);
        expect(localLogger.warns[0]).toEqual(log.message.domainRequiredForThresholdScale('x'));
      });
    });
  });

  describe('interpolateRange', () => {
    it('should return the correct interpolation of 1 - 100 with cardinality of 5', () => {
      expect(interpolateRange(0, 100, 5).signal).toBe('sequence(0, 100 + (100 - 0) / (5 - 1), (100 - 0) / (5 - 1))');
    });
  });
});

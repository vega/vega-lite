'use strict';

var d3 = require('d3');
var expect = require('chai').expect;

var util = require('../../src/util'),
  Encoding = require('../../src/Encoding').default,
  vlscale = require('../../src/compiler/scale'),
  colorbrewer = require('colorbrewer');

var consts = require('../../src/consts');

var Q = consts.Type.Q;
var O = consts.Type.O;
var T = consts.Type.T;
var SOURCE = consts.SOURCE;
var SUMMARY = consts.SUMMARY;

describe('vl.compile.scale', function() {
  describe('domain()', function() {
    describe('for stack', function() {
      it('should return correct stack', function() {
        var domain = vlscale.domain(Encoding.fromSpec({
          marktype: 'bar',
          encoding: {
            y: {
              aggregate: 'sum',
              name: 'origin'
            },
            x: {name: 'x', type: 'O'},
            color: {name: 'color', type: 'O'}
          }
        }), 'y', 'linear', {}, true);

        expect(domain).to.eql({
          data: 'stacked',
          field: 'max_sum_sum_origin'
        });
      });

      it('should return correct aggregated stack', function() {
        var domain = vlscale.domain(Encoding.fromSpec({
          marktype: 'bar',
          encoding: {
            y: {
              aggregate: 'sum',
              name: 'origin'
            },
            x: {name: 'x', type: 'O'},
            color: {name: 'color', type: 'O'}
          }
        }), 'y', 'linear', {}, true);

        expect(domain).to.eql({
          data: 'stacked',
          field: 'max_sum_sum_origin'
        });
      });
    });

    describe('for quantitative', function() {
      it('should return the right domain if binned Q',
        function() {
          var domain = vlscale.domain(Encoding.fromSpec({
            encoding: {
              y: {
                bin: {maxbins: 15},
                name: 'origin',
                scale: {useRawDomain: true},
                type: Q
              }
            }
          }), 'y', 'ordinal', {origin: {min: -5, max:48}}, {});

          expect(domain).to.eql({
            data: SOURCE,
            field: ['bin_origin_start', 'bin_origin_end']
          });
        });

      it('should return the raw domain if useRawDomain is true for non-bin, non-sum Q',
        function() {
          var domain = vlscale.domain(Encoding.fromSpec({
            encoding: {
              y: {
                aggregate: 'mean',
                name: 'origin',
                scale: {useRawDomain: true},
                type: Q
              }
            }
          }), 'y', 'linear', {}, {});

          expect(domain.data).to.eql(SOURCE);
        });

      it('should return the aggregate domain for sum Q',
        function() {
          var domain = vlscale.domain(Encoding.fromSpec({
            encoding: {
              y: {
                aggregate: 'sum',
                name: 'origin',
                scale: {useRawDomain: true},
                type: Q
              }
            }
          }), 'y', 'linear', {}, {});

          expect(domain.data).to.eql(SUMMARY);
        });


      it('should return the aggregated domain if useRawDomain is false', function() {
          var domain = vlscale.domain(Encoding.fromSpec({
            encoding: {
              y: {
                aggregate: 'min',
                name: 'origin',
                scale: {useRawDomain: false},
                type: Q
              }
            }
          }), 'y', 'linear', {}, {});

          expect(domain.data).to.eql(SUMMARY);
        });
    });

    describe('for time', function() {
      it('should return the raw domain if useRawDomain is true for raw T',
        function() {
          var domain = vlscale.domain(Encoding.fromSpec({
            encoding: {
              y: {
                name: 'origin',
                scale: {useRawDomain: true},
                type: T
              }
            }
          }), 'y', 'time', {}, {});

          expect(domain.data).to.eql(SOURCE);
        });

      it('should return the raw domain if useRawDomain is true for year T',
        function() {
          var domain = vlscale.domain(Encoding.fromSpec({
            encoding: {
              y: {
                name: 'origin',
                scale: {useRawDomain: true},
                type: T,
                timeUnit: 'year'
              }
            }
          }), 'y', 'ordinal', {}, {});

          expect(domain.data).to.eql(SOURCE);
          expect(domain.field.indexOf('year')).to.gt(-1);
        });

      it('should return the correct domain for month T',
        function() {
          var domain = vlscale.domain(Encoding.fromSpec({
            encoding: {
              y: {
                name: 'origin',
                scale: {useRawDomain: true},
                type: T,
                timeUnit: 'month'
              }
            }
          }), 'y', 'ordinal', {}, {});

          expect(domain).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
        });
    });

    describe('for ordinal', function() {
      it('should return correct domain with the provided sort property', function() {
        var sortDef = {op: 'min', field:'Acceleration'};
        var encoding = Encoding.fromSpec({
            encoding: {
              y: { name: 'origin', type: O, sort: sortDef}
            }
          });

        expect(vlscale.domain(encoding, 'y', 'ordinal'))
          .to.eql({
            data: SOURCE,
            field: 'origin',
            sort: sortDef
          });
      });

      it('should return correct domain without sort if sort is not provided', function() {
        var encoding = Encoding.fromSpec({
            encoding: {
              y: { name: 'origin', type: O}
            }
          });

        expect(vlscale.domain(encoding, 'y', 'ordinal'))
          .to.eql({
            data: SOURCE,
            field: 'origin',
            sort: true
          });
      });
    });
  });

  describe('color.palette', function() {
    it('should return tableau categories', function() {
      expect(vlscale.colors.palette('category10k')).to.eql(
        ['#2ca02c', '#e377c2', '#7f7f7f', '#17becf', '#8c564b', '#d62728', '#bcbd22',
          '#9467bd', '#ff7f0e', '#1f77b4'
        ]
      );
    });

    it('should return pre-defined brewer palette if low cardinality', function() {
      var brewerPalettes = util.keys(colorbrewer);
      brewerPalettes.forEach(function(palette) {
        util.range(3, 9).forEach(function(cardinality) {
          expect(vlscale.colors.palette(palette, cardinality)).to.eql(
            colorbrewer[palette][cardinality]
          );
        });
      });
    });

    it('should return pre-defined brewer palette if high cardinality N', function() {
      var brewerPalettes = util.keys(colorbrewer);
      brewerPalettes.forEach(function(palette) {
        var cardinality = 20;
        expect(vlscale.colors.palette(palette, cardinality, 'N')).to.eql(
          colorbrewer[palette][Math.max.apply(null, util.keys(colorbrewer[palette]))]
        );
      });
    });

    it('should return interpolated scale if high cardinality ordinal', function() {
      var brewerPalettes = util.keys(colorbrewer);
      brewerPalettes.forEach(function(palette) {
        var cardinality = 20,
          p = colorbrewer[palette],
          ps = Math.max.apply(null, util.keys(p)),
          interpolator = d3.interpolateHsl(p[ps][0], p[ps][ps - 1]);
        expect(vlscale.colors.palette(palette, cardinality, 'O')).to.eql(
          util.range(cardinality).map(function(i) {
            return interpolator(i * 1.0 / (cardinality - 1));
          })
        );
      });
    });
  });

  describe('color.interpolate', function() {
    it('should interpolate color along the hsl space', function() {
      var interpolator = d3.interpolateHsl('#ffffff', '#000000'),
        cardinality = 8;

      expect(vlscale.colors.interpolate('#ffffff', '#000000', cardinality))
        .to.eql(
          util.range(cardinality).map(function(i) {
            return interpolator(i * 1.0 / (cardinality - 1));
          })
        );
    });
  });
});

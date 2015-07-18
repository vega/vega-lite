'use strict';

var d3 = require('d3');
var expect = require('chai').expect;

var util = require('../../src/util'),
  Encoding = require('../../src/Encoding'),
  vlscale = require('../../src/compiler/scale'),
  colorbrewer = require('colorbrewer');

describe('vl.compile.scale', function() {
  describe('sort()', function() {
    it('should return true for any ordinal or binned field', function() {
      var encoding = Encoding.fromSpec({
          encoding: {
            x: { name: 'origin', type: O},
            y: { bin: true, name: 'origin', type: Q}
          }
        });

      expect(vlscale.sort({type: 'ordinal'}, encoding, 'x'))
        .to.eql(true);
      expect(vlscale.sort({type: 'ordinal'}, encoding, 'y'))
        .to.eql(true);
    });

  });

  describe('domain()', function() {
    var sortingReturn = 'sorted',
      sorting = {
        getDataset: function() {return 'sorted';}
      };

    it('should return correct stack', function() {
      var domain = vlscale.domain('y', Encoding.fromSpec({
        encoding: {
          y: {
            name: 'origin'
          }
        }
      }), {}, {
        stack: 'y',
        facet: true
      });

      expect(domain).to.eql({
        data: 'stacked',
        field: 'data.max_sum_origin'
      });
    });

    it('should return correct aggregated stack', function() {
      var domain = vlscale.domain('y', Encoding.fromSpec({
        encoding: {
          y: {
            aggregate: 'sum',
            name: 'origin'
          }
        }
      }), {}, {
        stack: 'y',
        facet: true
      });

      expect(domain).to.eql({
        data: 'stacked',
        field: 'data.max_sum_sum_origin'
      });
    });

    it('should return the right domain if binned Q',
      function() {
        var domain = vlscale.domain('y', Encoding.fromSpec({
          encoding: {
            y: {
              bin: true,
              name: 'origin',
              scale: {useRawDomain: true},
              type: Q
            }
          }
        }), sorting, {});

        expect(domain.data).to.eql(sortingReturn);
      });

    it('should return the raw domain if useRawDomain is true for non-bin, non-sum Q',
      function() {
        var domain = vlscale.domain('y', Encoding.fromSpec({
          encoding: {
            y: {
              aggregate: 'mean',
              name: 'origin',
              scale: {useRawDomain: true},
              type: Q
            }
          }
        }), {}, {});

        expect(domain.data).to.eql(RAW);
      });

    it('should return the aggregate domain for sum Q',
      function() {
        var domain = vlscale.domain('y', Encoding.fromSpec({
          encoding: {
            y: {
              aggregate: 'sum',
              name: 'origin',
              scale: {useRawDomain: true},
              type: Q
            }
          }
        }), sorting, {});

        expect(domain.data).to.eql(sortingReturn);
      });

    it('should return the raw domain if useRawDomain is true for raw T',
      function() {
        var domain = vlscale.domain('y', Encoding.fromSpec({
          encoding: {
            y: {
              name: 'origin',
              scale: {useRawDomain: true},
              type: T
            }
          }
        }), {}, {});

        expect(domain.data).to.eql(RAW);
      });

    it('should return the raw domain if useRawDomain is true for year T',
      function() {
        var domain = vlscale.domain('y', Encoding.fromSpec({
          encoding: {
            y: {
              name: 'origin',
              scale: {useRawDomain: true},
              type: T,
              timeUnit: 'year'
            }
          }
        }), {}, {});

        expect(domain.data).to.eql(RAW);
      });

    it('should return the correct domain for month T',
      function() {
        var domain = vlscale.domain('y', Encoding.fromSpec({
          encoding: {
            y: {
              name: 'origin',
              scale: {useRawDomain: true},
              type: T,
              timeUnit: 'month'
            }
          }
        }), sorting, {});

        expect(domain).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      });

    it('should return the aggregated domain if useRawDomain is false', function() {
      var domain = vlscale.domain('y', Encoding.fromSpec({
        encoding: {
          y: {
            aggregate: 'min',
            name: 'origin',
            scale: {useRawDomain: false},
            type: Q
          }
        }
      }), sorting, {});

      expect(domain.data).to.eql(sortingReturn);
    });

    // TODO test other cases
  });

  describe('color.palette', function() {
    it('should return tableau categories', function() {
      expect(vlscale.color.palette('category10k')).to.eql(
        ['#2ca02c', '#e377c2', '#7f7f7f', '#17becf', '#8c564b', '#d62728', '#bcbd22',
          '#9467bd', '#ff7f0e', '#1f77b4'
        ]
      );
    });

    it('should return pre-defined brewer palette if low cardinality', function() {
      var brewerPalettes = util.keys(colorbrewer);
      brewerPalettes.forEach(function(palette) {
        util.range(3, 9).forEach(function(cardinality) {
          expect(vlscale.color.palette(palette, cardinality)).to.eql(
            colorbrewer[palette][cardinality]
          );
        });
      });
    });

    it('should return pre-defined brewer palette if high cardinality N', function() {
      var brewerPalettes = util.keys(colorbrewer);
      brewerPalettes.forEach(function(palette) {
        var cardinality = 20;
        expect(vlscale.color.palette(palette, cardinality, 'N')).to.eql(
          colorbrewer[palette][Math.max.apply(null, util.keys(colorbrewer[palette]))]
        );
      });
    });

    it('should return interpolated scale if high cardinality ordinal', function() {
      var brewerPalettes = util.keys(colorbrewer);
      brewerPalettes.forEach(function(palette) {
        var cardinality = 20,
          ps = 5,
          p = colorbrewer[palette],
          interpolator = d3.interpolateLab(p[ps][0], p[ps][ps - 1]);
        expect(vlscale.color.palette(palette, cardinality, 'O')).to.eql(
          util.range(cardinality).map(function(i) {
            return interpolator(i * 1.0 / (cardinality - 1));
          })
        );
      });
    });
  });

  describe('color.interpolate', function() {
    it('should interpolate color along the lab space', function() {
      var interpolator = d3.interpolateLab('#ffffff', '#000000'),
        cardinality = 8;

      expect(vlscale.color.interpolate('#ffffff', '#000000', cardinality))
        .to.eql(
          util.range(cardinality).map(function(i) {
            return interpolator(i * 1.0 / (cardinality - 1));
          })
        );
    });
  });
});
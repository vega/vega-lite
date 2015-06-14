'use strict';

var d3 = require('d3');
var expect = require('chai').expect;

var util = require('../../src/util'),
  Encoding = require('../../src/Encoding'),
  vlscale = require('../../src/compile/scale'),
  colorbrewer = require('../../src/lib/colorbrewer/colorbrewer');

describe('vl.compile.scale.domain', function() {
  it('should return correct stack', function() {
    var scale = vlscale.domain('y', Encoding.fromSpec({
      encoding: {
        y: {
          name: 'origin'
        }
      }
    }), {}, {
      stack: 'y',
      facet: true
    });

    expect(scale).to.eql({
      data: 'stacked',
      field: 'data.max_sum_origin'
    });
  });

  it('should return correct aggregated stack', function() {
    var scale = vlscale.domain('y', Encoding.fromSpec({
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

    expect(scale).to.eql({
      data: 'stacked',
      field: 'data.max_sum_sum_origin'
    });
  });

  // TODO test other cases
});

describe('vl.compile.scale.color.palette', function() {
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

describe('vl.compile.scale.color.interpolate', function() {
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
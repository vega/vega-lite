'use strict';

/*global vl, d3, vg, angular, alert */

var EXAMPLES = [
  {
    title: 'Simple Bar Chart',
    description: 'A simple bar chart with embedded data.',
    spec: {
      data: {
        values: [
          {'x':'A', 'y':28}, {'x':'B', 'y':55}, {'x':'C', 'y':43},
          {'x':'D', 'y':91}, {'x':'E', 'y':81}, {'x':'F', 'y':53},
          {'x':'G', 'y':19}, {'x':'H', 'y':87}, {'x':'I', 'y':52}
        ]
      },
      marktype: 'bar',
      encoding: {
        y: {type: 'Q', name: 'y'},
        x: {type: 'O', name: 'x'}
      }
    }
  },{
    title: 'Horse power and miles per gallon',
    description: 'A scatter plot.',
    spec: {
      marktype: 'point',
      encoding: {
        x: {'name': 'Horsepower','type': 'Q'},
        y: {'name': 'Miles_per_Gallon','type': 'Q'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Horse power over time',
    spec: {
      marktype: 'line',
      encoding: {
        x: {'name': 'Year','type': 'T','timeUnit': 'year'},
        y: {'name': 'Horsepower','type': 'Q','aggregate': 'avg'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Horse power histogram',
    description: 'Simple histogram with bars broken down by the number of cylinders. Also has a legend.',
    spec: {
      marktype: 'bar',
      encoding: {
        x: {'bin': {'maxbins': 15},'name': 'Horsepower','type': 'Q'},
        y: {'name': '*','type': 'Q','aggregate': 'count'},
        color: {'name': 'Cylinders','type': 'N'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Barleys',
    spec: {
      data: {url: 'data/barley.json'},
      marktype: 'point',
      encoding: {
        x: {type: 'Q',name: 'yield',aggregate: 'avg'},
        y: {
          sort: [{name: 'yield',aggregate: 'avg',reverse: false}],
          type: 'O',
          name: 'variety'
        },
        row: {type: 'O',name: 'site'},
        color: {type: 'O',name: 'year'}
      }
    }
  },{
    title: 'Binned plots',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'bin': true,'name': 'Displacement','type': 'Q'},
        'y': {'bin': true,'name': 'Miles_per_Gallon','type': 'Q'},
        'size': {
          'name': '*',
          'aggregate': 'count',
          'type': 'Q',
          'displayName': 'Number of Records'
        }
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Small Multiples',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'name': 'Worldwide_Gross','type': 'Q'},
        'y': {'name': 'US_DVD_Sales','type': 'Q'},
        'col': {'axis': {'maxLabelLength': 25},'name': 'MPAA_Rating','type': 'O'}
      },
      'data': {'url': 'data/movies.json'}
    }
  },{
    title: 'Ordinal on Top',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'name': 'MPAA_Rating','type': 'N'},
        'y': {'name': 'Release_Date','type': 'N'}
      },
      'data': {'url': 'data/movies.json'}
    }
  }
];

var app = angular.module('app', []);

app.controller('GalleryCtrl', function ($scope) {
  $scope.visualizations = EXAMPLES;
  $scope.vegaVersion = vg.version;
});

app.filter('compactJSON', function() {
    return function(input) {
      return JSON.stringify(input, null, '  ', 80);
    };
  });

app.directive('vlPlot', function() {
  return {
    scope: {
      vlSpec: '='
    },
    template: '',
    link: function(scope, element) {

      var vlElement = element[0];

      var callback = function(stats) {
        var spec = vl.compile(scope.vlSpec, stats);
        vg.parse.spec(spec, function(chart) {
          var view = chart({el: vlElement, renderer: 'svg'});
          view.update();
        });
      };

      if (!scope.vlSpec.data.values) {
        d3.json(scope.vlSpec.data.url, function(err, data) {
          if (err) return alert('Error loading data ' + err.statusText);
          var stats = vl.data.stats(data);
          callback(stats);
        });
      } else {
        callback();
      }
    }
  };
});

'use strict';

/*global vl, d3, vg, angular, alert, validateVl, validateVg, EXAMPLES */


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
        validateVl(scope.vlSpec);
        var spec = vl.compile(scope.vlSpec, stats);
        validateVg(spec);

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

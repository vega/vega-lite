'use strict';

/*global vl, d3, vg, angular, alert, EXAMPLES */


var app = angular.module('app', []);

app.controller('GalleryCtrl', function ($scope) {
  $scope.visualizations = EXAMPLES;
  $scope.vegaVersion = vg.version;
  $scope.vlVersion = vl.version;
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
      var spec = vl.compile(scope.vlSpec).spec;

      vg.parse.spec(spec, function(chart) {
        var view = chart({el: vlElement, renderer: 'svg'});
        view.update();
      });
    }
  };
});

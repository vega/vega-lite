'use strict';

/*global vl, d3, vg, angular, alert, EXAMPLES */

d3.select('#vl-version').text(vl.version);
d3.select('#vg-version').text(vg.version);

var specs = d3.keys(VL_SPECS).reduce(function(specs, groupName) {
  var group = VL_SPECS[groupName];
  return specs.concat(group);
}, []);

var viz = d3.select('div.viz-list').selectAll('.viz')
  .data(specs)
  .enter()
  .append('div')
  .attr('class', 'viz')
  .attr('id', function(d) { return d.name; });


viz.append('h3').text(function(d){ return d.title; });
viz.append('div').attr('class', 'view');
viz.append('div').attr('class', 'desc');


specs.forEach(function(spec) {
  d3.json('examples/' + spec.name + '.json', function(error, vlSpec) {
    var vgSpec = vl.compile(vlSpec).spec;
    vg.parse.spec(vgSpec, function(chart) {
      var view = chart({
        el: d3.select('.viz#'+ spec.name + '> div.view').node(),
        renderer: 'svg'
      });
      view.update();
    });
  });
});

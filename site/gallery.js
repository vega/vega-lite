'use strict';

/*global vl, d3, vg, alert, EXAMPLES */

d3.select('#vl-version').text(vl.version);
d3.select('#vg-version').text(vg.version);

d3.json('examples/vlexamples.json', function(VL_SPECS) {
  var examples = d3.keys(VL_SPECS).reduce(function(examples, groupName) {
    var group = VL_SPECS[groupName];
    return examples.concat(group);
  }, []).filter(function(example){
    return !example.hide;  // must contain file name to be included
  });

  var viz = d3.select('div.viz-list').selectAll('.viz')
    .data(examples)
    .enter()
    .append('div')
    .attr('class', 'viz')
    .attr('id', function(d) { return d.name; });

  viz.append('h3').text(function(d){ return d.title; });
  viz.append('div').attr('class', 'view');
  viz.append('div').attr('class', 'desc');

  examples.forEach(function(example) {
    d3.json('examples/' + example.name + '.json', function(error, vlSpec) {
      var vgSpec = vl.compile(vlSpec).spec;
      vg.parse.spec(vgSpec, function(chart) {
        var view = chart({
          el: d3.select('.viz#'+ example.name + '> div.view').node(),
          renderer: 'svg'
        });
        view.update();
      });
    });
  });
})

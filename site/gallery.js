'use strict';

/* global vl, d3, vg */

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
  viz.append('div').attr('class', 'desc');
  viz.append('div').attr('class', 'view');

  examples.forEach(function(example) {
    d3.json('examples/' + example.name + '.json', function(error, vlSpec) {
      var embedSpec = {
        mode: 'vega-lite',
        spec: vlSpec,
        actions: {
          export: false
        }
      };
      vg.embed('.viz#'+ example.name + '> div.view', embedSpec, function(view, vega_spec) {
        // Callback receiving the View instance and parsed Vega spec...
        // The View resides under the '#vis' element
      });

      d3.select('.viz#'+ example.name + '> .desc').text(vlSpec.description || '');
    });
  });
});

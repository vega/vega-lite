import * as d3 from 'd3';
import * as vega from 'vega';
import * as vl from '../src/index';
import {TopLevelSpec} from '../src/spec';

d3.select('#vl-version').text(vl.version);
d3.select('#vg-version').text(vega.version);

function loadJSON(url: string, callback: (data: object) => void) {
  vega.loader().load(url).then(function(data: string) {
    callback(JSON.parse(data));
  });
}

loadJSON('examples/all-examples.json', function(examples: string[]) {
  const viz = d3.select('div.viz-list').selectAll('.viz').data(examples);

  viz.exit().remove();

  const vizEnter = viz
    .enter()
    .append('div')
    .attr('class', 'viz')
    .attr('id', d => d);

  vizEnter.append('h3').text(d => d);
  vizEnter.append('div').attr('class', 'desc');
  vizEnter.append('div').attr('class', 'view');

  examples.forEach(function(example) {
    loadJSON('examples/specs/' + example + '.vl.json', function(vlSpec: TopLevelSpec) {
      const vgSpec = vl.compile(vlSpec).spec;
      const runtime = vega.parse(vgSpec); // may throw an Error if parsing fails
      new vega.View(runtime)
        .logLevel(vega.Warn)
        .initialize(document.querySelector('.viz#'+ example + '> div.view'))
        .renderer('canvas')
        .run();

      d3.select('.viz#'+ example + '> .desc').text(vlSpec.description || '');
    });
  });
});

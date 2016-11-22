import * as d3 from 'd3';
import * as vega from 'vega';
import * as vl from '../src/vl';
import {ExtendedSpec} from '../src/spec';

d3.select('#vl-version').text(vl.version);
d3.select('#vg-version').text(vega.version);

d3.json('examples/all-examples.json', function(examples: string[]) {
  render();

  function render() {
    const viz = d3.select('div.viz-list').selectAll('.viz').data(examples);

    viz.exit().remove();

    const vizEnter = viz
      .enter()
      .append('div')
      .attr('class', 'viz')
      .attr('id', function(d:string) { return d; });

    vizEnter.append('h3').text(function(d:string) { return d; });
    vizEnter.append('div').attr('class', 'desc');
    vizEnter.append('div').attr('class', 'view');

    examples.forEach(function(example) {
      d3.json('examples/specs/' + example + '.vl.json', function(error: Error, vlSpec: ExtendedSpec) {
        const vgSpec = vl.compile(vlSpec);
        const runtime = vega.parse(vgSpec); // may throw an Error if parsing fails
        new vega.View(runtime)
          .logLevel(vega.Warn)
          .initialize(document.querySelector('.viz#'+ example + '> div.view'))
          .renderer('svg')
          .hover()
          .run();

        d3.select('.viz#'+ example + '> .desc').text(vlSpec.description || '');
      });
    });
  }
});

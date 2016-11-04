d3.select('#vl-version').text(vl.version);
d3.select('#vg-version').text(vega.version);

d3.json('examples/all-examples.json', function(examples: string[]) {
  render();

  function render() {
    let viz = d3.select('div.viz-list').selectAll('.viz').data(examples);

    viz.exit().remove();

    let vizEnter = viz
      .enter()
      .append('div')
      .attr('class', 'viz')
      .attr('id', function(d:string) { return d; });

    vizEnter.append('h3').text(function(d:string) { return d; });
    vizEnter.append('div').attr('class', 'desc');
    vizEnter.append('div').attr('class', 'view');

    examples.forEach(function(example) {
      d3.json('examples/specs/' + example + '.vl.json', function(error, vlSpec) {
        const vgSpec = vl['compile'](vlSpec);
        var runtime = vega.parse(vgSpec); // may throw an Error if parsing fails
        var view = new vega.View(runtime)
          .logLevel(vega.Warn) // set view logging level
          .initialize(document.querySelector('.viz#'+ example + '> div.view')) // set parent DOM element
          .renderer('svg') // set render type (defaults to 'canvas')
          .hover() // enable hover event processing
          .run(); // update and render the view

        d3.select('.viz#'+ example + '> .desc').text(vlSpec.description || '');
      });
    });
  }

});

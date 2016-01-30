/* tslint:disable:no-unused-variable */

declare const BASEURL, hljs;

function renderExample($target: d3.Selection<any>, text: string) {
  $target.classed('example', true);
  $target.classed('side', true);
  $target.text('');

  const code = $target.insert('pre', 'div.example-vis').attr('class', 'example-code')
    .append('code').attr('class', 'json').text(text);
  hljs.highlightBlock(code.node());

  let vis = $target.select('div.example-vis');
  if (vis.empty()) {
    vis = $target.append('div').attr('class', 'example-vis');
  }

  const spec = JSON.parse(text);
  if (spec.data.url) {
    spec.data.url = BASEURL + '/' + spec.data.url;
  }

  vg.embed(vis.node(), {
    mode: 'vega-lite',
    spec: spec,
    renderer: 'svg',
    actions: {
      source: false,
      export: false
    }
  });
}

d3.selectAll('.vl-example').each(function(d, i) {
  const sel = d3.select(this);
  const name = sel.attr('data-name');
  if (name) {
    const dir = sel.attr('data-dir');
    const fullUrl = BASEURL + '/examples/' + (dir ? (dir + '/') : '') + name + '.json';

    d3.text(fullUrl, function(error, spec) {
      if (error) {
        console.error(error);
      } else {
        renderExample(sel, spec);
      }
    });
  } else {
    var spec = sel.text();
    renderExample(sel, spec);
  }
});

/* tslint:disable */

declare const BASEURL, hljs;

function example(name, dir) {
  const fullUrl = BASEURL + '/examples/' + (dir ? (dir + '/') : '') + name + '.json';

  d3.text(fullUrl, function(error, text) {
    const target = '#ex-' + name.replace('/', '-');
    const $target = d3.select(target);
    $target.classed('example', true);

    const code = $target.insert('pre', "div.example-vis").attr('class', 'example-code')
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
  });
}

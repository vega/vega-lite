/* tslint:disable:no-unused-variable */

declare const BASEURL, hljs;

function renderExample(name: string, text: string) {
  const target = '#ex-' + name.replace('/', '-');
  const $target = d3.select(target);
  $target.classed('example', true);

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

/**
 * Show example in the decs. Provide the name of the example or a spec.
 */
function example(name: string, dirOrSpec) {
  if (dirOrSpec !== null && typeof dirOrSpec === 'object') {
    const spec = JSON3.stringify(dirOrSpec, null, 2, 80);
    renderExample(name, spec);
  } else {
    const dir = dirOrSpec;
    const fullUrl = BASEURL + '/examples/' + (dir ? (dir + '/') : '') + name + '.json';

    d3.text(fullUrl, function(error, text) {
      if (error) {
        console.error(error);
      } else {
        renderExample(name, text);
      }
    });
  }
}

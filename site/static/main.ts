import {text} from 'd3-request';
import {select, selectAll, Selection} from 'd3-selection';
import * as hljs from 'highlight.js';
import embed from 'vega-embed';
import {vegaLite} from 'vega-tooltip';
import {runStreamingExample} from './streaming';

window['runStreamingExample'] = runStreamingExample;

declare const BASEURL: string;

function trim(str: string) {
  return str.replace(/^\s+|\s+$/g, '');
}

/* Anchors */
selectAll('h2, h3, h4, h5, h6').each(function(this: Element) {
  const sel = select(this);
  const name = sel.attr('id');
  const title = sel.text();
  sel.html('<a href="#' + name + '" class="anchor"><span class="octicon octicon-link"></span></a>' + trim(title));
});

/* Documentation */

function renderExample($target: Selection<any, any, any, any>, text: string) {
  $target.classed('example', true);
  $target.text('');

  const vis = $target.append('div').attr('class', 'example-vis');

  const code = $target.append('pre').attr('class', 'example-code')
    .append('code').attr('class', 'json').text(text);
  hljs.highlightBlock(code.node() as any);

  const spec = JSON.parse(text);
  if (spec.data.url) {
    // make url absolute
    spec.data.url = window.location.origin + BASEURL + '/' + spec.data.url;
  }

  embed(vis.node(), spec, {
    mode: 'vega-lite',
    renderer: 'svg',
    actions: {
      source: false,
      export: false
    }
  }).then(result => {
    if ($target.classed('tooltip')) {
      vegaLite(result.view, JSON.parse(text) as any);
    }
  }).catch(console.error);
}

selectAll('.vl-example').each(function(this: Element) {
  const sel = select(this);
  const name = sel.attr('data-name');
  if (name) {
    const dir = sel.attr('data-dir');
    const fullUrl = BASEURL + '/examples/specs/' + (dir ? (dir + '/') : '') + name + '.vl.json';

    text(fullUrl, function(error, spec) {
      if (error) {
        console.error(error);
      } else {
        renderExample(sel, spec);
      }
    });
  } else {
    console.error('No "data-name" specified to import examples from');
  }
});

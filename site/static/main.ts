import {json, text} from 'd3-request';
import {select, selectAll, Selection} from 'd3-selection';
import * as hljs from 'highlight.js';
import embed from 'vega-embed';
import {config} from 'vega-embed';
import {vegaLite} from 'vega-tooltip';
import {Spec} from '../../build/src/spec';
import {runStreamingExample} from './streaming';

window['runStreamingExample'] = runStreamingExample;

declare const BASEURL: string;

config.editor_url = 'https://vega.github.io/new-editor';

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
  }, (err: Error, result: any) => {
    if (err) {
      console.error(err);
    } else if ($target.classed('tooltip')) {
      vegaLite(result.view, JSON.parse(text) as any);
    }
  });

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

/* Gallery */

if (select('.gallery').empty() === false) {
  renderGallery();
}

function renderGallery() {
  json(window.location.origin + BASEURL + '/examples/vl-examples.json', function(error, VL_SPECS) {
    if (error) {return console.warn(error);}

    selectAll('div.gallery').each(function(this: Element) {
      select(this).call(renderGalleryGroup);
    });

    function renderGalleryGroup(selection: Selection<any, any, any, any>) {
      const galleryGroupName = selection.attr('data-gallery-group');
      let galleryGroupSpecs: any[];

      // try to retrieve specs for a gallery group from in vl-examples.json
      try {
        galleryGroupSpecs = VL_SPECS[galleryGroupName];
      } catch (error) {
        console.log(error.message);
        return;
      }

      const viz = selection.selectAll('.imagegroup').data(galleryGroupSpecs);

      viz.exit().remove();

      const imageGroup = viz.enter()
        .append('a')
        .attr('class', 'imagegroup')
        .attr('href', function(d) {return 'https://vega.github.io/new-editor/?mode=vega-lite&spec=' + d.name;})
        .attr('target', 'blank');

      imageGroup.append('div')
        .attr('class', 'image')
        .style('background-image', function(d) {return 'url(' + window.location.origin + BASEURL + '/build/examples/images/' + d.name + '.vl.svg)';})
        .style('background-size', function(d) {
          return (!d.galleryParameters || !d.galleryParameters.backgroundSize) ? 'cover' : d.galleryParameters.backgroundSize;
        });
      imageGroup.append('div')
        .attr('class', 'image-title')
        .text(function(d) {return d.title;});
    }
  });
}

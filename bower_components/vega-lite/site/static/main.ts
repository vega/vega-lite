/* tslint:disable:no-unused-variable */

declare const BASEURL, hljs;

function trim(str: string) {
  return str.replace(/^\s+|\s+$/g, '');
}

/* Anchors */
d3.selectAll('h2, h3, h4, h5, h6').each(function() {
  const sel = d3.select(this);
  const link = sel.select('a');
  const name = sel.attr('id');
  const title = sel.text();
  sel.html('<a href="#' + name + '" class="anchor"><span class="octicon octicon-link"></span></a>' + trim(title));
});

/* Documentation */

function renderExample($target: d3.Selection<any>, text: string) {
  $target.classed('example', true);
  $target.text('');

  const vis = $target.append('div').attr('class', 'example-vis');

  const code = $target.append('pre').attr('class', 'example-code')
    .append('code').attr('class', 'json').text(text);
  hljs.highlightBlock(code.node());

  const spec = JSON.parse(text);
  if (spec.data.url) {
    // make url absolute
    spec.data.url = window.location.origin + BASEURL + '/' + spec.data.url;
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

d3.selectAll('.vl-example').each(function() {
  const sel = d3.select(this);
  const name = sel.attr('data-name');
  if (name) {
    const dir = sel.attr('data-dir');
    const fullUrl = BASEURL + '/examples/specs/' + (dir ? (dir + '/') : '') + name + '.json';

    d3.text(fullUrl, function(error, spec) {
      if (error) {
        console.error(error);
      } else {
        renderExample(sel, spec);
      }
    });
  } else {
    let spec = trim(sel.text());
    renderExample(sel, spec);
  }
});

/* Gallery */

if (d3.select('.gallery').empty() === false) {
  renderGallery();
}

function renderGallery() {
  d3.json(window.location.origin + BASEURL + '/examples/vl-examples.json', function(error, VL_SPECS) {
    if (error) { return console.warn(error); }

    d3.selectAll('div.gallery').each(function() {
      d3.select(this).call(renderGalleryGroup);
    });

    function renderGalleryGroup (selection) {
      const galleryGroupName = selection.attr('data-gallery-group');
      let galleryGroupSpecs;

      // try to retrieve specs for a gallery group from in vl-examples.json
      try {
        galleryGroupSpecs = VL_SPECS[galleryGroupName];
      } catch (error){
        console.log(error.message);
        return;
      }

      let viz = selection.selectAll('.imagegroup').data(galleryGroupSpecs);

      viz.exit().remove();

      let imageGroup = viz.enter()
        .append('a')
        .attr('class', 'imagegroup')
        .attr('href', function(d){ return 'https://vega.github.io/vega-editor/?mode=vega-lite&spec=' + d.name;})
        .attr('target', 'blank');

      imageGroup.append('div')
        .attr('class', 'image')
        .style('background-image', function(d) { return 'url(' + window.location.origin + BASEURL + '/examples/images/' + d.name + '.svg)'; })
        .style('background-size', function(d) {
          const bgSizeDefault = 'cover';
          if (!d.galleryParameters || !d.galleryParameters.backgroundSize) {
            return bgSizeDefault;
          } else {
            return d.galleryParameters.backgroundSize;
          }})
        .style('background-position', function(d) {
          const bgPositionDefault = 'center';
          if (!d.galleryParameters || !d.galleryParameters.backgroundPosition) {
            return bgPositionDefault;
          } else {
            return d.galleryParameters.backgroundPosition;
          }
        });
      imageGroup.append('div')
        .attr('class', 'image-title')
        .text(function(d) {return d.title;});
    }
  });
}

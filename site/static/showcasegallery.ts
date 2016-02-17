d3.json('examples/vl-examples.json', function(error, VL_SPECS) {
  if (error) { return console.warn(error); }

  d3.selectAll('div.gallery').each(function() {
    d3.select(this).call(renderGalleryGroup);
  });

  function renderGalleryGroup (selection) {
    const galleryGroupName = selection.attr('data-gallery-group');

    // try to retrieve specs for a gallery group from in vl-examples.json
    try {
      var galleryGroupSpecs = VL_SPECS[galleryGroupName];
    } catch (error){
      console.log(error.message);
      return;
    }

    var viz = selection.selectAll('.image').data(galleryGroupSpecs);

    viz.exit().remove();

    viz.enter()
      .append('a')
      .attr('class', 'image')
      .attr('href', function(d){ return 'https://vega.github.io/vega-editor/?mode=vega-lite&spec=' + d.name;})
      .style('background-image', function(d){ return 'url(examples/images/' + d.name + '.svg)'; })
      .style('background-size', 'cover');
  }
});

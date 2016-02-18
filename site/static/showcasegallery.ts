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

    let viz = selection.selectAll('.imagegroup').data(galleryGroupSpecs);

    viz.exit().remove();

    let imageGroup = viz.enter()
      .append('a')
      .attr('class', 'imagegroup')
      .attr('href', function(d){ return 'https://vega.github.io/vega-editor/?mode=vega-lite&spec=' + d.name;});

    imageGroup.append('a')
      .attr('class', 'image')
      .style('background-image', function(d){ return 'url(examples/images/' + d.name + '.svg)'; })
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
    imageGroup.append('span')
        .text(function(d) {return d.title;});

  }
});

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

    var viz = selection.selectAll('.viz').data(galleryGroupSpecs);

    viz.exit().remove();

    var vizEnter = viz
      .enter()
      .append('a')
      .attr('class', 'viz')
      .attr('width', 200)
      .attr('height', 190);

    vizEnter.append('img')
      .attr('src', function(d){ return 'examples/images/' + d.name + '.svg'; });


  }
});

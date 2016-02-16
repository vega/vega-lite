d3.json('examples/vl-examples.json', function(error, VL_SPECS) {
  if (error) { return console.warn(error); }

  d3.selectAll('div.gallery').each(function() {
    d3.select(this).call(renderGalleryGroup);
  });

  function renderGalleryGroup (selection) {
    let galleryGroupName = selection.attr('data-gallery-group');
    VL_SPECS[galleryGroupName].forEach( function(example) {
      console.log('group: ' + galleryGroupName + ' | example name: ' + example.name);
    });
  }
});

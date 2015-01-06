var DATASETS = [
  {
    name: "Barley",
    url: "data/barley.json"
  },{
    name: "Cars",
    url: "data/cars.json"
  },{
    name: "Crimea",
    url: "data/crimea.json"
  },{
    name: "Driving",
    url: "data/driving.json"
  },{
    name: "Iris",
    url: "data/iris.json"
  },{
    name: "Jobs",
    url: "data/jobs.json"
  },{
    name: "Population",
    url: "data/population.json"
  },{
    name: "Movies",
    url: "data/movies.json"
  },{
    name: "Birdstrikes",
    url: "data/birdstrikes.json"
  }
];

var vled = {
  version: 0.1,
  spec: {}
}

vled.format = function() {
  var el = d3.select("#vlspec"),
      spec = JSON.parse(el.property("value")),
      text = JSON.stringify(spec, null, "  ", 80);
  el.property("value", text);
};

vled.parse = function() {
  var spec, encoding, source, cfg;
  try {
    spec = JSON.parse(d3.select("#vlspec").property("value"));
  } catch (e) {
    console.log(e);
    return;
  }

  cfg = {
    dataUrl: vled.dataset.url
  }

  encoding = vl.Encoding.parseJSON(spec, cfg);
  vled.loadEncoding(encoding);
}

vled.parseShorthand = function() {
  var shorthand = d3.select("#shorthand").property("value");

  var encoding = vl.Encoding.parseShorthand(shorthand);
  d3.select("#vlspec").node().value = JSON.stringify(encoding.toJSON(), null, "  ", 80);
  vled.parse();
}

vled.loadEncoding = function(encoding) {
  var spec = vl.toVegaSpec(encoding, vled.dataset.stats);

  d3.select("#shorthand").node().value = encoding.toShorthand();
  d3.select("#vlspec").node().value = JSON.stringify(encoding.toJSON(), null, "  ", 80);
  d3.select("#vgspec").node().value = JSON.stringify(spec, null, "  ", 80);

  $('textarea').trigger('autosize.resize');

  vled.vis = null; // DEBUG
  vg.parse.spec(spec, function(chart) {
    vled.vis = chart({el:"#vis", renderer: "svg"});

    vled.vis.update();
    vled.vis.on('mouseover', function(event, item) { console.log(item); });
  });
}

vled.datasetChanged = function(dataset, callback) {
  vled.dataset = dataset;

  if (dataset.stats) return;

  d3.json(dataset.url, function(err, data) {
    if (err) return alert("Error loading data " + err.statusText);

    dataset.stats = vl.getStats(data);
    callback();
  });
}

vled.init = function() {

  // Specification drop-down menu
  var sel = d3.select("#sel_spec");
  sel.selectAll("option.spec")
    .data(DATASETS)
   .enter().append("option")
    .text(function(d) { return d.name; });

  sel.on("change", function() {
    var item = this.options[this.selectedIndex].__data__;
      vled.datasetChanged(item, function() {
      d3.select("#vgspec").node().value = "";
      d3.select("#vis").node().innerHTML = "";
    });
  });

  // Initialize application
  d3.select("#btn_spec_format").on("click", vled.format);
  d3.select("#btn_spec_parse").on("click", vled.parse);
  d3.select("#btn_shorthand_parse").on("click", vled.parseShorthand);

  document.getElementById("shorthand").value = "point.x-bin_yield-Q.y-variety-O.size-count_-Q.color-year-O";
  vled.datasetChanged(DATASETS[0], function() {
    vled.parseShorthand();
  });
};

window.onload = vled.init;
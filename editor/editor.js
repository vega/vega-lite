'use strict';

/*global location, d3, vl, vg, docCookies, document, $, alert */

var DATASETS = [
  {
    name: 'Barley',
    url: 'data/barley.json'
  },{
    name: 'Cars',
    url: 'data/cars.json'
  },{
    name: 'Crimea',
    url: 'data/crimea.json'
  },{
    name: 'Driving',
    url: 'data/driving.json'
  },{
    name: 'Iris',
    url: 'data/iris.json'
  },{
    name: 'Jobs',
    url: 'data/jobs.json'
  },{
    name: 'Population',
    url: 'data/population.json'
  },{
    name: 'Movies',
    url: 'data/movies.json'
  },{
    name: 'Birdstrikes',
    url: 'data/birdstrikes.json'
  },{
    name: 'Burtin',
    url: 'data/burtin.json'
  },{
    name: 'Budget 2016',
    url: 'data/budget.json'
  },{
    name: 'Climate Normals',
    url: 'data/climate.json'
  },{
    name: 'Campaigns',
    url: 'data/weball26.json'
  }
];

var vled = {
  version: 0.1,
  spec: {}
};

function getParams() {
  var params = location.search.slice(1);

  // remove trailing slash that chrome adds automatically
  if (params[params.length-1] == '/') params = params.substring(0, params.length-1);

  return params.split('&')
    .map(function(x) {
      // don't gobble up any equals within the query value
      var idx = x.indexOf('=');
      return [x.slice(0,idx), x.slice(idx+1)];
    })
    .reduce(function(a, b) {
      a[b[0]] = b[1]; return a;
    }, {});
}

vled.format = function() {
  var el = d3.select('#vlspec'),
      spec = JSON.parse(el.property('value')),
      text = JSON.stringify(spec, null, '  ', 60);
  el.property('value', text);
};

vled.parse = function() {
  var spec;
  try {
    spec = JSON.parse(d3.select('#vlspec').property('value'));
  } catch (e) {
    console.warn(e);
    return;
  }

  var datasetIndex;
  for (var i = 0; spec.data && i < DATASETS.length; i++) {
    if (DATASETS[i].url === spec.data.url) {
      datasetIndex = i;
      break;
    }
  }

  var done = function() {
    // only add url if data is not provided explicitly
    var theme = (spec.data && spec.data.values) ? {} : {
      data: {
        url:  vled.dataset.url
      }
    };
    vled.loadSpec(spec, theme);
  };

  if (!vled.dataset && !datasetIndex) {
    datasetIndex = 0;
  }

  if (datasetIndex !== undefined) {
    document.getElementById('sel_spec').selectedIndex = datasetIndex;
    vled.datasetChanged(DATASETS[datasetIndex], function() {
      done();
    });
  } else {
    done();
  }
};

vled.parseShorthand = function() {
  var shorthand = d3.select('#shorthand').property('value');

  var spec = vl.compile(shorthand, vled.dataset.stats);
  d3.select('#vlspec').node().value = JSON.stringify(spec, null, '  ', 60);
  vled.parse();
};

vled.loadSpec = function(vlspec, theme) {
  var spec = vl.compile(vlspec, vled.dataset.stats, theme);

  d3.select('#shorthand').node().value = vl.toShorthand(vlspec);
  d3.select('#vgspec').node().value = JSON.stringify(spec, null, '  ', 60);

  // store spec in cookie for a day
  docCookies.setItem('vlspec', JSON.stringify(vlspec), 86400);

  $('textarea').trigger('autosize.resize');

  vled.vis = null; // DEBUG
  vg.parse.spec(spec, function(chart) {
    vled.vis = chart({el:'#vis', renderer: 'svg'});

    vled.vis.update();
    vled.vis.on('mouseover', function(ev, item) {
      console.log(item);
    });
  });
};

vled.datasetChanged = function(dataset, callback) {
  vled.dataset = dataset;

  if (dataset.stats) {
    callback();
    return;
  }

  d3.json(dataset.url, function(err, data) {
    if (err) return alert('Error loading data ' + err.statusText);
    dataset.stats = vl.data.stats(data);
    callback();
  });
};

vled.init = function() {
  var params = getParams();

  // Specification drop-down menu
  var sel = d3.select('#sel_spec');
  sel.selectAll('option.spec')
    .data(DATASETS)
   .enter().append('option')
    .text(function(d) { return d.name; });

  sel.on('change', function() {
    var item = this.options[this.selectedIndex].__data__;
      vled.datasetChanged(item, function() {
      d3.select('#vgspec').node().value = '';
      d3.select('#vis').node().innerHTML = '';
    });
  });

  // Initialize application
  d3.select('#btn_spec_format').on('click', vled.format);
  d3.select('#btn_spec_parse').on('click', vled.parse);
  d3.select('#btn_shorthand_parse').on('click', vled.parseShorthand);

  var shorthand = params.shortHand;
  if (shorthand) {
    document.getElementById('shorthand').value = shorthand;
    vled.datasetChanged(DATASETS[0], function() {
      vled.parseShorthand();
    });
  } else if (docCookies.hasItem('vlspec')) {
    document.getElementById('vlspec').value = docCookies.getItem('vlspec');
    vled.parse();
    vled.format();
  } else {
    document.getElementById('vlspec').value = JSON.stringify({
      marktype: 'point',
      encoding: {
        x: {type: 'Q',name: 'yield',aggr: 'avg'},
        y: {
          sort: [{name: 'yield', aggr: 'avg', reverse: false}],
          type: 'N',
          name: 'variety'
        },
        row: {type: 'N', name: 'site'},
        color: {type: 'N', name: 'year'}
      }
    });

    vled.parse();
    vled.format();
  }
};

window.onload = vled.init;

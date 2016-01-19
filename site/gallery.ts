d3.select('#vl-version').text(vl.version);
d3.select('#vg-version').text(vg.version);

// parse url parameters
var params = function() {
  var query = location.search.slice(1);
  if (query.slice(-1) === '/') {
    query = query.slice(0,-1);
  }
  return query
    .split('&')
    .map(function(x) { return x.split('='); })
    .reduce(function(a, b) {
      a[b[0]] = b[1]; return a;
    }, {});
};

d3.json('examples/vlexamples.json', function(VL_SPECS) {
  var examples = d3.keys(VL_SPECS).reduce(function(aggregator, groupName) {
    var group = VL_SPECS[groupName];
    return aggregator.concat(group);
  }, []);

  var p:any = params();
  var debug = p.debug === 'true';

  // make debug the default for localhost
  if (p.debug !== 'false' && location.hostname === 'localhost') {
    debug = true;
  }

  if (debug) {
    d3.select('#show-debug').property('checked', true);
  }

  d3.select('#show-debug').on('click', function() {
    debug = !debug;
    render();

    var path = location.protocol + '//' + location.host + location.pathname;
    var url = debug ? path + '?debug=true' : path + '?debug=false';
    window.history.replaceState('', document.title, url);
  });

  render();

  function render() {
    var data = examples.filter(function(example) {
      if (debug) {
        return true;
      }
      return example.showInEditor;
    });

    var viz = d3.select('div.viz-list').selectAll('.viz').data(data);

    viz.exit().remove();

    var vizEnter = viz
      .enter()
      .append('div')
      .attr('class', 'viz')
      .attr('id', function(d) { return d.name; });

    vizEnter.append('h3').text(function(d){ return d.title; });
    vizEnter.append('div').attr('class', 'desc');
    vizEnter.append('div').attr('class', 'view');

    data.forEach(function(example) {
      d3.json('examples/' + example.name + '.json', function(error, vlSpec) {
        var embedSpec = {
          mode: 'vega-lite',
          spec: vlSpec,
          actions: {
            export: false
          }
        };
        vg.embed('.viz#'+ example.name + '> div.view', embedSpec, function(err) {
          if (err) {
            console.error(err);
          }
        });

        d3.select('.viz#'+ example.name + '> .desc').text(vlSpec.description || '');
      });
    });
  }

});

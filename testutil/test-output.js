// script for test/index.html -- for rendering failed test case

function getParams() {
  var params = location.search.slice(1);

  // remove trailing slash that chrome adds automatically
  if (params[params.length - 1] == '/') params = params.substring(0, params.length - 1);

  return params.split('&')
    .map(function(x) { return x.split('='); })
    .reduce(function(a, b) {
      a[b[0]] = b[1]; return a;
    }, {});
}

function renderList(data, main) {
  var div = main.selectAll('div').data(data).enter()
    .append('div');
  div.append('h2').text(function(d) { return d.filename; });
  var split = div.append('div');

  var code = split.append('div').attr('class', 'inline')
    .append('textarea').attr('class', 'code')
    .text(function(d) { return JSON.stringify(d.spec, null, '  ', 80); });

  split.append('div').attr({
    'class': 'output inline',
    'id': function(d, i) { return 'vis-'+ i; }
  });

  div.each(function(d, i) {
    vg.parse.spec(d.spec, function(chart) {
      self.vis = chart({el: '#vis-'+ i, renderer: 'svg'});
      vis.update();
    });
  });
}

function load(filename) {
  d3.json('test/log/'+ filename, function(err, data) {
    renderList(data.bad, d3.select('#bad'));
    renderList(data.good, d3.select('#good'));
  });
}

load(getParams().filename || 'difflist.json');

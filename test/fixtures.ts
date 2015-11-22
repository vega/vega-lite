export var f: any = {};

// BARS

f.bars = {};

f.bars.log_ver = {
  'marktype': 'bar',
  'encoding': {
    'x': {'bin': {'maxbins': 15},'type': 'quantitative','field': 'IMDB_Rating'},
    'y': {'scale': {'type': 'log'},'type': 'quantitative','field': 'US_Gross','aggregate': 'mean'}
  },
  'data': {'url': 'data/movies.json'}
};

f.bars.log_hor = {
  'marktype': 'bar',
  'encoding': {
    'y': {'bin': {'maxbins': 15},'type': 'quantitative','field': 'IMDB_Rating'},
    'x': {'scale': {'type': 'log'},'type': 'quantitative','field': 'US_Gross','aggregate': 'mean'}
  },
  'data': {'url': 'data/movies.json'}
};

f.bars['1d_hor'] = {
  'marktype': 'bar',
  'encoding': {'x': {'type': 'quantitative','field': 'US_Gross','aggregate': 'sum'}},
  'data': {'url': 'data/movies.json'}
};


f.bars['1d_ver'] = {
  'marktype': 'bar',
  'encoding': {'y': {'type': 'quantitative','field': 'US_Gross','aggregate': 'sum'}},
  'data': {'url': 'data/movies.json'}
};

// STACK

f.stack = {};

f.stack.binY = {
  'marktype': 'bar',
  'encoding': {
    'x': {'type': 'quantitative','field': 'Cost__Other','aggregate': 'mean'},
    'y': {'bin': true,'type': 'quantitative','field': 'Cost__Total_$'},
    'color': {'type': 'ordinal','field': 'Effect__Amount_of_damage'}
  }
};
f.stack.binX = {
  'marktype': 'bar',
  'encoding': {
    'y': {'type': 'quantitative','field': 'Cost__Other','aggregate': 'mean'},
    'x': {'bin': true,'type': 'quantitative','field': 'Cost__Total_$'},
    'color': {'type': 'ordinal','field': 'Effect__Amount_of_damage'}
  }
};

// POINT

f.points = {};

f.points['1d_hor'] = {
  'marktype': 'point',
  'encoding': {'x': {'field': 'year','type': 'ordinal'}},
  'data': {'url': 'data/barley.json'}
};

f.points['1d_ver'] = {
  'marktype': 'point',
  'encoding': {'y': {'field': 'year','type': 'ordinal'}},
  'data': {'url': 'data/barley.json'}
};

f.points['x,y'] = {
  'marktype': 'point',
  'encoding': {'x': {'field': 'year','type': 'ordinal'},'y': {'field': 'yield','type': 'quantitative'}},
  'data': {'url': 'data/barley.json'}
};

f.points['x,y,size'] = {
  'marktype': 'point',
  'encoding': {
    'x': {'field': 'year','type': 'ordinal'},
    'y': {'field': 'yield','type': 'quantitative'},
    'size': {'field': '*','type': 'quantitative','aggregate': 'count'}
  },
  'data': {'url': 'data/barley.json'}
};

f.points['x,y,stroke'] = {
  'marktype': 'point',
  'encoding': {
    'x': {'field': 'year','type': 'ordinal'},
    'y': {'field': 'yield','type': 'quantitative'},
    'color': {'field': 'yield','type': 'quantitative'}
  },
  'data': {'url': 'data/barley.json'}
};

f.points['x,y,shape'] = {
  'marktype': 'point',
  'encoding': {
    'x': {'field': 'year','type': 'ordinal'},
    'y': {'field': 'yield','type': 'quantitative'},
    'shape': {'bin': {'maxbins': 15},'field': 'yield','type': 'quantitative'}
  },
  'data': {'url': 'data/barley.json'}
};

// LINE

f.lines = {};

f.lines['x,y'] = {
  'marktype': 'line',
  'encoding': {
    'x': {'field': 'year','type': 'ordinal'},
    'y': {'field': 'yield','type': 'quantitative'}
  },
  'data': {'url': 'data/barley.json'}
};

f.lines['x,y,stroke'] = {
  'marktype': 'line',
  'encoding': {
    'x': {'field': 'Name','type': 'nominal'},
    'y': {'field': 'Cylinders','type': 'ordinal'},
    'color': {'field': 'Acceleration','type': 'quantitative'}
  },
  'data': {'url': 'data/cars.json'}
};

// AREA

f.area = {};

f.area['x,y'] = {
  'marktype': 'area',
  'encoding': {
    'x': {'field': 'Displacement','type': 'quantitative'},
    'y': {'field': 'Acceleration','type': 'quantitative'}
  },
  'data': {'url': 'data/cars.json'}
};

f.area['x,y,stroke'] = {
  'marktype': 'area',
  'encoding': {
    'x': {'field': 'Displacement','type': 'quantitative'},
    'y': {'field': 'Acceleration','type': 'quantitative'},
    'color': {'field': 'Miles_per_Gallon','type': 'quantitative'}
  },
  'data': {'url': 'data/cars.json'}
};

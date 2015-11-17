export var f: any = {};

// BARS

f.bars = {};

f.bars.log_ver = {
  "marktype": "bar",
  "encoding": {
    "x": {"bin": {"maxbins": 15},"type": 'quantitative',"name": "IMDB_Rating"},
    "y": {"scale": {"type": "log"},"type": 'quantitative',"name": "US_Gross","aggregate": "mean"}
  },
  "data": {"url": "data/movies.json"}
};

f.bars.log_hor = {
  "marktype": "bar",
  "encoding": {
    "y": {"bin": {"maxbins": 15},"type": 'quantitative',"name": "IMDB_Rating"},
    "x": {"scale": {"type": "log"},"type": 'quantitative',"name": "US_Gross","aggregate": "mean"}
  },
  "data": {"url": "data/movies.json"}
};

f.bars['1d_hor'] = {
  "marktype": "bar",
  "encoding": {"x": {"type": 'quantitative',"name": "US_Gross","aggregate": "sum"}},
  "data": {"url": "data/movies.json"}
};


f.bars['1d_ver'] = {
  "marktype": "bar",
  "encoding": {"y": {"type": 'quantitative',"name": "US_Gross","aggregate": "sum"}},
  "data": {"url": "data/movies.json"}
};

// STACK

f.stack = {};

f.stack.binY = {
  "marktype": "bar",
  "encoding": {
    "x": {"type": 'quantitative',"name": "Cost__Other","aggregate": "mean"},
    "y": {"bin": true,"type": 'quantitative',"name": "Cost__Total_$"},
    "color": {"type": 'ordinal',"name": "Effect__Amount_of_damage"}
  }
};
f.stack.binX = {
  "marktype": "bar",
  "encoding": {
    "y": {"type": 'quantitative',"name": "Cost__Other","aggregate": "mean"},
    "x": {"bin": true,"type": 'quantitative',"name": "Cost__Total_$"},
    "color": {"type": 'ordinal',"name": "Effect__Amount_of_damage"}
  }
};

// POINT

f.points = {};

f.points['1d_hor'] = {
  "marktype": "point",
  "encoding": {"x": {"name": "year","type": 'ordinal'}},
  "data": {"url": "data/barley.json"}
};

f.points['1d_ver'] = {
  "marktype": "point",
  "encoding": {"y": {"name": "year","type": 'ordinal'}},
  "data": {"url": "data/barley.json"}
};

f.points['x,y'] = {
  "marktype": "point",
  "encoding": {"x": {"name": "year","type": 'ordinal'},"y": {"name": "yield","type": 'quantitative'}},
  "data": {"url": "data/barley.json"}
};

f.points['x,y,size'] = {
  "marktype": "point",
  "encoding": {
    "x": {"name": "year","type": 'ordinal'},
    "y": {"name": "yield","type": 'quantitative'},
    "size": {"name": "*","type": 'quantitative',"aggregate": "count"}
  },
  "data": {"url": "data/barley.json"}
};

f.points['x,y,stroke'] = {
  "marktype": "point",
  "encoding": {
    "x": {"name": "year","type": 'ordinal'},
    "y": {"name": "yield","type": 'quantitative'},
    "color": {"name": "yield","type": 'quantitative'}
  },
  "data": {"url": "data/barley.json"}
};

f.points['x,y,shape'] = {
  "marktype": "point",
  "encoding": {
    "x": {"name": "year","type": 'ordinal'},
    "y": {"name": "yield","type": 'quantitative'},
    "shape": {"bin": {"maxbins": 15},"name": "yield","type": 'quantitative'}
  },
  "data": {"url": "data/barley.json"}
};

// LINE

f.lines = {};

f.lines['x,y'] = {
  "marktype": "line",
  "encoding": {"x": {"name": "year","type": 'ordinal'},"y": {"name": "yield","type": 'quantitative'}},
  "data": {"url": "data/barley.json"}
};

f.lines['x,y,stroke'] = {
  "marktype": "line",
  "encoding": {
    "x": {"name": "Name","type": "nominal"},
    "y": {"name": "Cylinders","type": 'ordinal'},
    "color": {"name": "Acceleration","type": 'quantitative'}
  },
  "data": {"url": "data/cars.json"}
};

// AREA

f.area = {};

f.area['x,y'] = {
  "marktype": "area",
  "encoding": {
    "x": {"name": "Displacement","type": 'quantitative'},
    "y": {"name": "Acceleration","type": 'quantitative'}
  },
  "data": {"url": "data/cars.json"}
};

f.area['x,y,stroke'] = {
  "marktype": "area",
  "encoding": {
    "x": {"name": "Displacement","type": 'quantitative'},
    "y": {"name": "Acceleration","type": 'quantitative'},
    "color": {"name": "Miles_per_Gallon","type": 'quantitative'}
  },
  "data": {"url": "data/cars.json"}
};

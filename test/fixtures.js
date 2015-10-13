var f = {};

// BARS

f.bars = {};

f.bars.log_ver = {
  "marktype": "bar",
  "encoding": {
    "x": {"bin": {"maxbins": 15},"type": "Q","name": "IMDB_Rating"},
    "y": {"scale": {"type": "log"},"type": "Q","name": "US_Gross","aggregate": "mean"}
  },
  "data": {"url": "data/movies.json"}
};

f.bars.log_hor = {
  "marktype": "bar",
  "encoding": {
    "y": {"bin": {"maxbins": 15},"type": "Q","name": "IMDB_Rating"},
    "x": {"scale": {"type": "log"},"type": "Q","name": "US_Gross","aggregate": "mean"}
  },
  "data": {"url": "data/movies.json"}
};

f.bars['1d_hor'] = {
  "marktype": "bar",
  "encoding": {"x": {"type": "Q","name": "US_Gross","aggregate": "sum"}},
  "data": {"url": "data/movies.json"}
};


f.bars['1d_ver'] = {
  "marktype": "bar",
  "encoding": {"y": {"type": "Q","name": "US_Gross","aggregate": "sum"}},
  "data": {"url": "data/movies.json"}
};

// STACK

f.stack = {};

f.stack.binY = {
  "marktype": "bar",
  "encoding": {
    "x": {"type": "Q","name": "Cost__Other","aggregate": "mean"},
    "y": {"bin": true,"type": "Q","name": "Cost__Total_$"},
    "color": {"type": "O","name": "Effect__Amount_of_damage"}
  }
};
f.stack.binX = {
  "marktype": "bar",
  "encoding": {
    "y": {"type": "Q","name": "Cost__Other","aggregate": "mean"},
    "x": {"bin": true,"type": "Q","name": "Cost__Total_$"},
    "color": {"type": "O","name": "Effect__Amount_of_damage"}
  }
};

// POINT

f.points = {};

f.points['1d_hor'] = {
  "marktype": "point",
  "encoding": {"x": {"name": "year","type": "O"}},
  "data": {"url": "data/barley.json"}
};

f.points['1d_ver'] = {
  "marktype": "point",
  "encoding": {"y": {"name": "year","type": "O"}},
  "data": {"url": "data/barley.json"}
};

f.points['x,y'] = {
  "marktype": "point",
  "encoding": {"x": {"name": "year","type": "O"},"y": {"name": "yield","type": "Q"}},
  "data": {"url": "data/barley.json"}
};

f.points['x,y,size'] = {
  "marktype": "point",
  "encoding": {
    "x": {"name": "year","type": "O"},
    "y": {"name": "yield","type": "Q"},
    "size": {"name": "*","type": "Q","aggregate": "count"}
  },
  "data": {"url": "data/barley.json"}
};

f.points['x,y,stroke'] = {
  "marktype": "point",
  "encoding": {
    "x": {"name": "year","type": "O"},
    "y": {"name": "yield","type": "Q"},
    "color": {"name": "yield","type": "Q"}
  },
  "data": {"url": "data/barley.json"}
};

f.points['x,y,shape'] = {
  "marktype": "point",
  "encoding": {
    "x": {"name": "year","type": "O"},
    "y": {"name": "yield","type": "Q"},
    "shape": {"bin": {"maxbins": 15},"name": "yield","type": "Q"}
  },
  "data": {"url": "data/barley.json"}
};

// LINE

f.lines = {};

f.lines['x,y'] = {
  "marktype": "line",
  "encoding": {"x": {"name": "year","type": "O"},"y": {"name": "yield","type": "Q"}},
  "data": {"url": "data/barley.json"}
};

f.lines['x,y,stroke'] = {
  "marktype": "line",
  "encoding": {
    "x": {"name": "Name","type": "N"},
    "y": {"name": "Cylinders","type": "O"},
    "color": {"name": "Acceleration","type": "Q"}
  },
  "data": {"url": "data/cars.json"}
};

// AREA

f.area = {};

f.area['x,y'] = {
  "marktype": "area",
  "encoding": {
    "x": {"name": "Displacement","type": "Q"},
    "y": {"name": "Acceleration","type": "Q"}
  },
  "data": {"url": "data/cars.json"}
};

f.area['x,y,stroke'] = {
  "marktype": "area",
  "encoding": {
    "x": {"name": "Displacement","type": "Q"},
    "y": {"name": "Acceleration","type": "Q"},
    "color": {"name": "Miles_per_Gallon","type": "Q"}
  },
  "data": {"url": "data/cars.json"}
};


module.exports = f;

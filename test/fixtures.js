var f = {};

// BARS

f.bars = {};

f.bars.log_ver = {
  "marktype": "bar",
  encoding: {
    "x": {"bin": {"maxbins": 15},"type": "Q","name": "IMDB_Rating"},
    "y": {"scale": {"type": "log"},"type": "Q","name": "US_Gross","aggr": "avg"}
  },
  "config": {"singleHeight": 400,"singleWidth": 400,"largeBandMaxCardinality": 20},
  "data": {"url": "data/movies.json"}
};

f.bars.log_hor = {
  "marktype": "bar",
  encoding: {
    "y": {"bin": {"maxbins": 15},"type": "Q","name": "IMDB_Rating"},
    "x": {"scale": {"type": "log"},"type": "Q","name": "US_Gross","aggr": "avg"}
  },
  "config": {"singleHeight": 400,"singleWidth": 400,"largeBandMaxCardinality": 20},
  "data": {"url": "data/movies.json"}
};

f.bars['1d_hor'] = {
  "marktype": "bar",
  encoding: {"x": {"type": "Q","name": "US_Gross","aggr": "sum"}},
  "config": {"singleHeight": 400,"singleWidth": 400,"largeBandMaxCardinality": 20},
  "data": {"url": "data/movies.json"}
};


f.bars['1d_ver'] = {
  "marktype": "bar",
  encoding: {"y": {"type": "Q","name": "US_Gross","aggr": "sum"}},
  "config": {"singleHeight": 400,"singleWidth": 400,"largeBandMaxCardinality": 20},
  "data": {"url": "data/movies.json"}
};

// STACK

f.stack = {};

f.stack.binY = {
  "marktype": "bar",
  "encoding": {
    "x": {"type": "Q","name": "Cost__Other","aggr": "avg"},
    "y": {"bin": true,"type": "Q","name": "Cost__Total_$"},
    "color": {"type": "O","name": "Effect__Amount_of_damage"}
  }
};
f.stack.binX = {
  "marktype": "bar",
  "encoding": {
    "y": {"type": "Q","name": "Cost__Other","aggr": "avg"},
    "x": {"bin": true,"type": "Q","name": "Cost__Total_$"},
    "color": {"type": "O","name": "Effect__Amount_of_damage"}
  }
};

module.exports = f;
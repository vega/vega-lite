var f = {};

f.log_bar_ver = {
  "marktype": "bar",
  "enc": {
    "x": {"bin": {"maxbins": 15},"type": "Q","name": "IMDB_Rating"},
    "y": {"scale": {"type": "log"},"type": "Q","name": "US_Gross","aggr": "avg"}
  },
  "config": {"singleHeight": 400,"singleWidth": 400,"largeBandMaxCardinality": 20},
  "data": {"url": "data/movies.json"}
};

f.log_bar_hor = {
  "marktype": "bar",
  "enc": {
    "y": {"bin": {"maxbins": 15},"type": "Q","name": "IMDB_Rating"},
    "x": {"scale": {"type": "log"},"type": "Q","name": "US_Gross","aggr": "avg"}
  },
  "config": {"singleHeight": 400,"singleWidth": 400,"largeBandMaxCardinality": 20},
  "data": {"url": "data/movies.json"}
};

module.exports = f; 
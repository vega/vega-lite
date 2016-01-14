/* tslint:disable quote */

// BARS
export const bars = {
  log_ver: {
    'mark': "bar",
    'encoding': {
      'x': {'bin': {'maxbins': 15}, 'type': "quantitative", 'field': 'IMDB_Rating'},
      'y': {'scale': {'type': 'log'}, 'type': "quantitative", 'field': 'US_Gross', 'aggregate': 'mean'}
    },
    'data': {'url': 'data/movies.json'}
  },
  log_hor: {
    'mark': "bar",
    'encoding': {
      'y': {'bin': {'maxbins': 15}, 'type': "quantitative", 'field': 'IMDB_Rating'},
      'x': {'scale': {'type': 'log'}, 'type': "quantitative", 'field': 'US_Gross', 'aggregate': 'mean'}
    },
    'data': {'url': 'data/movies.json'}
  },
  '1d_hor': {
    'mark': "bar",
    'encoding': {'x': {'type': "quantitative", 'field': 'US_Gross', 'aggregate': 'sum'}},
    'data': {'url': 'data/movies.json'}
  },
  '1d_ver': {
    'mark': "bar",
    'encoding': {'y': {'type': "quantitative", 'field': 'US_Gross', 'aggregate': 'sum'}},
    'data': {'url': 'data/movies.json'}
  }
};

// "point"
export const points = {
  "1d_hor": {
    "mark": "point",
    "encoding": {"x": {"field": "year", "type": "ordinal"}},
    "data": {"url": "data/barley.json"}
  },
  "1d_ver": {
    "mark": "point",
    "encoding": {"y": {"field": "year", "type": "ordinal"}},
    "data": {"url": "data/barley.json"}
  },
  "x,y": {
    "mark": "point",
    "encoding": {"x": {"field": "year", "type": "ordinal"},"y": {"field": "yield", "type": "quantitative"}},
    "data": {"url": "data/barley.json"}
  },
  "x,y,size": {
    "mark": "point",
    "encoding": {
      "x": {"field": "year", "type": "ordinal"},
      "y": {"field": "yield", "type": "quantitative"},
      "size": {"field": "*", "type": "quantitative", "aggregate": "count"}
    },
    "data": {"url": "data/barley.json"}
  },
  "x,y,stroke": {
    "mark": "point",
    "encoding": {
      "x": {"field": "year", "type": "ordinal"},
      "y": {"field": "yield", "type": "quantitative"},
      "color": {"field": "yield", "type": "quantitative"}
    },
    "data": {"url": "data/barley.json"}
  },
  "x,y,shape": {
    "mark": "point",
    "encoding": {
      "x": {"field": "year", "type": "ordinal"},
      "y": {"field": "yield", "type": "quantitative"},
      "shape": {"bin": {"maxbins": 15}, "field": "yield", "type": "quantitative"}
    },
    "data": {"url": "data/barley.json"}
  }
};


// "line"
export const lines = {
  "x,y": {
    "mark": "line",
    "encoding": {
      "x": {"field": "year", "type": "ordinal"},
      "y": {"field": "yield", "type": "quantitative"}
    },
    "data": {"url": "data/barley.json"}
  },
  "x,y,stroke": {
    "mark": "line",
    "encoding": {
      "x": {"field": "Name", "type": "nominal"},
      "y": {"field": "Cylinders", "type": "ordinal"},
      "color": {"field": "Acceleration", "type": "quantitative"}
    },
    "data": {"url": "data/cars.json"}
  }
};


// "area"
export const area = {
  "x,y": {
    "mark": "area",
    "encoding": {
      "x": {"field": "Displacement", "type": "quantitative"},
      "y": {"field": "Acceleration", "type": "quantitative"}
    },
    "data": {"url": "data/cars.json"}
  },
  "x,y,color": {
    "mark": "area",
    "encoding": {
      "x": {"field": "Displacement", "type": "quantitative"},
      "y": {"field": "Acceleration", "type": "quantitative"},
      "color": {"field": "Miles_per_Gallon", "type": "quantitative"}
    },
    "data": {"url": "data/cars.json"}
  }
};

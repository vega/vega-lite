import {BAR, POINT, LINE, AREA} from '../src/mark';
import {QUANTITATIVE, ORDINAL, NOMINAL} from '../src/type';

// BARS
export const bars = {
  log_ver: {
    'mark': BAR,
    'encoding': {
      'x': {'bin': {'maxbins': 15}, 'type': QUANTITATIVE, 'field': 'IMDB_Rating'},
      'y': {'scale': {'type': 'log'}, 'type': QUANTITATIVE, 'field': 'US_Gross', 'aggregate': 'mean'}
    },
    'data': {'url': 'data/movies.json'}
  },
  log_hor: {
    'mark': BAR,
    'encoding': {
      'y': {'bin': {'maxbins': 15}, 'type': QUANTITATIVE, 'field': 'IMDB_Rating'},
      'x': {'scale': {'type': 'log'}, 'type': QUANTITATIVE, 'field': 'US_Gross', 'aggregate': 'mean'}
    },
    'data': {'url': 'data/movies.json'}
  },
  '1d_hor': {
    'mark': BAR,
    'encoding': {'x': {'type': QUANTITATIVE, 'field': 'US_Gross', 'aggregate': 'sum'}},
    'data': {'url': 'data/movies.json'}
  },
  '1d_ver': {
    'mark': BAR,
    'encoding': {'y': {'type': QUANTITATIVE, 'field': 'US_Gross', 'aggregate': 'sum'}},
    'data': {'url': 'data/movies.json'}
  }
};


// STACK
export const stack = {
  binY: {
    'mark': BAR,
    'encoding': {
      'x': {'type': QUANTITATIVE, 'field': 'Cost__Other', 'aggregate': 'sum'},
      'y': {'bin': true, 'type': QUANTITATIVE, 'field': 'Cost__Total_$'},
      'color': {'type': ORDINAL, 'field': 'Effect__Amount_of_damage'}
    }
  },
  binX: {
    'mark': BAR,
    'encoding': {
      'y': {'type': QUANTITATIVE, 'field': 'Cost__Other', 'aggregate': 'sum'},
      'x': {'bin': true, 'type': QUANTITATIVE, 'field': 'Cost__Total_$'},
      'color': {'type': ORDINAL, 'field': 'Effect__Amount_of_damage'}
    }
  }
};


// POINT
export const points = {
  '1d_hor': {
    'mark': POINT,
    'encoding': {'x': {'field': 'year', 'type': ORDINAL}},
    'data': {'url': 'data/barley.json'}
  },
  '1d_ver': {
    'mark': POINT,
    'encoding': {'y': {'field': 'year', 'type': ORDINAL}},
    'data': {'url': 'data/barley.json'}
  },
  'x,y': {
    'mark': POINT,
    'encoding': {'x': {'field': 'year', 'type': ORDINAL},'y': {'field': 'yield', 'type': QUANTITATIVE}},
    'data': {'url': 'data/barley.json'}
  },
  'x,y,size': {
    'mark': POINT,
    'encoding': {
      'x': {'field': 'year', 'type': ORDINAL},
      'y': {'field': 'yield', 'type': QUANTITATIVE},
      'size': {'field': '*', 'type': QUANTITATIVE, 'aggregate': 'count'}
    },
    'data': {'url': 'data/barley.json'}
  },
  'x,y,stroke': {
    'mark': POINT,
    'encoding': {
      'x': {'field': 'year', 'type': ORDINAL},
      'y': {'field': 'yield', 'type': QUANTITATIVE},
      'color': {'field': 'yield', 'type': QUANTITATIVE}
    },
    'data': {'url': 'data/barley.json'}
  },
  'x,y,shape': {
    'mark': POINT,
    'encoding': {
      'x': {'field': 'year', 'type': ORDINAL},
      'y': {'field': 'yield', 'type': QUANTITATIVE},
      'shape': {'bin': {'maxbins': 15}, 'field': 'yield', 'type': QUANTITATIVE}
    },
    'data': {'url': 'data/barley.json'}
  }
};


// LINE
export const lines = {
  'x,y': {
    'mark': LINE,
    'encoding': {
      'x': {'field': 'year', 'type': ORDINAL},
      'y': {'field': 'yield', 'type': QUANTITATIVE}
    },
    'data': {'url': 'data/barley.json'}
  },
  'x,y,stroke': {
    'mark': LINE,
    'encoding': {
      'x': {'field': 'Name', 'type': NOMINAL},
      'y': {'field': 'Cylinders', 'type': ORDINAL},
      'color': {'field': 'Acceleration', 'type': QUANTITATIVE}
    },
    'data': {'url': 'data/cars.json'}
  }
};


// AREA
export const area = {
  'x,y': {
    'mark': AREA,
    'encoding': {
      'x': {'field': 'Displacement', 'type': QUANTITATIVE},
      'y': {'field': 'Acceleration', 'type': QUANTITATIVE}
    },
    'data': {'url': 'data/cars.json'}
  },
  'x,y,color': {
    'mark': AREA,
    'encoding': {
      'x': {'field': 'Displacement', 'type': QUANTITATIVE},
      'y': {'field': 'Acceleration', 'type': QUANTITATIVE},
      'color': {'field': 'Miles_per_Gallon', 'type': QUANTITATIVE}
    },
    'data': {'url': 'data/cars.json'}
  }
};

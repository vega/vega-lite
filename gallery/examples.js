'use strict';
// jshint quotmark: false

var EXAMPLES = [
  {
    title: 'Simple Bar Chart',
    description: 'A simple bar chart with embedded data.',
    spec: {
      data: {
        values: [
          {'x':'A', 'y':28}, {'x':'B', 'y':55}, {'x':'C', 'y':43},
          {'x':'G', 'y':19}, {'x':'H', 'y':87}, {'x':'I', 'y':52},
          {'x':'D', 'y':91}, {'x':'E', 'y':81}, {'x':'F', 'y':53}
        ]
      },
      marktype: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'y'},
        x: {type: 'ordinal', field: 'x'}
      }
    }
  },{
    title: 'Formula transform and filter',
    description: 'A simple bar chart with embedded data and uses a filter and formulas.',
    spec: {
      data: {
        values: [
          {'x':'A', 'y':28}, {'x':'B', 'y':55}, {'x':'C', 'y':43},
          {'x':'G', 'y':19}, {'x':'H', 'y':87}, {'x':'I', 'y':52},
          {'x':'D', 'y':91}, {'x':'E', 'y':81}, {'x':'F', 'y':53}
        ],
        'filter': 'datum.y > 60',
        'formulas': [{'field': 'y','expr': '2*datum.y'}]
      },
      marktype: 'bar',
      encoding: {
        y: {type: 'quantitative', field: 'y'},
        x: {type: 'ordinal', field: 'x'}
      }
    }
  },{
    title: 'Aggregate Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'x': {'field': 'Cylinders','type': 'ordinal'},
        'y': {'field': 'Acceleration','type': 'quantitative','aggregate': 'mean'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Grouped bar chart',
    spec: {
      marktype: 'bar',
      encoding: {
        x: {field: 'Origin', type: 'nominal'},
        y: {field: 'Acceleration', type: 'quantitative', aggregate: 'mean'},
        column: {field: 'Cylinders', type: 'ordinal'},
        color: {
          field: 'Origin',
          type: 'nominal'
        }
      },
      data: {url: 'data/cars.json'}
    }
  },{
    title: 'Scatter plot.',
    description: 'Horse power and miles per gallon',
    spec: {
      marktype: 'point',
      encoding: {
        x: {'field': 'Horsepower','type': 'quantitative'},
        y: {'field': 'Miles_per_Gallon','type': 'quantitative'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Binned Scatter plots',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'bin': true,'field': 'Displacement','type': 'quantitative'},
        'y': {'bin': true,'field': 'Miles_per_Gallon','type': 'quantitative'},
        'size': {
          'field': '*',
          'aggregate': 'count',
          'type': 'quantitative',
          'displayName': 'Number of Records'
        }
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Line Chart',
    description: 'Horse power over time',
    spec: {
      marktype: 'line',
      encoding: {
        x: {'field': 'Year','type': 'temporal','timeUnit': 'year'},
        y: {'field': 'Horsepower','type': 'quantitative','aggregate': 'mean'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Histogram',
    spec: {
      marktype: 'bar',
      encoding: {
        x: {'bin': {'maxbins': 15},'field': 'Horsepower','type': 'quantitative'},
        y: {'field': '*','type': 'quantitative','aggregate': 'count'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Stacked Histogram',
    description: 'Simple histogram with bars broken down by the number of cylinders. Also has a legend.',
    spec: {
      marktype: 'bar',
      encoding: {
        x: {'bin': {'maxbins': 15},'field': 'Horsepower','type': 'quantitative'},
        y: {'field': '*','type': 'quantitative','aggregate': 'count'},
        color: {'field': 'Cylinders','type': 'nominal'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Area chart',
    spec: {
      'marktype': 'area',
      'encoding': {
        'x': {'field': 'Year','type': 'temporal','timeUnit': 'year'},
        'y': {'field': 'Weight_in_lbs','type': 'quantitative','aggregate': 'sum'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Stacked Area chart',
    spec: {
      'marktype': 'area',
      'encoding': {
        'x': {'field': 'Year','type': 'temporal','timeUnit': 'year'},
        'y': {'field': 'Weight_in_lbs','type': 'quantitative','aggregate': 'sum'},
        'color': {'field': 'Cylinders', 'type': 'ordinal'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Trellis Area chart',
    spec: {
      'marktype': 'area',
      'encoding': {
        'x': {'field': 'Year','type': 'temporal','timeUnit': 'year'},
        'y': {'field': 'Weight_in_lbs','type': 'quantitative','aggregate': 'sum'},
        'column': {'field': 'Cylinders', 'type': 'ordinal'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Horizontal Stacked Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'x': {'field': 'yield','type': 'quantitative','aggregate': 'sum'},
        'y': {'field': 'variety','type': 'nominal'},
        'color': {'field': 'site', 'type': 'nominal'}
      },
      'data': {'url': 'data/barley.json'}
    }
  },{
    title: 'Vertical Stacked Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'y': {'field': 'yield','type': 'quantitative','aggregate': 'sum'},
        'x': {'field': 'variety','type': 'nominal'},
        'color': {'field': 'site', 'type': 'nominal'}
      },
      'data': {'url': 'data/barley.json'}
    }
  },{
    title: '1D Stack Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'x': {'field': 'Acceleration','type': 'quantitative','aggregate': 'sum'},
        'color': {
          'field': 'Origin',
          'type': 'nominal'
        }
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Trellis Stacked Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'x': {'field': 'yield','type': 'quantitative','aggregate': 'sum'},
        'y': {'field': 'variety','type': 'nominal'},
        'column': {'field': 'year','type': 'ordinal'},
        'color': {'field': 'site', 'type': 'nominal'}
      },
      'data': {'url': 'data/barley.json'}
    }
  },{
    title: 'Trellis Plot',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'field': 'Worldwide_Gross','type': 'quantitative'},
        'y': {'field': 'US_DVD_Sales','type': 'quantitative'},
        'column': {'field': 'MPAA_Rating','type': 'ordinal'}
      },
      'data': {'url': 'data/movies.json'}
    }
  },{
    title: 'Trellis Plot, sorted by mean yield.',
    // TODO: find source of this example and write better description
    description: 'Classic Barley Example',
    spec: {
      data: {url: 'data/barley.json'},
      marktype: 'point',
      encoding: {
        x: {type: 'quantitative',field: 'yield', aggregate: 'mean'},
        y: {
          sort: {field: 'yield', op: 'mean'},
          type: 'ordinal',
          field: 'variety'
        },
        row: {type: 'ordinal', field: 'site'},
        color: {type: 'nominal', field: 'year'}
      }
    }
  },{
    title: 'Text Heatmap',
    spec: {
      'marktype': 'text',
      'encoding': {
        'row': {'field': 'Origin', 'type': 'ordinal'},
        'column': {'field': 'Cylinders', 'type': 'ordinal'},
        'color': {'field': 'Horsepower', 'type': 'quantitative','aggregate': 'mean'},
        'text': {'field': '*', 'type': 'quantitative', 'aggregate': 'count'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Histogram',
    spec: {
      "marktype": "bar",
      "encoding": {
        "x": {"bin": true, "field": "Acceleration","type": "quantitative"},
        "y": {
          "field": "*",
          "aggregate": "count",
          "type": "quantitative",
          "displayName": "Number of Records"
        }
      },
      "data": {"url": "data/cars.json"}
    }
  },{
    title: 'Horizontal Histogram',
    spec: {
      "marktype": "bar",
      "encoding": {
        "y": {"bin": true, "field": "Acceleration","type": "quantitative"},
        "x": {
          "field": "*",
          "aggregate": "count",
          "type": "quantitative",
          "displayName": "Number of Records"
        }
      },
      "data": {"url": "data/cars.json"}
    }
  },{
    title: 'Histogram with point instead',
    spec: {
      "marktype": "point",
      "encoding": {
        "x": {"bin": true,"field": "Acceleration","type": "quantitative"},
        "y": {
          "field": "*",
          "aggregate": "count",
          "type": "quantitative",
          "displayName": "Number of Records"
        }
      },
      "data": {"url": "data/cars.json"}
    }
  },{
    title: 'Histogram with line instead',
    spec: {
      "marktype": "line",
      "encoding": {
        "x": {"bin": true,"field": "Acceleration","type": "quantitative"},
        "y": {
          "field": "*",
          "aggregate": "count",
          "type": "quantitative",
          "displayName": "Number of Records"
        }
      },
      "data": {"url": "data/cars.json"}
    }
  },{
    title: 'Histogram with area instead',
    spec: {
      "marktype": "area",
      "encoding": {
        "x": {"bin": true,"field": "Acceleration","type": "quantitative"},
        "y": {
          "field": "*",
          "aggregate": "count",
          "type": "quantitative",
          "displayName": "Number of Records"
        }
      },
      "data": {"url": "data/cars.json"}
    }
  },{
    title: "Bar chart with log scale and large numbers",
    spec: {
      "marktype": "bar",
      "data": {
        "values": [
          {"m_teps": 33.5330810546875,"dataset": "ak2010"},
          {
            "m_teps": 21.458358764648438,
            "dataset": "belgium_osm"
          },
          {
            "m_teps": 1023.6077880859375,
            "dataset": "cit-Patents"
          },
          {
            "m_teps": 502.16387939453125,
            "dataset": "coAuthorsDBLP"
          },
          {
            "m_teps": 10.410270690917969,
            "dataset": "delaunay_n13"
          },
          {
            "m_teps": 187.35877990722656,
            "dataset": "delaunay_n21"
          },
          {
            "m_teps": 443.1048889160156,
            "dataset": "delaunay_n24"
          },
          {"m_teps": 55.096927642822266,"dataset": "europe_osm"},
          {
            "m_teps": 3530.5595703125,
            "dataset": "kron_g500-logn21"
          },
          {"m_teps": 79.42512512207031,"dataset": "road_usa"},
          {
            "m_teps": 2050.32421875,
            "dataset": "soc-LiveJournal1"
          }
        ]
      },
      "encoding": {
        "y": {
          "scale": {"type": "log"},
          "type": "quantitative",
          "field": "m_teps",
          "axis": {"title": "MTEPS"}
        },
        "x": {"type": "ordinal","field": "dataset"}
      }
    }
  }
];

module.exports = EXAMPLES;

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
        y: {type: 'quantitative', name: 'y'},
        x: {type: 'ordinal', name: 'x'}
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
        y: {type: 'quantitative', name: 'y'},
        x: {type: 'ordinal', name: 'x'}
      }
    }
  },{
    title: 'Aggregate Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'x': {'name': 'Cylinders','type': 'ordinal'},
        'y': {'name': 'Acceleration','type': 'quantitative','aggregate': 'mean'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Grouped bar chart',
    spec: {
      marktype: 'bar',
      encoding: {
        x: {name: 'Origin', type: 'nominal'},
        y: {name: 'Acceleration', type: 'quantitative', aggregate: 'mean'},
        col: {name: 'Cylinders', type: 'ordinal'},
        color: {
          name: 'Origin',
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
        x: {'name': 'Horsepower','type': 'quantitative'},
        y: {'name': 'Miles_per_Gallon','type': 'quantitative'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Binned Scatter plots',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'bin': true,'name': 'Displacement','type': 'quantitative'},
        'y': {'bin': true,'name': 'Miles_per_Gallon','type': 'quantitative'},
        'size': {
          'name': '*',
          'aggregate': 'count',
          'type': 'quantitative',
          'displayName': 'Number of Records'
        }
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Scatter Plot with Ordinal on Top',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'name': 'MPAA_Rating','type': 'nominal'},
        'y': {'name': 'Release_Date','type': 'nominal'}
      },
      'data': {'url': 'data/movies.json'}
    }
  },{
    title: 'Line Chart',
    description: 'Horse power over time',
    spec: {
      marktype: 'line',
      encoding: {
        x: {'name': 'Year','type': 'temporal','timeUnit': 'year'},
        y: {'name': 'Horsepower','type': 'quantitative','aggregate': 'mean'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Histogram',
    spec: {
      marktype: 'bar',
      encoding: {
        x: {'bin': {'maxbins': 15},'name': 'Horsepower','type': 'quantitative'},
        y: {'name': '*','type': 'quantitative','aggregate': 'count'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Stacked Histogram',
    description: 'Simple histogram with bars broken down by the number of cylinders. Also has a legend.',
    spec: {
      marktype: 'bar',
      encoding: {
        x: {'bin': {'maxbins': 15},'name': 'Horsepower','type': 'quantitative'},
        y: {'name': '*','type': 'quantitative','aggregate': 'count'},
        color: {'name': 'Cylinders','type': 'nominal'}
      },
      data: {'url': 'data/cars.json'}
    }
  },{
    title: 'Area chart',
    spec: {
      'marktype': 'area',
      'encoding': {
        'x': {'name': 'Year','type': 'temporal','timeUnit': 'year'},
        'y': {'name': 'Weight_in_lbs','type': 'quantitative','aggregate': 'sum'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Stacked Area chart',
    spec: {
      'marktype': 'area',
      'encoding': {
        'x': {'name': 'Year','type': 'temporal','timeUnit': 'year'},
        'y': {'name': 'Weight_in_lbs','type': 'quantitative','aggregate': 'sum'},
        'color': {'name': 'Cylinders', 'type': 'ordinal'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Trellis Area chart',
    spec: {
      'marktype': 'area',
      'encoding': {
        'x': {'name': 'Year','type': 'temporal','timeUnit': 'year'},
        'y': {'name': 'Weight_in_lbs','type': 'quantitative','aggregate': 'sum'},
        'col': {'name': 'Cylinders', 'type': 'ordinal'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Horizontal Stacked Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'x': {'name': 'yield','type': 'quantitative','aggregate': 'sum'},
        'y': {'name': 'variety','type': 'nominal'},
        'color': {'name': 'site', 'type': 'nominal'}
      },
      'data': {'url': 'data/barley.json'}
    }
  },{
    title: 'Vertical Stacked Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'y': {'name': 'yield','type': 'quantitative','aggregate': 'sum'},
        'x': {'name': 'variety','type': 'nominal'},
        'color': {'name': 'site', 'type': 'nominal'}
      },
      'data': {'url': 'data/barley.json'}
    }
  },{
    title: '1D Stack Bar Chart',
    spec: {
      'marktype': 'bar',
      'encoding': {
        'x': {'name': 'Acceleration','type': 'quantitative','aggregate': 'sum'},
        'color': {
          'name': 'Origin',
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
        'x': {'name': 'yield','type': 'quantitative','aggregate': 'sum'},
        'y': {'name': 'variety','type': 'nominal'},
        'col': {'name': 'year','type': 'ordinal'},
        'color': {'name': 'site', 'type': 'nominal'}
      },
      'data': {'url': 'data/barley.json'}
    }
  },{
    title: 'Trellis Plot',
    spec: {
      'marktype': 'point',
      'encoding': {
        'x': {'name': 'Worldwide_Gross','type': 'quantitative'},
        'y': {'name': 'US_DVD_Sales','type': 'quantitative'},
        'col': {'name': 'MPAA_Rating','type': 'ordinal'}
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
        x: {type: 'quantitative',name: 'yield', aggregate: 'mean'},
        y: {
          sort: {field: 'yield', op: 'mean'},
          type: 'ordinal',
          name: 'variety'
        },
        row: {type: 'ordinal',name: 'site'},
        color: {type: 'nominal',name: 'year'}
      }
    }
  },{
    title: 'Text Heatmap',
    spec: {
      'marktype': 'text',
      'encoding': {
        'row': {'name': 'Origin','type': 'ordinal'},
        'col': {'name': 'Cylinders','type': 'ordinal'},
        'color': {'name': 'Horsepower','type': 'quantitative','aggregate': 'mean'},
        'text': {'name': '*','type': 'quantitative','aggregate': 'count'}
      },
      'data': {'url': 'data/cars.json'}
    }
  },{
    title: 'Histogram',
    spec: {
      "marktype": "bar",
      "encoding": {
        "x": {"bin": true,"name": "Acceleration","type": "quantitative"},
        "y": {
          "name": "*",
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
        "y": {"bin": true,"name": "Acceleration","type": "quantitative"},
        "x": {
          "name": "*",
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
        "x": {"bin": true,"name": "Acceleration","type": "quantitative"},
        "y": {
          "name": "*",
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
        "x": {"bin": true,"name": "Acceleration","type": "quantitative"},
        "y": {
          "name": "*",
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
        "x": {"bin": true,"name": "Acceleration","type": "quantitative"},
        "y": {
          "name": "*",
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
          "name": "m_teps",
          "axis": {"title": "MTEPS"}
        },
        "x": {"type": "ordinal","name": "dataset"}
      }
    }
  }
];

module.exports = EXAMPLES;

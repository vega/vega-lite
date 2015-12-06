# datalib

[![Build Status](https://travis-ci.org/vega/datalib.svg?branch=master)](https://travis-ci.org/vega/datalib)
[![npm version](https://img.shields.io/npm/v/datalib.svg)](https://www.npmjs.com/package/datalib)

Datalib is a JavaScript data utility library. It provides facilities for data loading, type inference, common statistics, and string templates. While created to power [Vega](http://vega.github.io) and related projects, datalib is a standalone library useful for data-driven JavaScript applications on both the client (web browser) and server (e.g., node.js).

For documentation, see the datalib [API Reference](../../wiki/API-Reference).

## Use

Datalib provides a set of utilities for working with data. These include:

- Loading and parsing data files (JSON, TopoJSON, CSV, TSV).
- Summary statistics (mean, deviation, median, correlation, histograms, etc).
- Group-by aggregation queries, including streaming data support.
- Data-driven string templates with expressive formatting filters.
- Utilities for working with JavaScript functions, objects and arrays.

Datalib can be used both server-side and client-side. For use in node.js,
simply `npm install datalib` or include datalib as a dependency in your package.json file. For use on the client, install datalib via `bower install datalib` or include datalib.min.js on your web page. The minified JS file is built using browserify (see below for details).

### Example

```javascript
// Load datalib.
var dl = require('datalib');

// Load and parse a CSV file. Datalib does type inference for you.
// The result is an array of JavaScript objects with named values.
// Parsed dates are stored as UNIX timestamp values.
var data = dl.csv('http://vega.github.io/datalib/data/stocks.csv');

// Show summary statistics for each column of the data table.
console.log(dl.format.summary(data));

// Compute mean and standard deviation by ticker symbol.
var rollup = dl.groupby('symbol')
  .summarize({'price': ['mean', 'stdev']})
  .execute(data);
console.log(dl.format.table(rollup));

// Compute correlation measures between price and date.
console.log(
  dl.cor(data, 'price', 'date'),      // Pearson product-moment correlation
  dl.cor.rank(data, 'price', 'date'), // Spearman rank correlation
  dl.cor.dist(data, 'price', 'date')  // Distance correlation
);

// Compute mutual information distance between years and binned price.
var bin_price = dl.$bin(data, 'price'); // returns binned price values
var year_date = dl.$year('date');       // returns year from date field
var counts = dl.groupby(year_date, bin_price).count().execute(data);
console.log(dl.mutual.dist(counts, 'bin_price', 'year_date', 'count'));
```

## Build Process

To use datalib in the browser, you need to build the datalib.js and datalib.min.js files. We assume that you have [npm](https://www.npmjs.com/) installed.

1. Run `npm install` in the datalib folder to install dependencies.
2. Run `npm run build`. This will invoke [browserify](http://browserify.org/) to bundle the source files into datalib.js, and then [uglify-js](http://lisperator.net/uglifyjs/) to create the minified datalib.min.js.

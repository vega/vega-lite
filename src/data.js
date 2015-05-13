'use strict';

var vldata = module.exports = {},
  vlfield = require('./field'),
  util = require('./util');

/** Mapping from datalib's inferred type to Vega-lite's type */
vldata.types = {
  'boolean': 'O',
  'number': 'Q',
  'integer': 'Q',
  'date': 'T',
  'string': 'O'
};


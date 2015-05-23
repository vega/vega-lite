'use strict';

require('./globals');

var vldata = module.exports = {};

/** Mapping from datalib's inferred type to Vega-lite's type */
vldata.types = {
  'boolean': O,
  'number': Q,
  'integer': Q,
  'date': T,
  'string': O
};


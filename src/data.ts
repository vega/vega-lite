/*
 * Constants and utilities for data.
 */

import * as util from './util';
import {NOMINAL, ORDINAL, QUANTITATIVE, TEMPORAL} from './type';

export const SUMMARY = 'summary';
export const SOURCE = 'source';
export const STACKED = 'stacked';
export const LAYOUT = 'layout';

/** Mapping from datalib's inferred type to Vega-lite's type */
// TODO: ALL_CAPS
export const types = {
  'boolean': NOMINAL,
  'number': QUANTITATIVE,
  'integer': QUANTITATIVE,
  'date': TEMPORAL,
  'string': NOMINAL
};

export function stats(data: Array<Array<any>>) {
  var summary = util.summary(data);

  return summary.reduce(function(s, profile) {
    s[profile.field] = profile;
    return s;
  }, {
    '*': {
      max: data.length,
      min: 0
    }
  });
}

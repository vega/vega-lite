/*
 * Constants and utilities for data. 
 */

import * as util from './util';
import {Type} from './consts';



export const SUMMARY = 'summary';
export const SOURCE = 'source';
export const STACKED = 'stacked';

/** Mapping from datalib's inferred type to Vega-lite's type */
// TODO: ALL_CAPS
export const types = {
  'boolean': Type.NOMINAL,
  'number': Type.QUANTITATIVE,
  'integer': Type.QUANTITATIVE,
  'date': Type.TEMPORAL,
  'string': Type.NOMINAL
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

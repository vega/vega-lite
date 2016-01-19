/*
 * Constants and utilities for data.
 */

import {NOMINAL, QUANTITATIVE, TEMPORAL} from './type';

export const SUMMARY = 'summary';
export const SOURCE = 'source';
export const STACKED_SCALE = 'stacked_scale';
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

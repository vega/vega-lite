import * as util from './util';
import {Type} from './consts';

/** Mapping from datalib's inferred type to Vega-lite's type */
// TODO: ALL_CAPS
export const types = {
  'boolean': Type.Nominal,
  'number': Type.Quantitative,
  'integer': Type.Quantitative,
  'date': Type.Temporal,
  'string': Type.Nominal
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

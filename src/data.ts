import * as util from './util';

/** Mapping from datalib's inferred type to Vega-lite's type */
export var types = {
  'boolean': N,
  'number': Q,
  'integer': Q,
  'date': T,
  'string': N
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
};

// Package of defining Vega-lite Specification's json schema

import * as schemaUtil from './schemautil';
import {mark} from './mark.schema';
import {config, Config} from './config.schema';
import {data, Data} from './data.schema';
import {encoding, Encoding} from './encoding.schema';
import {Mark} from '../mark';

export interface Spec {
  name?: string;
  description?: string;
  data?: Data;
  mark?: Mark;
  encoding?: Encoding;
  config?: Config;
}

// TODO remove this
export {aggregate} from './fielddef.schema';

export var util = schemaUtil;

/** @type Object Schema of a vega-lite specification */
export var schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: 'Schema for Vega-lite specification',
  type: 'object',
  required: ['mark', 'encoding'],
  properties: {
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    data: data,
    mark: mark,
    encoding: encoding,
    config: config
  }
};

/** Instantiate a verbose vl spec from the schema */
export function instantiate() {
  return schemaUtil.instantiate(schema);
};

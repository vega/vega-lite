// Package of defining Vega-lite Specification's json schema

import * as schemaUtil from './schemautil';
import {mark} from './mark.schema';
import {config, Config} from './config.schema';
import {data, Data} from './data.schema';
import {encoding, Encoding} from './encoding.schema';
import {Mark} from '../mark';
import {transform, Transform} from './transform.schema';

/** Schema for Vega-Lite specification */
export interface Spec {
  /** A name for the specification. The name is used to annotate marks, scale names, and more. */
  name?: string;
  description?: string;
  data?: Data;
  transform?: Transform;
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
    transform: transform,
    mark: mark,
    encoding: encoding,
    config: config
  }
};

/** Instantiate a verbose vl spec from the schema */
export function instantiate() {
  return schemaUtil.instantiate(schema);
};

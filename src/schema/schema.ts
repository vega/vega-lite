// Package of defining Vega-lite Specification's json schema

/// <reference path="../../typings/vega.d.ts"/>

import * as schemaUtil from './schemautil';
import {marktype} from './marktype.schema';
import {config} from './config.schema';
import {data, Data} from './data.schema';
import {encoding, Encoding} from './encoding.schema';
import {Marktype} from '../marktype';

export interface Spec {
  data?: Data;
  marktype?: Marktype;
  encoding?: Encoding;
  config?: any; // FIXME: declare
}

// TODO remove this
export {aggregate} from './fielddef.schema';

export var util = schemaUtil;

/** @type Object Schema of a vega-lite specification */
export var schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: 'Schema for Vega-lite specification',
  type: 'object',
  required: ['marktype', 'encoding'],
  properties: {
    data: data,
    marktype: marktype,
    encoding: encoding,
    config: config
  }
};

/** Instantiate a verbose vl spec from the schema */
export function instantiate() {
  return schemaUtil.instantiate(schema);
};

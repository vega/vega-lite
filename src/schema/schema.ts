// Package of defining Vega-lite Specification's json schema

import {Config} from './config.schema';
import {Data} from './data.schema';
import {Encoding} from './encoding.schema';
import {Mark} from '../mark';
import {Transform} from './transform.schema';

/**
 * Schema for Vega-Lite specification
 * @required ["mark", "encoding"]
 */
export interface Spec {
  /**
   * A name for the specification. The name is used to annotate marks, scale names, and more.
   */
  name?: string;
  description?: string;
  data?: Data;
  transform?: Transform;
  mark: Mark;
  encoding: Encoding;
  config?: Config;
}

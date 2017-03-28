import {VgProjectionConfig} from './vega.schema';

/**
 * Top-level projection object.
 */
export interface Projection extends VgProjectionConfig {}

export interface ProjectionConfig extends Projection {}

export const defaultProjectionConfig: ProjectionConfig = {
  type: 'mercator'
};

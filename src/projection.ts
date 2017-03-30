import {VgProjectionBase} from './vega.schema';
/**
 * Top-level projection object.
 */
export interface Projection extends VgProjectionBase {}

export const PROJECTION_PROPERTIES:(keyof Projection)[] = ['type', 'center', 'translate', 'zoom', 'rotate', 'precision', 'clipAngle', 'scale', 'clipExtent'];

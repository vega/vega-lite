import {VgEncodeEntry, VgPostEncodingTransform} from '../../vega.schema';
import {UnitModel} from '../unit';

/**
 * Abstract interface for compiling a Vegemite primitive mark type.
 */
export interface MarkCompiler {
  /**
   * Underlying vega Mark type for the Vegemite mark.
   */
  vgMark: 'area' | 'line' | 'symbol' | 'rect' | 'rule' | 'text' | 'shape';

  encodeEntry: (model: UnitModel) => VgEncodeEntry;

  /**
   * Transform on a mark after render, used for layout and projections
   */
  postEncodingTransform?: (model: UnitModel) => VgPostEncodingTransform[];
}

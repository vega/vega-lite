import {VgEncodeEntry} from '../../vega.schema';
import {UnitModel} from '../unit';

/**
 * Abstract interface for compiling a Vega-Lite primitive mark type.
 */
export interface MarkCompiler {
  /**
   * Underlying vega Mark type for the Vega-Lite mark.
   */
  vgMark: 'area' | 'line' | 'symbol' | 'rect' | 'rule' | 'text';

  encodeEntry: (model: UnitModel) => VgEncodeEntry;
}

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

  /**
   * Vega's Mark role, which enables use to use config.<vega-lite>.* in parser.
   * Basically for marks that are not Vega marks, we output roles for all of them.
   */
  defaultRole: 'bar' | 'point' | 'circle' | 'square' | 'tick' | undefined;
  encodeEntry: (model: UnitModel) => VgEncodeEntry;
}

import {UnitModel} from '../unit';
import {VgEncodeEntry} from '../../vega.schema';

/**
 * Abstract interface for compiling a Vega-Lite primitive mark type.
 */
export interface MarkCompiler {
  markType: () => 'area' | 'line' | 'symbol' | 'rect' | 'rule' | 'text';
  encodeEntry: (model: UnitModel) => VgEncodeEntry;
}

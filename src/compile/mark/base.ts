import {UnitModel} from '../unit';
import {VgMarkGroup} from '../../vega.schema';

/**
 * Abstract interface for compiling a Vega-Lite primitive mark type.
 */
export interface MarkCompiler {
  markType: () => 'area' | 'line' | 'symbol' | 'rect' | 'rule' | 'text';
  encodeEntry: (model: UnitModel) => VgMarkGroup;
}

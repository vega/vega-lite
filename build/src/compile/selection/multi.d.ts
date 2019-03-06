import { UnitModel } from '../unit';
import { SelectionCompiler, SelectionComponent } from './selection';
export declare function singleOrMultiSignals(model: UnitModel, selCmpt: SelectionComponent<'single' | 'multi'>): any[];
declare const multi: SelectionCompiler<'multi'>;
export default multi;

import { SelectionCompiler, SelectionComponent } from '.';
import { UnitModel } from '../unit';
export declare function singleOrMultiSignals(model: UnitModel, selCmpt: SelectionComponent<'single' | 'multi'>): any[];
declare const multi: SelectionCompiler<'multi'>;
export default multi;

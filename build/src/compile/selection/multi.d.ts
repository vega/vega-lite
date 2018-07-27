import { UnitModel } from '../unit';
import { SelectionCompiler, SelectionComponent } from './selection';
export declare function signals(model: UnitModel, selCmpt: SelectionComponent): {
    name: string;
    value: {};
    on: {
        events: any;
        update: string;
        force: boolean;
    }[];
}[];
declare const multi: SelectionCompiler;
export default multi;

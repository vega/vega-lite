import { SelectionCompiler, SelectionComponent } from './selection';
export declare const BRUSH = "_brush", SIZE = "_size";
declare const interval: SelectionCompiler;
export { interval as default };
export declare function projections(selCmpt: SelectionComponent): {
    x: number;
    y: number;
};

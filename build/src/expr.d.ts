import { Dict } from './util';
import { MappedExclude } from './vega.schema';
export interface ExprRef {
    /**
     * Vega expression (which can refer to Vega-Lite parameters).
     */
    expr: string;
}
export declare function isExprRef(o: any): o is ExprRef;
export declare function replaceExprRef<T extends Dict<any>>(index: T): MappedExclude<T, ExprRef>;
//# sourceMappingURL=expr.d.ts.map
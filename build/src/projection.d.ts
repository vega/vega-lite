import { BaseProjection, SignalRef, Vector2 } from 'vega';
import { ExprRef } from './expr';
import { MapExcludeValueRefAndReplaceSignalWith, ProjectionType } from './vega.schema';
export interface Projection<ES extends ExprRef | SignalRef> extends MapExcludeValueRefAndReplaceSignalWith<BaseProjection, ES> {
    /**
     * The cartographic projection to use. This value is case-insensitive, for example `"albers"` and `"Albers"` indicate the same projection type. You can find all valid projection types [in the documentation](https://vega.github.io/vega-lite/docs/projection.html#projection-types).
     *
     * __Default value:__ `equalEarth`
     */
    type?: ProjectionType | ES;
    /**
     * The projection’s scale (zoom) factor, overriding automatic fitting. The default scale is projection-specific. The scale factor corresponds linearly to the distance between projected points; however, scale factor values are not equivalent across projections.
     */
    scale?: number | ES;
    /**
     * The projection’s translation offset as a two-element array `[tx, ty]`.
     */
    translate?: Vector2<number> | ES;
}
/**
 * Any property of Projection can be in config
 */
export type ProjectionConfig = Projection<ExprRef>;
export declare const PROJECTION_PROPERTIES: (keyof Projection<ExprRef>)[];
//# sourceMappingURL=projection.d.ts.map
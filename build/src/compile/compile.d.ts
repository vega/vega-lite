import { Spec as VgSpec, LoggerInterface } from 'vega';
import * as vlFieldDef from '../channeldef';
import { Config } from '../config';
import { TopLevelSpec } from '../spec';
export interface CompileOptions {
    config?: Config;
    logger?: LoggerInterface;
    fieldTitle?: vlFieldDef.FieldTitleFormatter;
}
/**
 * Vega-Lite's main function, for compiling Vega-lite spec into Vega spec.
 *
 * At a high-level, we make the following transformations in different phases:
 *
 * Input spec
 *     |
 *     |  (Normalization)
 *     v
 * Normalized Spec (Row/Column channels in single-view specs becomes faceted specs, composite marks becomes layered specs.)
 *     |
 *     |  (Build Model)
 *     v
 * A model tree of the spec
 *     |
 *     |  (Parse)
 *     v
 * A model tree with parsed components (intermediate structure of visualization primitives in a format that can be easily merged)
 *     |
 *     | (Optimize)
 *     v
 * A model tree with parsed components with the data component optimized
 *     |
 *     | (Assemble)
 *     v
 * Vega spec
 */
export declare function compile(inputSpec: TopLevelSpec, opt?: CompileOptions): {
    spec: VgSpec;
};
//# sourceMappingURL=compile.d.ts.map
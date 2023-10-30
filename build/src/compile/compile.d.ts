import { LoggerInterface, Spec as VgSpec } from 'vega';
import * as vlFieldDef from '../channeldef';
import { Config } from '../config';
import { LayoutSizeMixins, TopLevel, TopLevelSpec } from '../spec';
export interface CompileOptions {
    /**
     * Sets a Vega-Lite configuration.
     */
    config?: Config;
    /**
     * Sets a custom logger.
     */
    logger?: LoggerInterface;
    /**
     * Sets a field title formatter.
     */
    fieldTitle?: vlFieldDef.FieldTitleFormatter;
}
/**
 * Vega-Lite's main function, for compiling Vega-Lite spec into Vega spec.
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
 *
 * @param inputSpec The Vega-Lite specification.
 * @param opt       Optional arguments passed to the Vega-Lite compiler.
 * @returns         An object containing the compiled Vega spec and normalized Vega-Lite spec.
 */
export declare function compile(inputSpec: TopLevelSpec, opt?: CompileOptions): {
    spec: VgSpec;
    normalized: TopLevel<import("../spec").NormalizedSpec> & LayoutSizeMixins;
};
//# sourceMappingURL=compile.d.ts.map
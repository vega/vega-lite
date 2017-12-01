import { Config } from '../config';
import * as vlFieldDef from '../fielddef';
import * as log from '../log';
import { TopLevelExtendedSpec } from '../spec';
export interface CompileOptions {
    config?: Config;
    logger?: log.LoggerInterface;
    fieldTitle?: vlFieldDef.FieldTitleFormatter;
}
/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
export declare function compile(inputSpec: TopLevelExtendedSpec, opt?: CompileOptions): {
    spec: any;
};

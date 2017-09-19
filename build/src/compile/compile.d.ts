import * as log from '../log';
import { TopLevelExtendedSpec } from '../spec';
/**
 * Module for compiling Vega-lite spec into Vega spec.
 */
export declare function compile(inputSpec: TopLevelExtendedSpec, logger?: log.LoggerInterface): {
    spec: any;
};

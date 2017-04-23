import * as log from '../log';
import { TopLevelExtendedSpec } from '../spec';
import { Model } from './model';
export declare function compile(inputSpec: TopLevelExtendedSpec, logger?: log.LoggerInterface): {
    spec: any;
};
export declare function assembleNestedMainGroup(model: Model): any;

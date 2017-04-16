import * as log from '../log';
import { TopLevelExtendedSpec } from '../spec';
import { Model } from './model';
export declare function compile(inputSpec: TopLevelExtendedSpec, logger?: log.LoggerInterface): {
    spec: any;
};
export declare function assembleRootGroup(model: Model): any;

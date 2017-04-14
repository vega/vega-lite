import * as log from '../log';
import { ExtendedSpec, TopLevel } from '../spec';
import { Model } from './model';
export declare function compile(inputSpec: TopLevel<ExtendedSpec>, logger?: log.LoggerInterface): {
    spec: any;
};
export declare function assembleRootGroup(model: Model): any;

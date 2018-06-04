import { Config } from '../config';
import { LayoutSizeMixins, NormalizedSpec } from '../spec';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare function buildModel(spec: NormalizedSpec, parent: Model, parentGivenName: string, unitSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config, fit: boolean): Model;

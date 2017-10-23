import { Config } from '../config';
import { LayoutSizeMixins, Spec } from '../spec';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare function buildModel(spec: Spec, parent: Model, parentGivenName: string, unitSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config, fit: boolean): Model;

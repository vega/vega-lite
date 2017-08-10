import { Config } from '../config';
import { Repeat } from '../repeat';
import { RepeatSpec } from '../spec';
import { VgLayout } from '../vega.schema';
import { BaseConcatModel } from './baseconcat';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare class RepeatModel extends BaseConcatModel {
    readonly type: 'repeat';
    readonly repeat: Repeat;
    readonly children: Model[];
    constructor(spec: RepeatSpec, parent: Model, parentGivenName: string, repeatValues: RepeaterValue, config: Config);
    private _initChildren(spec, repeat, repeater, config);
    parseLayoutSize(): void;
    assembleLayout(): VgLayout;
}

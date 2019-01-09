import { Config } from '../config';
import { NormalizedRepeatSpec } from '../spec';
import { Repeat } from '../spec/repeat';
import { VgLayout } from '../vega.schema';
import { BaseConcatModel } from './baseconcat';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare class RepeatModel extends BaseConcatModel {
    readonly type: 'repeat';
    readonly repeat: Repeat;
    readonly children: Model[];
    constructor(spec: NormalizedRepeatSpec, parent: Model, parentGivenName: string, repeatValues: RepeaterValue, config: Config);
    private _initChildren;
    parseLayoutSize(): void;
    protected assembleDefaultLayout(): VgLayout;
}

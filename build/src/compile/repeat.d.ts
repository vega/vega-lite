import { Config } from '../config';
import { NormalizedRepeatSpec } from '../spec';
import { RepeatMapping } from '../spec/repeat';
import { VgLayout } from '../vega.schema';
import { BaseConcatModel } from './baseconcat';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare class RepeatModel extends BaseConcatModel {
    readonly repeat: RepeatMapping | string[];
    readonly children: Model[];
    constructor(spec: NormalizedRepeatSpec, parent: Model, parentGivenName: string, repeatValues: RepeaterValue, config: Config);
    private _initChildren;
    parseLayoutSize(): void;
    protected assembleDefaultLayout(): VgLayout;
}
//# sourceMappingURL=repeat.d.ts.map
import { Config } from '../config';
import { NormalizedConcatSpec } from '../spec';
import { VgLayout } from '../vega.schema';
import { BaseConcatModel } from './baseconcat';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare class ConcatModel extends BaseConcatModel {
    readonly children: Model[];
    readonly concatType: 'vconcat' | 'hconcat' | 'concat';
    constructor(spec: NormalizedConcatSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config);
    private getChildren;
    parseLayoutSize(): void;
    parseAxisGroup(): void;
    protected assembleDefaultLayout(): VgLayout;
}
//# sourceMappingURL=concat.d.ts.map
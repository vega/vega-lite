import { NewSignal } from 'vega';
import { Config } from '../config';
import { Resolve } from '../resolve';
import { SpecType } from '../spec/base';
import { NormalizedConcatSpec } from '../spec/concat';
import { NormalizedRepeatSpec } from '../spec/repeat';
import { VgData } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare abstract class BaseConcatModel extends Model {
    constructor(spec: NormalizedConcatSpec | NormalizedRepeatSpec, specType: SpecType, parent: Model, parentGivenName: string, config: Config, repeater: RepeaterValue, resolve: Resolve);
    parseData(): void;
    parseSelections(): void;
    parseMarkGroup(): void;
    parseAxesAndHeaders(): void;
    assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[];
    assembleSignals(): NewSignal[];
    assembleLayoutSignals(): NewSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleMarks(): any[];
}
//# sourceMappingURL=baseconcat.d.ts.map
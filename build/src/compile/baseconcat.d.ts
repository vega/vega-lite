import { Config } from '../config';
import { ResolveMapping } from '../resolve';
import { BaseSpec } from '../spec';
import { VgData, VgScale, VgSignal } from '../vega.schema';
import { Model } from './model';
export declare abstract class BaseConcatModel extends Model {
    constructor(spec: BaseSpec, parent: Model, parentGivenName: string, config: Config, resolve: ResolveMapping);
    parseData(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    assembleScales(): VgScale[];
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleLayoutSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleMarks(): any[];
}

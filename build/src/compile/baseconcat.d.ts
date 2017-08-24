import { Config } from '../config';
import { Resolve } from '../resolve';
import { BaseSpec } from '../spec';
import { VgData, VgSignal } from '../vega.schema';
import { Model } from './model';
export declare abstract class BaseConcatModel extends Model {
    constructor(spec: BaseSpec, parent: Model, parentGivenName: string, config: Config, resolve: Resolve);
    parseData(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    assembleSelectionTopLevelSignals(signals: any[]): VgSignal[];
    assembleSelectionSignals(): VgSignal[];
    assembleLayoutSignals(): VgSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleMarks(): any[];
}

import { NewSignal } from 'vega';
import { Config } from '../config';
import { Resolve } from '../resolve';
import { BaseSpec } from '../spec';
import { VgData } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare abstract class BaseConcatModel extends Model {
    constructor(spec: BaseSpec, parent: Model, parentGivenName: string, config: Config, repeater: RepeaterValue, resolve: Resolve);
    parseData(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[];
    assembleSelectionSignals(): NewSignal[];
    assembleLayoutSignals(): NewSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleMarks(): any[];
}

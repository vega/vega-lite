import { Legend as VgLegend, NewSignal, Title as VgTitle } from 'vega';
import { Config } from '../config';
import { LayoutSizeMixins, NormalizedLayerSpec } from '../spec';
import { VgData, VgLayout } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare class LayerModel extends Model {
    readonly type: 'layer';
    readonly children: Model[];
    constructor(spec: NormalizedLayerSpec, parent: Model, parentGivenName: string, parentGivenSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config, fit: boolean);
    parseData(): void;
    parseLayoutSize(): void;
    parseSelection(): void;
    parseMarkGroup(): void;
    parseAxisAndHeader(): void;
    assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[];
    assembleSelectionSignals(): NewSignal[];
    assembleLayoutSignals(): NewSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleTitle(): VgTitle;
    assembleLayout(): VgLayout;
    assembleMarks(): any[];
    assembleLegends(): VgLegend[];
}

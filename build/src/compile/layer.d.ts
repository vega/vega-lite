import { Legend as VgLegend, NewSignal, Title as VgTitle } from 'vega';
import { Config } from '../config';
import { LayoutSizeMixins, NormalizedLayerSpec } from '../spec';
import { VgData, VgLayout } from '../vega.schema';
import { Model } from './model';
import { RepeaterValue } from './repeater';
export declare class LayerModel extends Model {
    readonly children: Model[];
    constructor(spec: NormalizedLayerSpec, parent: Model, parentGivenName: string, parentGivenSize: LayoutSizeMixins, repeater: RepeaterValue, config: Config, fit: boolean);
    parseData(): void;
    parseLayoutSize(): void;
    parseSelections(): void;
    parseMarkGroup(): void;
    parseAxesAndHeaders(): void;
    assembleSelectionTopLevelSignals(signals: NewSignal[]): NewSignal[];
    assembleSignals(): NewSignal[];
    assembleLayoutSignals(): NewSignal[];
    assembleSelectionData(data: VgData[]): VgData[];
    assembleTitle(): VgTitle;
    assembleLayout(): VgLayout;
    assembleMarks(): any[];
    assembleLegends(): VgLegend[];
}
//# sourceMappingURL=layer.d.ts.map
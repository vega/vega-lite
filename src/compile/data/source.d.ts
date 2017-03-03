import { VgData } from '../../vega.schema';
import { FacetModel } from '../facet';
import { LayerModel } from '../layer';
import { Model } from './../model';
import { DataComponent } from './data';
export declare namespace source {
    const parseUnit: (model: Model) => VgData;
    function parseFacet(model: FacetModel): VgData;
    function parseLayer(model: LayerModel): VgData;
    function assemble(component: DataComponent): VgData;
}

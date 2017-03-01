import { VgData } from '../../vega.schema';
import { FacetModel } from './../facet';
import { LayerModel } from './../layer';
import { Model } from './../model';
import { SummaryComponent } from './data';
export declare namespace summary {
    function parseUnit(model: Model): SummaryComponent[];
    function parseFacet(model: FacetModel): SummaryComponent[];
    function parseLayer(model: LayerModel): SummaryComponent[];
    /**
     * Assemble the summary. Needs a rename function because we cannot guarantee that the
     * parent data before the children data.
     */
    function assemble(component: SummaryComponent[], sourceName: string): VgData[];
}

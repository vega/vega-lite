import { FieldDef } from '../../fielddef';
import { Formula } from '../../transform';
import { Dict, StringSet } from '../../util';
import { VgData, VgSort, VgTransform } from '../../vega.schema';
import { FacetModel } from './../facet';
import { LayerModel } from './../layer';
import { Model } from './../model';
import { UnitModel } from './../unit';
import { StackComponent } from './stack';
/**
 * Composable component instance of a model's data.
 */
export interface DataComponent {
    source: VgData;
    /** Mapping from field name to primitive data type.  */
    formatParse: Dict<string>;
    /** String set of fields for null filtering */
    nullFilter: Dict<FieldDef>;
    /** Hashset of a formula object */
    calculate: Dict<Formula>;
    /** Filter test expression */
    filter: string;
    /** Dictionary mapping a bin parameter hash to transforms of the binned field */
    bin: Dict<VgTransform[]>;
    /** Dictionary mapping an output field name (hash) to the time unit transform  */
    timeUnit: Dict<VgTransform>;
    /** String set of fields to be filtered */
    nonPositiveFilter: Dict<boolean>;
    /** Sort order to apply at the end */
    pathOrder: VgSort;
    /**
     * Stack transforms to be applied.
     */
    stack: StackComponent;
    /** Array of summary component object for producing summary (aggregate) data source */
    summary: SummaryComponent[];
}
/**
 * Composable component for a model's summary data
 */
export interface SummaryComponent {
    /** Name of the summary data source */
    name: string;
    /** String set for all dimension fields  */
    dimensions: StringSet;
    /** dictionary mapping field name to string set of aggregate ops */
    measures: Dict<StringSet>;
}
export declare function parseUnitData(model: UnitModel): DataComponent;
export declare function parseFacetData(model: FacetModel): DataComponent;
export declare function parseLayerData(model: LayerModel): DataComponent;
/**
 * Creates Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
export declare function assembleData(model: Model, data: VgData[]): VgData[];

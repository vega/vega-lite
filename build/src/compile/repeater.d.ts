import { Encoding } from '../encoding';
import { FacetMapping } from '../facet';
import { Field } from '../fielddef';
export interface RepeaterValue {
    row?: string;
    column?: string;
}
export declare function replaceRepeaterInFacet(facet: FacetMapping<Field>, repeater: RepeaterValue): FacetMapping<string>;
export declare function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string>;

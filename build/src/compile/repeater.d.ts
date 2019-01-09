import { Encoding } from '../encoding';
import { Field } from '../fielddef';
import { FacetMapping } from '../spec/facet';
export interface RepeaterValue {
    row?: string;
    column?: string;
}
export declare function replaceRepeaterInFacet(facet: FacetMapping<Field>, repeater: RepeaterValue): FacetMapping<string>;
export declare function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string>;

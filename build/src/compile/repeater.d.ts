import { Field } from '../channeldef';
import { Encoding } from '../encoding';
import { FacetFieldDef, FacetMapping } from '../spec/facet';
export interface RepeaterValue {
    row?: string;
    column?: string;
    repeat?: string;
}
export declare function replaceRepeaterInFacet(facet: FacetFieldDef<Field> | FacetMapping<Field>, repeater: RepeaterValue): FacetFieldDef<string> | FacetMapping<string>;
export declare function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string>;
//# sourceMappingURL=repeater.d.ts.map
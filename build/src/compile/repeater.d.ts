import { Encoding } from '../encoding';
import { Facet } from '../facet';
import { Field } from '../fielddef';
export declare type RepeaterValue = {
    row?: string;
    column?: string;
};
export declare function replaceRepeaterInFacet(facet: Facet<Field>, repeater: RepeaterValue): Facet<string>;
export declare function replaceRepeaterInEncoding(encoding: Encoding<Field>, repeater: RepeaterValue): Encoding<string>;

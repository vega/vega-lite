import type { SignalRef } from 'vega';
import { ScaleChannel } from '../../channel';
import { TypedFieldDef } from '../../channeldef';
import { ScaleType } from '../../scale';
import { VgDomain, VgNonUnionDomain, VgSortField } from '../../vega.schema';
import { Model } from '../model';
import { Explicit } from '../split';
import { UnitModel } from '../unit';
export declare function parseScaleDomain(model: Model): void;
export declare function parseDomainForChannel(model: UnitModel, channel: ScaleChannel): Explicit<VgNonUnionDomain[]>;
export declare function domainSort(model: UnitModel, channel: ScaleChannel, scaleType: ScaleType): undefined | true | VgSortField;
/**
 * Determine if a scale can use unaggregated domain.
 * @return {Boolean} Returns true if all of the following conditions apply:
 * 1. `scale.domain` is `unaggregated`
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
export declare function canUseUnaggregatedDomain(fieldDef: TypedFieldDef<string>, scaleType: ScaleType): {
    valid: boolean;
    reason?: string;
};
/**
 * Converts an array of domains to a single Vega scale domain.
 */
export declare function mergeDomains(domains: VgNonUnionDomain[]): VgDomain;
/**
 * Return a field if a scale uses a single field.
 * Return `undefined` otherwise.
 */
export declare function getFieldFromDomain(domain: VgDomain): string;
export declare function assembleDomain(model: Model, channel: ScaleChannel): SignalRef | import("vega").ScaleData | (string | number | boolean | SignalRef)[];
//# sourceMappingURL=domain.d.ts.map
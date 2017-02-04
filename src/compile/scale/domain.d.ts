import { Channel } from '../../channel';
import { Scale, ScaleType } from '../../scale';
import { FieldRefUnionDomain, VgSortField, VgDomain, VgDataRef } from '../../vega.schema';
import { Model } from '../model';
export default function domain(scale: Scale, model: Model, channel: Channel): any[] | VgDataRef | FieldRefUnionDomain;
export declare function domainSort(model: Model, channel: Channel, scaleType: ScaleType): VgSortField;
/**
 * Union two data domains. A unioned domain is always sorted.
 */
export declare function unionDomains(domain1: VgDomain, domain2: VgDomain): VgDomain;

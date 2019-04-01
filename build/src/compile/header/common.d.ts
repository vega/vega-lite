import { Orient } from 'vega';
import { FacetChannel } from '../../channel';
import { Config } from '../../config';
import { Header } from '../../header';
import { FacetFieldDef } from '../../spec/facet';
import { HeaderChannel } from './component';
/**
 * Get header channel, which can be different from facet channel when orient is specified or when the facet channel is facet.
 */
export declare function getHeaderChannel(channel: FacetChannel, orient: Orient): HeaderChannel;
export declare function getHeaderProperty<P extends keyof Header>(prop: P, facetFieldDef: FacetFieldDef<string>, config: Config, channel: FacetChannel): Header[P];
export declare function getHeaderProperties(properties: (keyof Header)[], facetFieldDef: FacetFieldDef<string>, config: Config, channel: FacetChannel): Header;
//# sourceMappingURL=common.d.ts.map
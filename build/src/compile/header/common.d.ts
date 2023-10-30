import { Orient, SignalRef } from 'vega';
import { FacetChannel } from '../../channel';
import { Config } from '../../config';
import { Header } from '../../header';
import { HeaderChannel } from './component';
/**
 * Get header channel, which can be different from facet channel when orient is specified or when the facet channel is facet.
 */
export declare function getHeaderChannel(channel: FacetChannel, orient: Orient): HeaderChannel;
export declare function getHeaderProperty<P extends keyof Header<SignalRef>>(prop: P, header: Header<SignalRef>, config: Config<SignalRef>, channel: FacetChannel): Header<SignalRef>[P];
export declare function getHeaderProperties(properties: (keyof Header<SignalRef>)[], header: Header<SignalRef>, config: Config<SignalRef>, channel: FacetChannel): Header<SignalRef>;
//# sourceMappingURL=common.d.ts.map
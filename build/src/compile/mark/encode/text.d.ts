import { Config } from '../../../config';
import { Encoding } from '../../../encoding';
import { VgValueRef } from '../../../vega.schema';
import { UnitModel } from '../../unit';
export declare function text(model: UnitModel, channel?: 'text' | 'href' | 'url' | 'description'): Partial<Record<import("../../../vega.schema").VgEncodeChannel, VgValueRef | (VgValueRef & {
    test?: string;
})[]>>;
export declare function textRef(channelDef: Encoding<string>['text' | 'tooltip'], config: Config, expr?: 'datum' | 'datum.datum'): VgValueRef;
//# sourceMappingURL=text.d.ts.map
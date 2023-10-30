import { Config } from '../../../config';
import { Encoding } from '../../../encoding';
import { StackProperties } from '../../../stack';
import { UnitModel } from '../../unit';
export declare function tooltip(model: UnitModel, opt?: {
    reactiveGeom?: boolean;
}): Partial<Record<import("../../../vega.schema").VgEncodeChannel, import("../../../vega.schema").VgValueRef | (import("../../../vega.schema").VgValueRef & {
    test?: string;
})[]>> | {
    tooltip: {
        signal: string;
    };
};
export declare function tooltipData(encoding: Encoding<string>, stack: StackProperties, config: Config, { reactiveGeom }?: {
    reactiveGeom?: boolean;
}): {};
export declare function tooltipRefForEncoding(encoding: Encoding<string>, stack: StackProperties, config: Config, { reactiveGeom }?: {
    reactiveGeom?: boolean;
}): {
    signal: string;
};
//# sourceMappingURL=tooltip.d.ts.map
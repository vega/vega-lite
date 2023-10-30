import { SelectionCompiler } from '.';
import { FieldName } from '../../channeldef';
import { IntervalSelectionConfigWithoutType } from '../../selection';
export declare const BRUSH = "_brush";
export declare const SCALE_TRIGGER = "_scale_trigger";
export declare const GEO_INIT_TICK = "geo_interval_init_tick";
export type IntervalSelectionConfigWithField = IntervalSelectionConfigWithoutType & {
    fields?: FieldName[];
};
declare const interval: SelectionCompiler<'interval'>;
export default interval;
//# sourceMappingURL=interval.d.ts.map
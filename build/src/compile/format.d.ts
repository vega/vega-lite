import type { SignalRef } from 'vega';
import { DatumDef, FieldDef } from '../channeldef';
import { Config } from '../config';
import { ScaleType } from '../scale';
import { Type } from '../type';
import { Dict } from '../util';
import { TimeUnit } from './../timeunit';
export declare function isCustomFormatType(formatType: string): boolean;
export declare const BIN_RANGE_DELIMITER = " \u2013 ";
export declare function formatSignalRef({ fieldOrDatumDef, format, formatType, expr, normalizeStack, config }: {
    fieldOrDatumDef: FieldDef<string> | DatumDef<string>;
    format: string | Dict<unknown>;
    formatType: string;
    expr?: 'datum' | 'parent' | 'datum.datum';
    normalizeStack?: boolean;
    config: Config;
}): {
    signal: string;
};
export declare function formatCustomType({ fieldOrDatumDef, format, formatType, expr, normalizeStack, config, field }: {
    fieldOrDatumDef: FieldDef<string> | DatumDef<string>;
    format: string | Dict<unknown>;
    formatType: string;
    expr?: 'datum' | 'parent' | 'datum.datum';
    normalizeStack?: boolean;
    config: Config;
    field?: string;
}): {
    signal: string;
};
export declare function guideFormat(fieldOrDatumDef: FieldDef<string> | DatumDef<string>, type: Type, format: string | Dict<unknown>, formatType: string | SignalRef, config: Config, omitTimeFormatConfig: boolean): string | {
    signal: string;
};
export declare function guideFormatType(formatType: string | SignalRef, fieldOrDatumDef: FieldDef<string> | DatumDef<string>, scaleType: ScaleType): "time" | "number" | SignalRef | "utc";
/**
 * Returns number format for a fieldDef.
 */
export declare function numberFormat({ type, specifiedFormat, config, normalizeStack }: {
    type: Type;
    specifiedFormat?: string | Dict<unknown>;
    config: Config;
    normalizeStack?: boolean;
}): string;
/**
 * Returns time format for a fieldDef for use in guides.
 */
export declare function timeFormat({ specifiedFormat, timeUnit, config, omitTimeFormatConfig }: {
    specifiedFormat?: string;
    timeUnit?: TimeUnit;
    config: Config;
    omitTimeFormatConfig?: boolean;
}): string | {
    signal: string;
};
export declare function binFormatExpression(startField: string, endField: string, format: string | Dict<unknown>, formatType: string, config: Config): string;
/**
 * Returns the time expression used for axis/legend labels or text mark for a temporal field
 */
export declare function timeFormatExpression({ field, timeUnit, format, formatType, rawTimeFormat, isUTCScale }: {
    field: string;
    timeUnit?: TimeUnit;
    format?: string | Dict<unknown>;
    formatType?: string;
    rawTimeFormat?: string;
    isUTCScale?: boolean;
}): string;
//# sourceMappingURL=format.d.ts.map
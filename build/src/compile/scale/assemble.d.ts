import { VgDataRef } from '../../vega.schema';
import { Model } from '../model';
export declare function assembleScale(model: Model): {
    name: string;
    type: "time" | "linear" | "bin-linear" | "log" | "pow" | "sqrt" | "utc" | "sequential" | "ordinal" | "bin-ordinal" | "point" | "band";
    domain: any[] | VgDataRef | {
        signal: string;
    } | {
        fields: (any[] | VgDataRef)[];
        sort?: boolean | {
            op: "count";
        };
    } | {
        data: string;
        fields: (string | {
            parent: string;
        } | {
            parent: string;
        }[])[];
        sort?: boolean | {
            op: "count";
        };
    };
    domainRaw?: {
        signal: string;
    };
    range: string | {
        scheme: string;
        extent?: number[];
        count?: number;
    } | VgDataRef | {
        step: number;
    } | (string | number | VgDataRef)[];
    clamp?: boolean;
    exponent?: number;
    nice?: boolean | "year" | "month" | "day" | "second" | "minute" | "hour" | "week";
    padding?: number;
    paddingInner?: number;
    paddingOuter?: number;
    reverse?: boolean;
    round?: boolean;
    zero?: boolean;
}[];

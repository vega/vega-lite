import { StackOffset } from './stack';
import { ScaleType, NiceTime } from './scale';
export interface VgData {
    name: string;
    source?: string;
    transform?: any;
    values?: any;
    url?: any;
    format?: any;
    ref?: string;
}
export declare type VgParentRef = {
    parent: string;
};
export declare type VgFieldRef = string | VgParentRef | VgParentRef[];
export declare type VgSortField = boolean | {
    field: VgFieldRef;
    op: string;
};
export declare type VgDataRef = {
    data: string;
    field: VgFieldRef;
    sort?: VgSortField;
};
export declare type VgValueRef = {
    value?: number | string | boolean;
    field?: string | {
        datum?: string;
        group?: string;
        parent?: string;
    };
    signal?: string;
    scale?: string;
    mult?: number;
    offset?: number | VgValueRef;
    band?: boolean | number;
};
export declare type DataRefUnionDomain = {
    fields: (any[] | VgDataRef)[];
    sort?: boolean | {
        op: 'count';
    };
};
export declare type FieldRefUnionDomain = {
    data: string;
    fields: VgFieldRef[];
    sort?: boolean | {
        op: 'count';
    };
};
export declare type VgRangeScheme = {
    scheme: string;
    extent?: number[];
    count?: number;
};
export declare type VgRange = string | VgDataRef | (number | string | VgDataRef)[] | VgRangeScheme | {
    step: number;
};
export declare type VgDomain = any[] | VgDataRef | DataRefUnionDomain | FieldRefUnionDomain;
export declare type VgScale = {
    name: string;
    type: ScaleType;
    domain: VgDomain;
    range: VgRange;
    clamp?: boolean;
    exponent?: number;
    nice?: boolean | NiceTime;
    padding?: number;
    paddingInner?: number;
    paddingOuter?: number;
    reverse?: boolean;
    round?: boolean;
    zero?: boolean;
};
export declare function isDataRefUnionedDomain(domain: VgDomain): domain is DataRefUnionDomain;
export declare function isFieldRefUnionDomain(domain: VgDomain): domain is FieldRefUnionDomain;
export declare function isDataRefDomain(domain: VgDomain): domain is VgDataRef;
export declare type VgEncodeEntry = any;
export declare type VgAxis = any;
export declare type VgLegend = any;
export interface VgBinTransform {
    type: 'bin';
    field: string;
    as: string;
    extent?: {
        signal: string;
    };
}
export interface VgExtentTransform {
    type: 'extent';
    field: string;
    signal: string;
}
export interface VgFormulaTransform {
    type: 'formula';
    as: string;
    expr: string;
}
export interface VgLabelTransform {
    type: 'label';
    ref: string;
    anchor: string;
    offset: number | string;
}
export declare type VgLayoutTransform = VgLabelTransform;
export interface VgAxisEncode {
    ticks?: VgGuideEncode;
    labels?: VgGuideEncode;
    title?: VgGuideEncode;
    grid?: VgGuideEncode;
    domain?: VgGuideEncode;
}
export interface VgLegendEncode {
    title?: VgGuideEncode;
    labels?: VgGuideEncode;
    legend?: VgGuideEncode;
    symbols?: VgGuideEncode;
    gradient?: VgGuideEncode;
}
export declare type VgGuideEncode = any;
export declare type VgTransform = VgBinTransform | VgExtentTransform | VgFormulaTransform | VgLayoutTransform | any;
export interface VgStackTransform {
    type: 'stack';
    offset?: StackOffset;
    groupby: string[];
    field: string;
    sort: VgSort;
    as: string[];
}
export declare type VgSort = {
    field: string;
    order: 'ascending' | 'descending';
} | {
    field: string[];
    order: ('ascending' | 'descending')[];
};
export interface VgImputeTransform {
    type: 'impute';
    groupby?: string[];
    field: string;
    orderby?: string[];
    method?: 'value' | 'median' | 'max' | 'min' | 'mean';
    value?: any;
}

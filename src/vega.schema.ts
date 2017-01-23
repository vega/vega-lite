import {StackOffset} from './stack';
import {ScaleType, NiceTime} from './scale';
import {isArray} from './util';

export interface VgData {
  name: string;
  source?: string;
  values?: any;
  format?: any;
  url?: any;
  transform?: any;
}

export type VgParentRef = {
  parent: string
};

export type VgFieldRef = string | VgParentRef | VgParentRef[];

export type VgDataRef = {
  data: string,
  field: VgFieldRef,
  sort: boolean | {
    field: VgFieldRef,
    op: string
  }
};

// TODO: add type of value (Make it VgValueRef<T> { value?:T ... })
export type VgValueRef<T> = {
  value?: number | string | boolean,
  field?: string | {
    datum?: string,
    group?: string,
    parent?: string
  },
  signal?: string;
  scale?: string, // TODO: object
  mult?: number,
  offset?: number | T,
  band?: boolean | number
}

export type UnionedDomain = {
  fields: VgDataRef[]
};

export type VgRangeScheme = {scheme: string, extent?: number[], count?: number};

export type VgRange = string | VgDataRef | (number|string|VgDataRef)[] | VgRangeScheme;

export type VgScale = {
  name: string,
  type: ScaleType,
  domain?: any[] | UnionedDomain | VgDataRef,
  domainMin?: any,
  domainMax?: any
  range?: VgRange,
  rangeMin?: any,
  rangeMax?: any,
  scheme?: string,

  rangeStep?: number,
  clamp?: boolean,
  exponent?: number,
  nice?: boolean | NiceTime,
  padding?: number,
  points?: boolean,
  reverse?: boolean,
  round?: boolean,
  zero?: boolean
}

export function isUnionedDomain(domain: any[] | UnionedDomain | VgDataRef): domain is UnionedDomain {
  if (!isArray(domain)) {
    return 'fields' in domain;
  }
  return false;
}

export function isDataRefDomain(domain: any[] | UnionedDomain | VgDataRef): domain is VgDataRef {
  if (!isArray(domain)) {
    return 'data' in domain;
  }
  return false;
}

export type VgEncodeEntry = any;
// TODO: make export interface VgEncodeEntry {
//   x?: VgValueRef<number>
//   y?: VgValueRef<number>
//  ...
//   color?: VgValueRef<string>
//  ...
// }

export type VgAxis = any;
export type VgLegend = any;

export interface VgBinTransform {
  type: 'bin';
  field: string;
  as: string;
  extent?: {signal: string};
  // TODO: add other properties
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

export type VgGuideEncode = any; // TODO: replace this (See guideEncode in Vega Schema)

export type VgTransform = VgBinTransform | VgExtentTransform | VgFormulaTransform | any;

export interface VgStackTransform {
  type: 'stack';
  offset?: StackOffset;
  groupby: string[];
  field: string;
  sort: VgSort;
  as: string[];
}

export type VgSort = {
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

import {StackOffset} from './stack';
import {ScaleType, NiceTime} from './scale';
import {SortOrder} from './sort';
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

export type VgSignalRef = {
  signal: string
};

export type VgValueRef = {
  value?: any,
  field?: string | {
    datum?: string,
    group?: string,
    parent?: string
  },
  signal?: string;
  scale?: string, // TODO: object
  mult?: number,
  offset?: number | VgValueRef,
  band?: boolean | number
}

export type UnionedDomain = {
  fields: VgDataRef[]
};

export type VgScale = {
  name: string,
  type: ScaleType,
  domain?: any[] | UnionedDomain | VgDataRef | VgSignalRef,
  domainMin?: any,
  domainMax?: any
  domainRaw?: VgSignalRef;
  range?: any[] | VgDataRef | string,
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

export function isUnionedDomain(domain: any[] | UnionedDomain | VgDataRef | VgSignalRef): domain is UnionedDomain {
  if (!isArray(domain)) {
    return 'fields' in domain;
  }
  return false;
}

export function isDataRefDomain(domain: any[] | UnionedDomain | VgDataRef | VgSignalRef): domain is VgDataRef {
  if (!isArray(domain)) {
    return 'data' in domain;
  }
  return false;
}

// TODO: declare
export type VgMarkGroup = any;
export type VgAxis = any;
export type VgLegend = any;
export type VgTransform = any;

export interface VgStackTransform {
  type: 'stack';
  offset?: StackOffset;
  groupby: string[];
  field: string;
  sort: VgSort;
  as: string[];
}

export interface VgSort {
  field: string | string[];
  order: SortOrder | SortOrder[];
}

export interface VgImputeTransform {
  type: 'impute';
  groupby?: string[];
  field: string;
  orderby?: string[];
  method?: 'value' | 'median' | 'max' | 'min' | 'mean';
  value?: any;
}

export type VgCheckboxBinding = {
  input: 'checkbox';
  element?: string;
}

export type VgRadioBinding = {
  input: 'radio';
  options: string[];
  element?: string;
}

export type VgSelectBinding = {
  input: 'select';
  options: string[];
  element?: string;
}

export type VgRangeBinding = {
  input: 'range';
  min?: number;
  max?: number;
  step?: number;
  element?: string;
}

export type VgGenericBinding = {
  input: string;
  element?: string;
}

export type VgBinding = VgCheckboxBinding | VgRadioBinding |
  VgSelectBinding | VgRangeBinding | VgGenericBinding;

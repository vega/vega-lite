import {isArray} from './util';
import {ScaleType, NiceTime} from './scale';

export interface VgData {
  name: string;
  source?: string;
  values?: any;
  format?: any;
  url?: any;
  transform?: any;
}

type VgParentRef = {
  parent: string
};

type VgFieldRef = string | VgParentRef | VgParentRef[];

export type VgDataRef = {
  data: string,
  field: VgFieldRef,
  sort: boolean | {
    field: VgFieldRef,
    op: string
  }
};

export type VgValueRef = {
  value?: any,
  field?: string | {
    datum?: string,
    group?: string,
    parent?: string
  },
  template?: string,
  scale?: string, // TODO: object
  mult?: number,
  offset?: number,
  band?: boolean
}

export type UnionedDomain = {
  fields: VgDataRef[]
};

export type VgScale = {
  name: string,
  type: ScaleType,
  domain?: any[] | UnionedDomain | VgDataRef,
  domainMin?: any,
  domainMax?: any
  range?: any[] | VgDataRef | string,
  rangeMin?: any,
  rangeMax?: any,

  bandSize?: number,
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

// TODO: declare
export type VgMarkGroup = any;
export type VgAxis = any;
export type VgLegend = any;
export type VgTransform = any;

export interface VgStackTransform {
  type: string;
  offset?: any;
  groupby: any;
  field: any;
  sortby: any;
  output: any;
}

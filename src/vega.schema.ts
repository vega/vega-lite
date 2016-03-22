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

// Reference to field, only used in mark proeprties
export type VgFieldRef = string | {
  datum: VgParentRef | VgGroupRef
}

// Reference to parent
export type VgParentRef = {
  parent: string
};

// Reference to group
type VgGroupRef = {
  group: string
}

export type VgField = string | VgParentRef | VgParentRef[];

export type VgDataRef = {
  data: string,
  field: VgField,
  sort: boolean | {
    field: VgField,
    op: string
  }
};

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

import { VgBinding } from './vega.schema';
export declare type SelectionTypes = 'single' | 'multi' | 'interval';
export declare type SelectionDomain = 'data' | 'visual';
export declare type SelectionResolutions = 'single' | 'independent' | 'union' | 'union_others' | 'intersect' | 'intersect_others';
export interface BaseSelectionDef {
    on?: any;
    bind?: 'scales' | VgBinding | {
        [key: string]: VgBinding;
    };
    fields?: string[];
    encodings?: string[];
    toggle?: string | boolean;
    translate?: string | boolean;
    zoom?: string | boolean;
    nearest?: boolean;
}
export interface SelectionDef extends BaseSelectionDef {
    type: SelectionTypes;
}
export interface SelectionConfig {
    single: BaseSelectionDef;
    multi: BaseSelectionDef;
    interval: BaseSelectionDef;
}
export declare const defaultConfig: SelectionConfig;

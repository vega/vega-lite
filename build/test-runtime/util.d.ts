import { Page } from 'puppeteer';
import { SelectionResolution, SelectionType } from '../src/selection';
import { TopLevelSpec } from '../src/spec';
export declare type ComposeType = 'unit' | 'repeat' | 'facet';
export declare const selectionTypes: SelectionType[];
export declare const compositeTypes: ComposeType[];
export declare const resolutions: SelectionResolution[];
export declare const bound = "bound";
export declare const unbound = "unbound";
export declare const tuples: {
    a: number;
    b: number;
    c: number;
}[];
export declare const hits: {
    discrete: {
        qq: number[];
        qq_clear: number[];
        bins: number[];
        bins_clear: number[];
        repeat: number[];
        repeat_clear: number[];
        facet: number[];
        facet_clear: number[];
    };
    interval: {
        drag: number[][];
        drag_clear: number[][];
        translate: number[][];
        bins: number[][];
        bins_clear: number[][];
        bins_translate: number[][];
        repeat: number[][];
        repeat_clear: number[][];
        facet: number[][];
        facet_clear: number[][];
    };
};
export declare function spec(compose: ComposeType, iter: number, sel: any, opts?: any): TopLevelSpec;
export declare function unitNameRegex(specType: ComposeType, idx: number): RegExp;
export declare function parentSelector(compositeType: ComposeType, index: number): string;
export declare function brush(key: string, idx: number, parent?: string, targetBrush?: boolean): string;
export declare function pt(key: string, idx: number, parent?: string): string;
export declare function embedFn(page: Page): (specification: TopLevelSpec) => Promise<void>;
export declare function svg(page: Page, path: string, filename: string): Promise<any>;
export declare function testRenderFn(page: Page, path: string): (filename: string) => Promise<void>;

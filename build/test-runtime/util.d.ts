/// <reference types="webdriverio" />
import { SelectionResolution, SelectionType } from '../src/selection';
import { TopLevelExtendedSpec } from '../src/spec';
export declare const generate: string;
export declare const output = "test-runtime/resources";
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
export declare function spec(compose: ComposeType, iter: number, sel: any, opts?: any): TopLevelExtendedSpec;
export declare function unitNameRegex(specType: ComposeType, idx: number): RegExp;
export declare function parentSelector(compositeType: ComposeType, index: number): string;
export declare function brush(key: string, idx: number, parent?: string, targetBrush?: boolean): string;
export declare function pt(key: string, idx: number, parent?: string): string;
export declare function embedFn(browser: WebdriverIO.Client<void>): (spec: TopLevelExtendedSpec) => void;
export declare function svg(browser: WebdriverIO.Client<void>, path: string, filename: string): any;
export declare function testRenderFn(browser: WebdriverIO.Client<void>, path: string): (filename: string) => void;

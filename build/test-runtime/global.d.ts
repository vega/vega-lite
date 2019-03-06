import { TopLevelSpec } from './../src/spec/index';
interface Opts {
    bubbles?: boolean;
    clientX?: number;
    clientY?: number;
    shiftKey?: boolean;
    deltaX?: number;
    deltaY?: number;
    deltaZ?: number;
}
export declare function embed(vlSpec: TopLevelSpec): void;
export declare function mouseEvt(type: string, target: Element | Window, opts?: Opts): void;
export declare function mark(id: string, parent: string): Element;
export declare function coords(el: Element): number[];
export declare function brushOrEl(el: Element, parent: string, _: boolean): Element;
export declare function click(el: Element, evt: Opts): void;
export declare function brush(id0: string, id1: string, parent: string, targetBrush: boolean): any[];
export declare function pt(id: string, parent: string, shiftKey: boolean): any[];
export declare function clear(id: string, parent: string, shiftKey: boolean): any[];
export declare function zoom(id: string, delta: number, parent: string, targetBrush: boolean): any[];
export {};

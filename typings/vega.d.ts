declare module 'vega' {
  export const version: string;
  export function parse(spec: any, opt?: any): any;
  export function isString(value: any): value is string;
  export class View {
    constructor(runtime: any, config?: any);
    public logLevel(level: number): View;
    public initialize(dom: Element | string): View;
    public renderer(renderer: string): View;
    public finalize(): void;

    public hover(): View;
    public run(): View;
    public change(name: string, changeset: any): View;
    public changeset(): any;
    public data(name: string): object[];

    public width(w: number): View;
    public height(h: number): View;
    public padding(p: number | {left?: number, right?: number, top?: number, bottom?: number}): View;

    public toImageURL(type: string): Promise<string>;
  }
  export const Warn: number;
  export const changeset: any;
  export const loader: any;
}

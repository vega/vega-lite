// TODO remove after migrating docs
declare module vg {
  export var version: string;
  export function embed(selector: any, spec: any, f?: any): void;
}

declare module 'vega' {
  export var version: string;
  export function parse(spec: any): any;
  export class View {
    constructor(runtime: any);
    public logLevel(level: number): View;
    public initialize(dom: Element): View;
    public renderer(renderer: string): View;
    public hover(): View;
    public run(): View;
  }
  export const Warn: number;
}

declare module 'vega-event-selector' {
  export function selector(selector: string, source: string): any[];
}

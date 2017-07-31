declare module 'vega-embed' {
  export const config: any;
  export default function embed(e: any, spec: any, ops: any): Promise<any>;
  export const vega: any;
}

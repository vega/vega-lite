declare module 'vega-embed' {
  export const config: any;
  export default function embed(e: any, spec: any, ops: any, cb: (err: Error, view: any) => void): void;
}

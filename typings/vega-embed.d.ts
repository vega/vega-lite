declare module 'vega-embed' {
  export const config: any;
  export default function embed(e: any, spec: object, ops: object, cb: (err: Error, view: any) => void): void;
}

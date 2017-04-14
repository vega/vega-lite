declare module 'vega-embed' {
  export default function embed(e: any, spec: object, ops: object, cb: (err: Error, view: any) => void): void;
}

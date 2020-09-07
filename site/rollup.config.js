import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'site/static/index.ts',
  output: {
    file: 'site/static/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    json(),
    ts({
      tsconfig: 'site/tsconfig.site.json'
    }),
    nodeResolve({browser: true}),
    commonjs(),
    production && terser(),
    bundleSize()
  ]
};

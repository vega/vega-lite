import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';

const watch = process.env.ROLLUP_WATCH;

export default {
  input: 'site/static/index.ts',
  output: {
    file: 'site/static/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    json(),
    nodeResolve({browser: true}),
    commonjs(),
    typescript({
      tsconfig: 'site/tsconfig.site.json'
    }),
    watch && terser(),
    bundleSize()
  ]
};

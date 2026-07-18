import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';
import 'dotenv/config';

// eslint-disable-next-line no-undef
const watch = process.env.ROLLUP_WATCH;

export default {
  input: 'site/static/index.ts',
  output: {
    file: 'site/static/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    nodeResolve({browser: true, extensions: ['.ts']}),
    commonjs(),
    json(),
    typescript(),
    watch && terser(),
    bundleSize(),
  ],
};

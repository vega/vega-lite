import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';

const watch = process.env.ROLLUP_WATCH;

const extensions = ['.js', '.ts'];

export default {
  input: 'site/static/index.ts',
  output: {
    file: 'site/static/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [json(), nodeResolve({browser: true, extensions}), commonjs(), typescript(), watch && terser(), bundleSize()]
};

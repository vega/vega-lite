import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';

const watch = process.env.ROLLUP_WATCH;

const extensions = ['.js', '.ts'];

export default {
  input: 'site/static/index.ts',
  output: {
    file: 'site/static/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    json(),
    nodeResolve({browser: true, extensions}),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'bundled',
      presets: [
        [
          '@babel/env',
          {
            targets: 'defaults and not IE 11'
          }
        ],
        '@babel/typescript'
      ]
    }),
    watch && terser(),
    bundleSize()
  ]
};

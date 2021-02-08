import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

export function disallowedImports() {
  return {
    resolveId: module => {
      if (module === 'vega' || module === 'util' || module === 'd3') {
        throw new Error('Cannot import from Vega, Node Util, or D3 in Vega-Lite.');
      }
      return null;
    }
  };
}

export function debugImports() {
  return {
    resolveId: module => {
      if (module === 'pako') {
        throw new Error('Do not import pako in builds. Did you forget to remove drawDataflow?');
      }
      return null;
    }
  };
}

const extensions = ['.js', '.ts'];

const globals = {
  'vega-util': 'vega',
  vega: 'vega'
};

const outputs = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'umd',
        sourcemap: true,
        name: 'vegaLite',
        globals
      },
      {
        file: pkg.unpkg,
        format: 'umd',
        sourcemap: true,
        name: 'vegaLite',
        plugins: [terser()],
        globals
      }
    ],
    plugins: [
      disallowedImports(),
      debugImports(),
      resolve({browser: true, extensions}),
      commonjs(),
      json(),
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
      bundleSize()
    ],
    external: ['vega', 'vega-util']
  }
];

export default outputs;

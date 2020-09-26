import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';

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

const outputs = [];

for (const build of ['es5', 'es6']) {
  const buildFolder = build === 'es5' ? 'build-es5' : 'build';
  outputs.push({
    input: 'src/index.ts',
    output: [
      {
        file: `${buildFolder}/vega-lite.js`,
        format: 'umd',
        sourcemap: true,
        name: 'vegaLite'
      },
      {
        file: `${buildFolder}/vega-lite.min.js`,
        format: 'umd',
        sourcemap: true,
        name: 'vegaLite',
        plugins: [terser()]
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
              targets: build === 'es5' ? 'defaults' : 'defaults and not IE 11'
            }
          ],
          '@babel/typescript'
        ]
      }),
      bundleSize()
    ],
    external: ['vega']
  });
}

export default outputs;

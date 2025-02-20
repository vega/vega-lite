import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json' with {type: 'json'};

export function disallowedImports() {
  return {
    resolveId: (module) => {
      if (['vega', 'util', 'd3'].includes(module)) {
        throw new Error('Cannot import from Vega, Node Util, or D3 in Vega-Lite.');
      }
      return null;
    },
  };
}

export function debugImports() {
  return {
    resolveId: (module) => {
      if (module === 'pako') {
        throw new Error('Do not import pako in builds. Did you forget to remove drawDataflow?');
      }
      return null;
    },
  };
}

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: pkg.exports.default,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      nodeResolve({browser: true, extensions: ['.ts']}),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.build.json',
      }),
      bundleSize(),
    ],
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)],
  },
  {
    input: 'src/index.ts',
    output: {
      file: pkg.unpkg,
      format: 'umd',
      name: 'vegaLite',
      sourcemap: true,
      globals: {
        vega: 'vega',
      },
    },
    plugins: [
      disallowedImports(),
      debugImports(),
      alias({
        entries: {
          'vega-event-selector': 'vega',
          'vega-expression': 'vega',
          'vega-util': 'vega',
        },
      }),
      nodeResolve({browser: true, extensions: ['.ts']}),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.build.json',
      }),
      terser(),
      bundleSize(),
    ],
    external: ['vega'],
  },
];

export default outputs;

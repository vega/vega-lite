import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';

const watch = !process.env.ROLLUP_WATCH;

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

const pkg = require('./package.json');

const plugins = (browserslist, declaration) => [
  disallowedImports(),
  debugImports(),
  json(),
  resolve({browser: true}),
  ts({
    tsconfig: resolvedConfig => ({
      ...resolvedConfig,
      declaration,
      declarationMap: declaration
    }),
    ...(browserslist
      ? {
          transpiler: 'babel',
          browserslist
        }
      : {})
  }),
  commonjs(),
  bundleSize()
];

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: 'build/vega-lite.module.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: plugins(undefined, true),
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
  }
];

if (!watch) {
  for (const build of ['es5', 'es6']) {
    const buildFolder = build === 'es5' ? 'build-es5' : 'build';
    outputs.push({
      input: 'src/index.ts',
      output: [
        {
          file: `${buildFolder}/vega-lite.js`,
          format: 'umd',
          sourcemap: true,
          name: 'vegaEmbed',
          globals: {
            'vega-lite': 'vegaLite'
          }
        },
        {
          file: `${buildFolder}/vega-lite.min.js`,
          format: 'iife',
          sourcemap: true,
          name: 'vegaEmbed',
          globals: {
            'vega-lite': 'vegaLite'
          },
          plugins: [terser()]
        }
      ],
      plugins: plugins(build === 'es5' ? 'defaults' : 'defaults and not IE 11', false),
      external: ['vega', 'vega-lite']
    });
  }
}

export default outputs;

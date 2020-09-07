import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import {terser} from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel';

const watch = process.env.ROLLUP_WATCH;

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

const outputs = [
  {
    input: 'src/index.ts',
    output: {
      file: 'build/vega-lite.module.js',
      format: 'esm',
      sourcemap: true
    },
    plugins: [
      disallowedImports(),
      debugImports(),
      json(),
      resolve({browser: true}),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            declaration: true,
            declarationMap: true
          },
          include: null
        }
      }),
      bundleSize()
    ],
    external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)]
  }
];

if (!watch) {
  const extensions = ['.js', '.ts'];

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
      plugins: [
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
          ],
          plugins: ['@babel/proposal-class-properties']
        }),
        bundleSize()
      ],
      external: ['vega', 'vega-lite']
    });
  }
}

export default outputs;

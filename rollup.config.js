import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

import babel from 'rollup-plugin-babel';
import sourcemaps from 'rollup-plugin-sourcemaps';

export function disallowedImports() {
  return {
    resolveId: module => {
      if (module === 'vega' || module === 'util') {
        throw new Error('Cannot import from Vega or Node Util in Vega-Lite.');
      }
      return null;
    }
  };
}

export default [{
  input: 'build/src/index.js',
  output: {
    file: 'build/vega-lite.js',
    format: 'umd',
    sourcemap: true,
    name: 'vegaLite'
  },
  plugins: [disallowedImports(), nodeResolve({browser: true}), commonjs(), json(), sourcemaps()]
},
{
  input: 'build-es5/src/index.js',
  output: {
    file: 'build-es5/vega-lite.js',
    format: 'umd',
    sourcemap: true,
    name: 'vegaLite'
  },
  plugins: [disallowedImports(), nodeResolve({browser: true}), commonjs(), babel(), json(), sourcemaps()]
}];

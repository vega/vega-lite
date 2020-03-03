import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

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

export default {
  input: 'build/src/index.js',
  output: {
    file: 'build/vega-lite.js',
    format: 'umd',
    sourcemap: true,
    name: 'vegaLite'
  },
  plugins: [disallowedImports(), nodeResolve({browser: true}), commonjs(), json(), sourcemaps()]
};

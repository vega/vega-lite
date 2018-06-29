import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
  input: 'build/src/index.js',
  output: {
    file: 'build/vega-lite.js',
    format: 'umd',
    sourcemap: true,
    name: 'vl'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    sourcemaps()
  ]
};

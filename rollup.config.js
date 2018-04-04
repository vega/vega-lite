import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

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
    json(),
    commonjs()
  ]
};

import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'build/site/index.js',
  output: {
    file: 'build/site/bundle.js',
    format: 'iife',
    name: 'app',
    sourcemap: true
  },
  plugins: [nodeResolve({browser: true}), commonjs(), json(), production && terser()]
};

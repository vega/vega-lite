import pkg from '../package.json';
import {compile} from './compile/compile';
import {CompileOptions} from './compile/compile.js';
import {normalize} from './normalize';
import {TopLevelSpec} from './spec';

const version = pkg.version;

export {compile} from './compile/compile';
export {Config} from './config';
export {TopLevelSpec} from './spec';
export {extractTransforms} from './transformextract';
export {normalize, version};

/**
 * Compile Vega-Lite specifications to Vega.
 *
 * This function calls `vegaLite.compile` and returns the compiled Vega spec.
 */
export default function compileToSpec(inputSpec: TopLevelSpec, opt: CompileOptions = {}) {
  return compile(inputSpec, opt).spec;
}

import pkg from '../package.json';
import {compile, CompileOptions} from './compile/compile';
import {Config} from './config';
import {normalize} from './normalize';
import {TopLevelSpec} from './spec';
import {extractTransforms} from './transformextract';

const version = pkg.version;

export {compile, extractTransforms, normalize, version, TopLevelSpec, Config};

/**
 * Compile Vega-Lite specifications to Vega.
 *
 * This function calls `vegaLite.compile` and returns the compiled Vega spec.
 */
export default function compileToSpec(inputSpec: TopLevelSpec, opt: CompileOptions = {}) {
  return compile(inputSpec, opt).spec;
}

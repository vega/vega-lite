import pkg from '../package.json';
import {normalize} from './normalize';
export {compile} from './compile/compile';
export {Config} from './config';
export {TopLevelSpec} from './spec';
export {extractTransforms} from './transformextract';

const version = pkg.version;
export {normalize, version};

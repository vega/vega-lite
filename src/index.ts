import pkg from '../package.json';
import {compile} from './compile/compile';
import {Config} from './config';
import {normalize} from './normalize';
import {TopLevelSpec} from './spec';
import {extractTransforms} from './transformextract';

const version = pkg.version;

export {compile, extractTransforms, normalize, version, TopLevelSpec, Config};

export default compile;

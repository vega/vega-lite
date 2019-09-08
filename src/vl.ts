// Wrapper for index.ts so that we can compile a bundle whose default export is a convenient compile function.

import {compile, extractTransforms, normalize, version} from '.';

export default Object.assign(compile, {compile, extractTransforms, normalize, version});

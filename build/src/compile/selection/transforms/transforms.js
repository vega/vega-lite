import inputs from './inputs';
import nearest from './nearest';
import project from './project';
import scales from './scales';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
const compilers = {
    project,
    toggle,
    scales,
    translate,
    zoom,
    inputs,
    nearest
};
export function forEachTransform(selCmpt, cb) {
    for (const t in compilers) {
        if (compilers[t].has(selCmpt)) {
            cb(compilers[t]);
        }
    }
}
//# sourceMappingURL=transforms.js.map
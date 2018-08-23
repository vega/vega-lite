import inputs from './inputs';
import nearest from './nearest';
import project from './project';
import scales from './scales';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
var compilers = {
    project: project,
    toggle: toggle,
    scales: scales,
    translate: translate,
    zoom: zoom,
    inputs: inputs,
    nearest: nearest
};
export function forEachTransform(selCmpt, cb) {
    for (var t in compilers) {
        if (compilers[t].has(selCmpt)) {
            cb(compilers[t]);
        }
    }
}
//# sourceMappingURL=transforms.js.map
import { stringValue } from 'vega-util';
import { FACET_CHANNELS } from '../../channel';
import { SELECTION_ID } from '../../selection';
import { accessPathWithDatum } from '../../util';
import { isFacetModel } from '../model';
import interval from './interval';
import multi from './multi';
import single from './single';
export const STORE = '_store';
export const TUPLE = '_tuple';
export const MODIFY = '_modify';
export const SELECTION_DOMAIN = '_selection_domain_';
export const VL_SELECTION_RESOLVE = 'vlSelectionResolve';
const compilers = { single, multi, interval };
export function forEachSelection(model, cb) {
    const selections = model.component.selection;
    for (const name in selections) {
        if (selections.hasOwnProperty(name)) {
            const sel = selections[name];
            cb(sel, compilers[sel.type]);
        }
    }
}
function getFacetModel(model) {
    let parent = model.parent;
    while (parent) {
        if (isFacetModel(parent)) {
            break;
        }
        parent = parent.parent;
    }
    return parent;
}
export function unitName(model) {
    let name = stringValue(model.name);
    const facetModel = getFacetModel(model);
    if (facetModel) {
        const { facet } = facetModel;
        for (const channel of FACET_CHANNELS) {
            if (facet[channel]) {
                name += ` + '__facet_${channel}_' + (${accessPathWithDatum(facetModel.vgField(channel), 'facet')})`;
            }
        }
    }
    return name;
}
export function requiresSelectionId(model) {
    let identifier = false;
    forEachSelection(model, selCmpt => {
        identifier = identifier || selCmpt.project.items.some(proj => proj.field === SELECTION_ID);
    });
    return identifier;
}
export function isRawSelectionDomain(domainRaw) {
    return domainRaw.signal.indexOf(SELECTION_DOMAIN) >= 0;
}
//# sourceMappingURL=index.js.map
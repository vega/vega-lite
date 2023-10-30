import { isString } from 'vega';
import { stringValue } from 'vega-util';
import { FACET_CHANNELS } from '../../channel';
import { vals } from '../../util';
import { isFacetModel } from '../model';
import interval from './interval';
import point from './point';
import clear from './clear';
import inputs from './inputs';
import nearest from './nearest';
import project from './project';
import scales from './scales';
import legends from './legends';
import toggle from './toggle';
import translate from './translate';
import zoom from './zoom';
export const STORE = '_store';
export const TUPLE = '_tuple';
export const MODIFY = '_modify';
export const SELECTION_DOMAIN = '_selection_domain_';
export const VL_SELECTION_RESOLVE = 'vlSelectionResolve';
// Order matters for parsing and assembly.
export const selectionCompilers = [
    point,
    interval,
    project,
    toggle,
    // Bindings may disable direct manipulation.
    inputs,
    scales,
    legends,
    clear,
    translate,
    zoom,
    nearest
];
function getFacetModel(model) {
    let parent = model.parent;
    while (parent) {
        if (isFacetModel(parent))
            break;
        parent = parent.parent;
    }
    return parent;
}
export function unitName(model, { escape } = { escape: true }) {
    let name = escape ? stringValue(model.name) : model.name;
    const facetModel = getFacetModel(model);
    if (facetModel) {
        const { facet } = facetModel;
        for (const channel of FACET_CHANNELS) {
            if (facet[channel]) {
                name += ` + '__facet_${channel}_' + (facet[${stringValue(facetModel.vgField(channel))}])`;
            }
        }
    }
    return name;
}
export function requiresSelectionId(model) {
    return vals(model.component.selection ?? {}).reduce((identifier, selCmpt) => {
        return identifier || selCmpt.project.hasSelectionId;
    }, false);
}
// Binding a point selection to query widgets or legends disables default direct manipulation interaction.
// A user can choose to re-enable it by explicitly specifying triggering input events.
export function disableDirectManipulation(selCmpt, selDef) {
    if (isString(selDef.select) || !selDef.select.on)
        delete selCmpt.events;
    if (isString(selDef.select) || !selDef.select.clear)
        delete selCmpt.clear;
    if (isString(selDef.select) || !selDef.select.toggle)
        delete selCmpt.toggle;
}
//# sourceMappingURL=index.js.map
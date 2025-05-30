import {isString} from 'vega';
import {stringValue} from 'vega-util';
import {FACET_CHANNELS} from '../../channel.js';
import {vals} from '../../util.js';
import {isFacetModel} from '../model.js';
import interval from './interval.js';
import point from './point.js';
import clear from './clear.js';
import inputs from './inputs.js';
import nearest from './nearest.js';
import project from './project.js';
import scales from './scales.js';
import legends from './legends.js';
import toggle from './toggle.js';
import translate from './translate.js';
import zoom from './zoom.js';
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
  nearest,
];
function getFacetModel(model) {
  let parent = model.parent;
  while (parent) {
    if (isFacetModel(parent)) break;
    parent = parent.parent;
  }
  return parent;
}
export function unitName(model, {escape} = {escape: true}) {
  let name = escape ? stringValue(model.name) : model.name;
  const facetModel = getFacetModel(model);
  if (facetModel) {
    const {facet} = facetModel;
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
  if (isString(selDef.select) || !selDef.select.on) delete selCmpt.events;
  if (isString(selDef.select) || !selDef.select.clear) delete selCmpt.clear;
  if (isString(selDef.select) || !selDef.select.toggle) delete selCmpt.toggle;
}
export function isTimerSelection(selCmpt) {
  return selCmpt.events?.find((e) => 'type' in e && e.type === 'timer');
}
//# sourceMappingURL=index.js.map

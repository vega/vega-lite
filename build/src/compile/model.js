import * as tslib_1 from "tslib";
import { isNumber, isString } from 'vega-util';
import { isChannel, isScaleChannel } from '../channel';
import { forEach, reduce } from '../encoding';
import { getFieldDef, vgField } from '../fielddef';
import * as log from '../log';
import { hasDiscreteDomain } from '../scale';
import { isFacetSpec, isLayerSpec, isUnitSpec } from '../spec';
import { extractCompositionLayout } from '../spec/toplevel';
import { extractTitleConfig } from '../title';
import { normalizeTransform } from '../transform';
import { contains, duplicate, keys, varName } from '../util';
import { isVgRangeStep } from '../vega.schema';
import { assembleAxes } from './axis/assemble';
import { getHeaderGroups, getTitleGroup, HEADER_CHANNELS } from './header/index';
import { sizeExpr } from './layoutsize/assemble';
import { assembleLegends } from './legend/assemble';
import { parseLegend } from './legend/parse';
import { assembleProjections } from './projection/assemble';
import { parseProjection } from './projection/parse';
import { assembleScales } from './scale/assemble';
import { assembleDomain, getFieldFromDomain } from './scale/domain';
import { parseScale } from './scale/parse';
import { Split } from './split';
export class NameMap {
    constructor() {
        this.nameMap = {};
    }
    rename(oldName, newName) {
        this.nameMap[oldName] = newName;
    }
    has(name) {
        return this.nameMap[name] !== undefined;
    }
    get(name) {
        // If the name appears in the _nameMap, we need to read its new name.
        // We have to loop over the dict just in case the new name also gets renamed.
        while (this.nameMap[name] && name !== this.nameMap[name]) {
            name = this.nameMap[name];
        }
        return name;
    }
}
/*
  We use type guards instead of `instanceof` as `instanceof` makes
  different parts of the compiler depend on the actual implementation of
  the model classes, which in turn depend on different parts of the compiler.
  Thus, `instanceof` leads to circular dependency problems.

  On the other hand, type guards only make different parts of the compiler
  depend on the type of the model classes, but not the actual implementation.
*/
export function isUnitModel(model) {
    return model && model.type === 'unit';
}
export function isFacetModel(model) {
    return model && model.type === 'facet';
}
export function isRepeatModel(model) {
    return model && model.type === 'repeat';
}
export function isConcatModel(model) {
    return model && model.type === 'concat';
}
export function isLayerModel(model) {
    return model && model.type === 'layer';
}
export class Model {
    constructor(spec, parent, parentGivenName, config, repeater, resolve) {
        this.children = [];
        /**
         * Corrects the data references in marks after assemble.
         */
        this.correctDataNames = (mark) => {
            // TODO: make this correct
            // for normal data references
            if (mark.from && mark.from.data) {
                mark.from.data = this.lookupDataSource(mark.from.data);
            }
            // for access to facet data
            if (mark.from && mark.from.facet && mark.from.facet.data) {
                mark.from.facet.data = this.lookupDataSource(mark.from.facet.data);
            }
            return mark;
        };
        this.parent = parent;
        this.config = config;
        this.repeater = repeater;
        // If name is not provided, always use parent's givenName to avoid name conflicts.
        this.name = spec.name || parentGivenName;
        this.title = isString(spec.title) ? { text: spec.title } : spec.title;
        // Shared name maps
        this.scaleNameMap = parent ? parent.scaleNameMap : new NameMap();
        this.projectionNameMap = parent ? parent.projectionNameMap : new NameMap();
        this.signalNameMap = parent ? parent.signalNameMap : new NameMap();
        this.data = spec.data;
        this.description = spec.description;
        this.transforms = normalizeTransform(spec.transform || []);
        this.layout =
            isUnitSpec(spec) || isLayerSpec(spec) ? undefined : extractCompositionLayout(spec);
        this.component = {
            data: {
                sources: parent ? parent.component.data.sources : [],
                outputNodes: parent ? parent.component.data.outputNodes : {},
                outputNodeRefCounts: parent ? parent.component.data.outputNodeRefCounts : {},
                // data is faceted if the spec is a facet spec or the parent has faceted data and no data is defined
                isFaceted: isFacetSpec(spec) || (parent && parent.component.data.isFaceted && !spec.data)
            },
            layoutSize: new Split(),
            layoutHeaders: { row: {}, column: {} },
            mark: null,
            resolve: Object.assign({ scale: {}, axis: {}, legend: {} }, (resolve ? duplicate(resolve) : {})),
            selection: null,
            scales: null,
            projection: null,
            axes: {},
            legends: {}
        };
    }
    get width() {
        return this.getSizeSignalRef('width');
    }
    get height() {
        return this.getSizeSignalRef('height');
    }
    initSize(size) {
        const { width, height } = size;
        if (width) {
            this.component.layoutSize.set('width', width, true);
        }
        if (height) {
            this.component.layoutSize.set('height', height, true);
        }
    }
    parse() {
        this.parseScale();
        this.parseLayoutSize(); // depends on scale
        this.renameTopLevelLayoutSizeSignal();
        this.parseSelection();
        this.parseProjection();
        this.parseData(); // (pathorder) depends on markDef; selection filters depend on parsed selections; depends on projection because some transforms require the finalized projection name.
        this.parseAxisAndHeader(); // depends on scale and layout size
        this.parseLegend(); // depends on scale, markDef
        this.parseMarkGroup(); // depends on data name, scale, layout size, axisGroup, and children's scale, axis, legend and mark.
    }
    parseScale() {
        parseScale(this);
    }
    parseProjection() {
        parseProjection(this);
    }
    /**
     * Rename top-level spec's size to be just width / height, ignoring model name.
     * This essentially merges the top-level spec's width/height signals with the width/height signals
     * to help us reduce redundant signals declaration.
     */
    renameTopLevelLayoutSizeSignal() {
        if (this.getName('width') !== 'width') {
            this.renameSignal(this.getName('width'), 'width');
        }
        if (this.getName('height') !== 'height') {
            this.renameSignal(this.getName('height'), 'height');
        }
    }
    parseLegend() {
        parseLegend(this);
    }
    assembleGroupStyle() {
        if (this.type === 'unit' || this.type === 'layer') {
            return 'cell';
        }
        return undefined;
    }
    assembleLayoutSize() {
        if (this.type === 'unit' || this.type === 'layer') {
            return {
                width: this.getSizeSignalRef('width'),
                height: this.getSizeSignalRef('height')
            };
        }
        return undefined;
    }
    assembleLayout() {
        if (!this.layout) {
            return undefined;
        }
        const { align, bounds, center, spacing = {} } = this.layout;
        return Object.assign({ padding: isNumber(spacing)
                ? spacing
                : {
                    row: spacing.row || 10,
                    column: spacing.column || 10
                } }, this.assembleDefaultLayout(), (align ? { align } : {}), (bounds ? { bounds } : {}), (center ? { center } : {}));
    }
    assembleDefaultLayout() {
        return {};
    }
    assembleHeaderMarks() {
        const { layoutHeaders } = this.component;
        let headerMarks = [];
        for (const channel of HEADER_CHANNELS) {
            if (layoutHeaders[channel].title) {
                headerMarks.push(getTitleGroup(this, channel));
            }
        }
        for (const channel of HEADER_CHANNELS) {
            headerMarks = headerMarks.concat(getHeaderGroups(this, channel));
        }
        return headerMarks;
    }
    assembleAxes() {
        return assembleAxes(this.component.axes, this.config);
    }
    assembleLegends() {
        return assembleLegends(this);
    }
    assembleProjections() {
        return assembleProjections(this);
    }
    assembleTitle() {
        const _a = this.title || {}, { encoding } = _a, titleNoEncoding = tslib_1.__rest(_a, ["encoding"]);
        const title = Object.assign({}, extractTitleConfig(this.config.title).nonMark, titleNoEncoding, (encoding ? { encode: { update: encoding } } : {}));
        if (title.text) {
            if (!contains(['unit', 'layer'], this.type)) {
                // As described in https://github.com/vega/vega-lite/issues/2875:
                // Due to vega/vega#960 (comment), we only support title's anchor for unit and layered spec for now.
                if (title.anchor && title.anchor !== 'start') {
                    log.warn(log.message.cannotSetTitleAnchor(this.type));
                }
                title.anchor = 'start';
            }
            if (contains(['middle', undefined], title.anchor) && title.frame === undefined) {
                title.frame = 'group';
            }
            return keys(title).length > 0 ? title : undefined;
        }
        return undefined;
    }
    /**
     * Assemble the mark group for this model.  We accept optional `signals` so that we can include concat top-level signals with the top-level model's local signals.
     */
    assembleGroup(signals = []) {
        const group = {};
        signals = signals.concat(this.assembleSelectionSignals());
        if (signals.length > 0) {
            group.signals = signals;
        }
        const layout = this.assembleLayout();
        if (layout) {
            group.layout = layout;
        }
        group.marks = [].concat(this.assembleHeaderMarks(), this.assembleMarks());
        // Only include scales if this spec is top-level or if parent is facet.
        // (Otherwise, it will be merged with upper-level's scope.)
        const scales = !this.parent || isFacetModel(this.parent) ? assembleScales(this) : [];
        if (scales.length > 0) {
            group.scales = scales;
        }
        const axes = this.assembleAxes();
        if (axes.length > 0) {
            group.axes = axes;
        }
        const legends = this.assembleLegends();
        if (legends.length > 0) {
            group.legends = legends;
        }
        return group;
    }
    hasDescendantWithFieldOnChannel(channel) {
        for (const child of this.children) {
            if (isUnitModel(child)) {
                if (child.channelHasField(channel)) {
                    return true;
                }
            }
            else {
                if (child.hasDescendantWithFieldOnChannel(channel)) {
                    return true;
                }
            }
        }
        return false;
    }
    getName(text) {
        return varName((this.name ? this.name + '_' : '') + text);
    }
    /**
     * Request a data source name for the given data source type and mark that data source as required. This method should be called in parse, so that all used data source can be correctly instantiated in assembleData().
     */
    requestDataName(name) {
        const fullName = this.getName(name);
        // Increase ref count. This is critical because otherwise we won't create a data source.
        // We also increase the ref counts on OutputNode.getSource() calls.
        const refCounts = this.component.data.outputNodeRefCounts;
        refCounts[fullName] = (refCounts[fullName] || 0) + 1;
        return fullName;
    }
    getSizeSignalRef(sizeType) {
        if (isFacetModel(this.parent)) {
            const channel = sizeType === 'width' ? 'x' : 'y';
            const scaleComponent = this.component.scales[channel];
            if (scaleComponent && !scaleComponent.merged) {
                // independent scale
                const type = scaleComponent.get('type');
                const range = scaleComponent.get('range');
                if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                    const scaleName = scaleComponent.get('name');
                    const domain = assembleDomain(this, channel);
                    const field = getFieldFromDomain(domain);
                    if (field) {
                        const fieldRef = vgField({ aggregate: 'distinct', field }, { expr: 'datum' });
                        return {
                            signal: sizeExpr(scaleName, scaleComponent, fieldRef)
                        };
                    }
                    else {
                        log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                        return null;
                    }
                }
            }
        }
        return {
            signal: this.signalNameMap.get(this.getName(sizeType))
        };
    }
    /**
     * Lookup the name of the datasource for an output node. You probably want to call this in assemble.
     */
    lookupDataSource(name) {
        const node = this.component.data.outputNodes[name];
        if (!node) {
            // Name not found in map so let's just return what we got.
            // This can happen if we already have the correct name.
            return name;
        }
        return node.getSource();
    }
    getSignalName(oldSignalName) {
        return this.signalNameMap.get(oldSignalName);
    }
    renameSignal(oldName, newName) {
        this.signalNameMap.rename(oldName, newName);
    }
    renameScale(oldName, newName) {
        this.scaleNameMap.rename(oldName, newName);
    }
    renameProjection(oldName, newName) {
        this.projectionNameMap.rename(oldName, newName);
    }
    /**
     * @return scale name for a given channel after the scale has been parsed and named.
     */
    scaleName(originalScaleName, parse) {
        if (parse) {
            // During the parse phase always return a value
            // No need to refer to rename map because a scale can't be renamed
            // before it has the original name.
            return this.getName(originalScaleName);
        }
        // If there is a scale for the channel, it should either
        // be in the scale component or exist in the name map
        if (
        // If there is a scale for the channel, there should be a local scale component for it
        (isChannel(originalScaleName) && isScaleChannel(originalScaleName) && this.component.scales[originalScaleName]) ||
            // in the scale name map (the scale get merged by its parent)
            this.scaleNameMap.has(this.getName(originalScaleName))) {
            return this.scaleNameMap.get(this.getName(originalScaleName));
        }
        return undefined;
    }
    /**
     * @return projection name after the projection has been parsed and named.
     */
    projectionName(parse) {
        if (parse) {
            // During the parse phase always return a value
            // No need to refer to rename map because a projection can't be renamed
            // before it has the original name.
            return this.getName('projection');
        }
        if ((this.component.projection && !this.component.projection.merged) ||
            this.projectionNameMap.has(this.getName('projection'))) {
            return this.projectionNameMap.get(this.getName('projection'));
        }
        return undefined;
    }
    /**
     * Traverse a model's hierarchy to get the scale component for a particular channel.
     */
    getScaleComponent(channel) {
        /* istanbul ignore next: This is warning for debugging test */
        if (!this.component.scales) {
            throw new Error('getScaleComponent cannot be called before parseScale().  Make sure you have called parseScale or use parseUnitModelWithScale().');
        }
        const localScaleComponent = this.component.scales[channel];
        if (localScaleComponent && !localScaleComponent.merged) {
            return localScaleComponent;
        }
        return this.parent ? this.parent.getScaleComponent(channel) : undefined;
    }
    /**
     * Traverse a model's hierarchy to get a particular selection component.
     */
    getSelectionComponent(variableName, origName) {
        let sel = this.component.selection[variableName];
        if (!sel && this.parent) {
            sel = this.parent.getSelectionComponent(variableName, origName);
        }
        if (!sel) {
            throw new Error(log.message.selectionNotFound(origName));
        }
        return sel;
    }
}
/** Abstract class for UnitModel and FacetModel.  Both of which can contain fieldDefs as a part of its own specification. */
export class ModelWithField extends Model {
    /** Get "field" reference for Vega */
    vgField(channel, opt = {}) {
        const fieldDef = this.fieldDef(channel);
        if (!fieldDef) {
            return undefined;
        }
        return vgField(fieldDef, opt);
    }
    reduceFieldDef(f, init, t) {
        return reduce(this.getMapping(), (acc, cd, c) => {
            const fieldDef = getFieldDef(cd);
            if (fieldDef) {
                return f(acc, fieldDef, c);
            }
            return acc;
        }, init, t);
    }
    forEachFieldDef(f, t) {
        forEach(this.getMapping(), (cd, c) => {
            const fieldDef = getFieldDef(cd);
            if (fieldDef) {
                f(fieldDef, c);
            }
        }, t);
    }
}
//# sourceMappingURL=model.js.map
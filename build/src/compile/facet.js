import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { COLUMN, ROW } from '../channel';
import { reduce } from '../encoding';
import { normalize, title as fieldDefTitle, vgField } from '../fielddef';
import * as log from '../log';
import { hasDiscreteDomain } from '../scale';
import { isSortField } from '../sort';
import { contains } from '../util';
import { isVgRangeStep } from '../vega.schema';
import { assembleAxis } from './axis/assemble';
import { buildModel } from './buildmodel';
import { assembleFacetData } from './data/assemble';
import { sortArrayIndexField } from './data/calculate';
import { parseData } from './data/parse';
import { getHeaderType } from './header/index';
import { parseChildrenLayoutSize } from './layoutsize/parse';
import { ModelWithField } from './model';
import { replaceRepeaterInFacet } from './repeater';
import { parseGuideResolve } from './resolve';
import { assembleDomain, getFieldFromDomain } from './scale/domain';
import { assembleFacetSignals } from './selection/selection';
export function facetSortFieldName(fieldDef, sort, opt) {
    return vgField(sort, tslib_1.__assign({ suffix: "by_" + vgField(fieldDef) }, (opt || {})));
}
var FacetModel = /** @class */ (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, repeater, spec.resolve) || this;
        _this.type = 'facet';
        _this.child = buildModel(spec.spec, _this, _this.getName('child'), undefined, repeater, config, false);
        _this.children = [_this.child];
        var facet = replaceRepeaterInFacet(spec.facet, repeater);
        _this.facet = _this.initFacet(facet);
        return _this;
    }
    FacetModel.prototype.initFacet = function (facet) {
        // clone to prevent side effect to the original spec
        return reduce(facet, function (normalizedFacet, fieldDef, channel) {
            if (!contains([ROW, COLUMN], channel)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, 'facet'));
                return normalizedFacet;
            }
            if (fieldDef.field === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                return normalizedFacet;
            }
            // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
            normalizedFacet[channel] = normalize(fieldDef, channel);
            return normalizedFacet;
        }, {});
    };
    FacetModel.prototype.channelHasField = function (channel) {
        return !!this.facet[channel];
    };
    FacetModel.prototype.fieldDef = function (channel) {
        return this.facet[channel];
    };
    FacetModel.prototype.parseData = function () {
        this.component.data = parseData(this);
        this.child.parseData();
    };
    FacetModel.prototype.parseLayoutSize = function () {
        parseChildrenLayoutSize(this);
    };
    FacetModel.prototype.parseSelection = function () {
        // As a facet has a single child, the selection components are the same.
        // The child maintains its selections to assemble signals, which remain
        // within its unit.
        this.child.parseSelection();
        this.component.selection = this.child.component.selection;
    };
    FacetModel.prototype.parseMarkGroup = function () {
        this.child.parseMarkGroup();
    };
    FacetModel.prototype.parseAxisAndHeader = function () {
        this.child.parseAxisAndHeader();
        this.parseHeader('column');
        this.parseHeader('row');
        this.mergeChildAxis('x');
        this.mergeChildAxis('y');
    };
    FacetModel.prototype.parseHeader = function (channel) {
        if (this.channelHasField(channel)) {
            var fieldDef = this.facet[channel];
            var title = fieldDefTitle(fieldDef, this.config, { allowDisabling: true });
            if (this.child.component.layoutHeaders[channel].title) {
                // merge title with child to produce "Title / Subtitle / Sub-subtitle"
                title += ' / ' + this.child.component.layoutHeaders[channel].title;
                this.child.component.layoutHeaders[channel].title = null;
            }
            this.component.layoutHeaders[channel] = {
                title: title,
                facetFieldDef: fieldDef,
                // TODO: support adding label to footer as well
                header: [this.makeHeaderComponent(channel, true)]
            };
        }
    };
    FacetModel.prototype.makeHeaderComponent = function (channel, labels) {
        var sizeType = channel === 'row' ? 'height' : 'width';
        return {
            labels: labels,
            sizeSignal: this.child.component.layoutSize.get(sizeType) ? this.child.getSizeSignalRef(sizeType) : undefined,
            axes: []
        };
    };
    FacetModel.prototype.mergeChildAxis = function (channel) {
        var child = this.child;
        if (child.component.axes[channel]) {
            var _a = this.component, layoutHeaders = _a.layoutHeaders, resolve = _a.resolve;
            resolve.axis[channel] = parseGuideResolve(resolve, channel);
            if (resolve.axis[channel] === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = layoutHeaders[headerChannel];
                for (var _i = 0, _b = child.component.axes[channel]; _i < _b.length; _i++) {
                    var axisComponent = _b[_i];
                    var headerType = getHeaderType(axisComponent.get('orient'));
                    layoutHeader[headerType] = layoutHeader[headerType] || [this.makeHeaderComponent(headerChannel, false)];
                    var mainAxis = assembleAxis(axisComponent, 'main', this.config, { header: true });
                    // LayoutHeader no longer keep track of property precedence, thus let's combine.
                    layoutHeader[headerType][0].axes.push(mainAxis);
                    axisComponent.mainExtracted = true;
                }
            }
            else {
                // Otherwise do nothing for independent axes
            }
        }
    };
    FacetModel.prototype.assembleSelectionTopLevelSignals = function (signals) {
        return this.child.assembleSelectionTopLevelSignals(signals);
    };
    FacetModel.prototype.assembleSelectionSignals = function () {
        this.child.assembleSelectionSignals();
        return [];
    };
    FacetModel.prototype.assembleSelectionData = function (data) {
        return this.child.assembleSelectionData(data);
    };
    FacetModel.prototype.getHeaderLayoutMixins = function () {
        var _this = this;
        var layoutMixins = {};
        ['row', 'column'].forEach(function (channel) {
            ['header', 'footer'].forEach(function (headerType) {
                var layoutHeaderComponent = _this.component.layoutHeaders[channel];
                var headerComponent = layoutHeaderComponent[headerType];
                if (headerComponent && headerComponent[0]) {
                    // set header/footerBand
                    var sizeType = channel === 'row' ? 'height' : 'width';
                    var bandType = headerType === 'header' ? 'headerBand' : 'footerBand';
                    if (!_this.child.component.layoutSize.get(sizeType)) {
                        // If facet child does not have size signal, then apply headerBand
                        layoutMixins[bandType] = layoutMixins[bandType] || {};
                        layoutMixins[bandType][channel] = 0.5;
                    }
                    if (layoutHeaderComponent.title) {
                        layoutMixins.offset = layoutMixins.offset || {};
                        layoutMixins.offset[channel === 'row' ? 'rowTitle' : 'columnTitle'] = 10;
                    }
                }
            });
        });
        return layoutMixins;
    };
    FacetModel.prototype.assembleDefaultLayout = function () {
        var columns = this.channelHasField('column') ? this.columnDistinctSignal() : 1;
        // TODO: determine default align based on shared / independent scales
        return tslib_1.__assign({}, this.getHeaderLayoutMixins(), { columns: columns, bounds: 'full', align: 'all' });
    };
    FacetModel.prototype.assembleLayoutSignals = function () {
        // FIXME(https://github.com/vega/vega-lite/issues/1193): this can be incorrect if we have independent scales.
        return this.child.assembleLayoutSignals();
    };
    FacetModel.prototype.columnDistinctSignal = function () {
        if (this.parent && this.parent instanceof FacetModel) {
            // For nested facet, we will add columns to group mark instead
            // See discussion in https://github.com/vega/vega/issues/952
            // and https://github.com/vega/vega-view/releases/tag/v1.2.6
            return undefined;
        }
        else {
            // In facetNode.assemble(), the name is always this.getName('column') + '_layout'.
            var facetLayoutDataName = this.getName('column_domain');
            return { signal: "length(data('" + facetLayoutDataName + "'))" };
        }
    };
    FacetModel.prototype.assembleGroup = function (signals) {
        if (this.parent && this.parent instanceof FacetModel) {
            // Provide number of columns for layout.
            // See discussion in https://github.com/vega/vega/issues/952
            // and https://github.com/vega/vega-view/releases/tag/v1.2.6
            return tslib_1.__assign({}, (this.channelHasField('column')
                ? {
                    encode: {
                        update: {
                            // TODO(https://github.com/vega/vega-lite/issues/2759):
                            // Correct the signal for facet of concat of facet_column
                            columns: { field: vgField(this.facet.column, { prefix: 'distinct' }) }
                        }
                    }
                }
                : {}), _super.prototype.assembleGroup.call(this, signals));
        }
        return _super.prototype.assembleGroup.call(this, signals);
    };
    /**
     * Aggregate cardinality for calculating size
     */
    FacetModel.prototype.getCardinalityAggregateForChild = function () {
        var fields = [];
        var ops = [];
        var as = [];
        if (this.child instanceof FacetModel) {
            if (this.child.channelHasField('column')) {
                var field = vgField(this.child.facet.column);
                fields.push(field);
                ops.push('distinct');
                as.push("distinct_" + field);
            }
        }
        else {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                var childScaleComponent = this.child.component.scales[channel];
                if (childScaleComponent && !childScaleComponent.merged) {
                    var type = childScaleComponent.get('type');
                    var range = childScaleComponent.get('range');
                    if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                        var domain = assembleDomain(this.child, channel);
                        var field = getFieldFromDomain(domain);
                        if (field) {
                            fields.push(field);
                            ops.push('distinct');
                            as.push("distinct_" + field);
                        }
                        else {
                            log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                        }
                    }
                }
            }
        }
        return { fields: fields, ops: ops, as: as };
    };
    FacetModel.prototype.assembleFacet = function () {
        var _this = this;
        var _a = this.component.data.facetRoot, name = _a.name, data = _a.data;
        var _b = this.facet, row = _b.row, column = _b.column;
        var _c = this.getCardinalityAggregateForChild(), fields = _c.fields, ops = _c.ops, as = _c.as;
        var groupby = [];
        ['row', 'column'].forEach(function (channel) {
            var fieldDef = _this.facet[channel];
            if (fieldDef) {
                groupby.push(vgField(fieldDef));
                var sort = fieldDef.sort;
                if (isSortField(sort)) {
                    var field = sort.field, op = sort.op;
                    var outputName = facetSortFieldName(fieldDef, sort);
                    if (row && column) {
                        // For crossed facet, use pre-calculate field as it requires a different groupby
                        // For each calculated field, apply max and assign them to the same name as
                        // all values of the same group should be the same anyway.
                        fields.push(outputName);
                        ops.push('max');
                        as.push(outputName);
                    }
                    else {
                        fields.push(field);
                        ops.push(op);
                        as.push(outputName);
                    }
                }
                else if (isArray(sort)) {
                    var outputName = sortArrayIndexField(fieldDef, channel);
                    fields.push(outputName);
                    ops.push('max');
                    as.push(outputName);
                }
            }
        });
        var cross = !!row && !!column;
        return tslib_1.__assign({ name: name,
            data: data,
            groupby: groupby }, (cross || fields.length
            ? {
                aggregate: tslib_1.__assign({}, (cross ? { cross: cross } : {}), (fields.length ? { fields: fields, ops: ops, as: as } : {}))
            }
            : {}));
    };
    FacetModel.prototype.headerSortFields = function (channel) {
        var facet = this.facet;
        var fieldDef = facet[channel];
        if (fieldDef) {
            if (isSortField(fieldDef.sort)) {
                return [facetSortFieldName(fieldDef, fieldDef.sort, { expr: 'datum' })];
            }
            else if (isArray(fieldDef.sort)) {
                return [sortArrayIndexField(fieldDef, channel, { expr: 'datum' })];
            }
            return [vgField(fieldDef, { expr: 'datum' })];
        }
        return [];
    };
    FacetModel.prototype.headerSortOrder = function (channel) {
        var facet = this.facet;
        var fieldDef = facet[channel];
        if (fieldDef) {
            var sort = fieldDef.sort;
            var order = (isSortField(sort) ? sort.order : !isArray(sort) && sort) || 'ascending';
            return [order];
        }
        return [];
    };
    FacetModel.prototype.assembleMarks = function () {
        var child = this.child;
        var facetRoot = this.component.data.facetRoot;
        var data = assembleFacetData(facetRoot);
        // If we facet by two dimensions, we need to add a cross operator to the aggregation
        // so that we create all groups
        var layoutSizeEncodeEntry = child.assembleLayoutSize();
        var title = child.assembleTitle();
        var style = child.assembleGroupStyle();
        var markGroup = tslib_1.__assign({ name: this.getName('cell'), type: 'group' }, (title ? { title: title } : {}), (style ? { style: style } : {}), { from: {
                facet: this.assembleFacet()
            }, 
            // TODO: move this to after data
            sort: {
                field: this.headerSortFields('row').concat(this.headerSortFields('column')),
                order: this.headerSortOrder('row').concat(this.headerSortOrder('column'))
            } }, (data.length > 0 ? { data: data } : {}), (layoutSizeEncodeEntry ? { encode: { update: layoutSizeEncodeEntry } } : {}), child.assembleGroup(assembleFacetSignals(this, [])));
        return [markGroup];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    return FacetModel;
}(ModelWithField));
export { FacetModel };
//# sourceMappingURL=facet.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var scale_1 = require("../scale");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var buildmodel_1 = require("./buildmodel");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var header_1 = require("./layout/header");
var parse_2 = require("./layoutsize/parse");
var model_1 = require("./model");
var repeater_1 = require("./repeater");
var resolve_1 = require("./resolve");
var domain_1 = require("./scale/domain");
var FacetModel = /** @class */ (function (_super) {
    __extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config, spec.resolve) || this;
        _this.type = 'facet';
        _this.child = buildmodel_1.buildModel(spec.spec, _this, _this.getName('child'), undefined, repeater, config, false);
        _this.children = [_this.child];
        var facet = repeater_1.replaceRepeaterInFacet(spec.facet, repeater);
        _this.facet = _this.initFacet(facet);
        return _this;
    }
    FacetModel.prototype.initFacet = function (facet) {
        // clone to prevent side effect to the original spec
        return encoding_1.reduce(facet, function (normalizedFacet, fieldDef, channel) {
            if (!util_1.contains([channel_1.ROW, channel_1.COLUMN], channel)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, 'facet'));
                return normalizedFacet;
            }
            if (fieldDef.field === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                return normalizedFacet;
            }
            // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
            normalizedFacet[channel] = fielddef_1.normalize(fieldDef, channel);
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
        this.component.data = parse_1.parseData(this);
        this.child.parseData();
    };
    FacetModel.prototype.parseLayoutSize = function () {
        parse_2.parseChildrenLayoutSize(this);
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
            var header = fieldDef.header || {};
            var title = header.title !== undefined ? header.title : fielddef_1.title(fieldDef, this.config);
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
            resolve.axis[channel] = resolve_1.parseGuideResolve(resolve, channel);
            if (resolve.axis[channel] === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = layoutHeaders[headerChannel];
                for (var _i = 0, _b = child.component.axes[channel]; _i < _b.length; _i++) {
                    var axisComponent = _b[_i];
                    var mainAxis = axisComponent.main;
                    var headerType = header_1.getHeaderType(mainAxis.get('orient'));
                    layoutHeader[headerType] = layoutHeader[headerType] ||
                        [this.makeHeaderComponent(headerChannel, false)];
                    // LayoutHeader no longer keep track of property precedence, thus let's combine.
                    layoutHeader[headerType][0].axes.push(mainAxis.combine());
                    delete axisComponent.main;
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
    FacetModel.prototype.getLayoutBandMixins = function (headerType) {
        var bandMixins = {};
        var bandType = headerType === 'header' ? 'headerBand' : 'footerBand';
        for (var _i = 0, _a = ['row', 'column']; _i < _a.length; _i++) {
            var channel = _a[_i];
            var layoutHeaderComponent = this.component.layoutHeaders[channel];
            var headerComponent = layoutHeaderComponent[headerType];
            if (headerComponent && headerComponent[0]) {
                var sizeType = channel === 'row' ? 'height' : 'width';
                if (!this.child.component.layoutSize.get(sizeType)) {
                    // If facet child does not have size signal, then apply headerBand
                    bandMixins[bandType] = bandMixins[bandType] || {};
                    bandMixins[bandType][channel] = 0.5;
                }
            }
        }
        return bandMixins;
    };
    FacetModel.prototype.assembleLayout = function () {
        var columns = this.channelHasField('column') ? this.columnDistinctSignal() : 1;
        // TODO: determine default align based on shared / independent scales
        return __assign({ padding: { row: 10, column: 10 } }, this.getLayoutBandMixins('header'), this.getLayoutBandMixins('footer'), { 
            // TODO: support offset for rowHeader/rowFooter/rowTitle/columnHeader/columnFooter/columnTitle
            offset: 10, columns: columns, bounds: 'full', align: 'all' });
    };
    FacetModel.prototype.assembleLayoutSignals = function () {
        // FIXME(https://github.com/vega/vega-lite/issues/1193): this can be incorrect if we have independent scales.
        return this.child.assembleLayoutSignals();
    };
    FacetModel.prototype.columnDistinctSignal = function () {
        if (this.parent && (this.parent instanceof FacetModel)) {
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
        if (this.parent && (this.parent instanceof FacetModel)) {
            // Provide number of columns for layout.
            // See discussion in https://github.com/vega/vega/issues/952
            // and https://github.com/vega/vega-view/releases/tag/v1.2.6
            return __assign({}, (this.channelHasField('column') ? {
                encode: {
                    update: {
                        // TODO(https://github.com/vega/vega-lite/issues/2759):
                        // Correct the signal for facet of concat of facet_column
                        columns: { field: fielddef_1.vgField(this.facet.column, { prefix: 'distinct' }) }
                    }
                }
            } : {}), _super.prototype.assembleGroup.call(this, signals));
        }
        return _super.prototype.assembleGroup.call(this, signals);
    };
    /**
     * Aggregate cardinality for calculating size
     */
    FacetModel.prototype.getCardinalityAggregateForChild = function () {
        var fields = [];
        var ops = [];
        if (this.child instanceof FacetModel) {
            if (this.child.channelHasField('column')) {
                fields.push(fielddef_1.vgField(this.child.facet.column));
                ops.push('distinct');
            }
        }
        else {
            for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
                var channel = _a[_i];
                var childScaleComponent = this.child.component.scales[channel];
                if (childScaleComponent && !childScaleComponent.merged) {
                    var type = childScaleComponent.get('type');
                    var range = childScaleComponent.get('range');
                    if (scale_1.hasDiscreteDomain(type) && vega_schema_1.isVgRangeStep(range)) {
                        var domain = domain_1.assembleDomain(this.child, channel);
                        var field = domain_1.getFieldFromDomain(domain);
                        if (field) {
                            fields.push(field);
                            ops.push('distinct');
                        }
                        else {
                            log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                        }
                    }
                }
            }
        }
        return fields.length ? { fields: fields, ops: ops } : undefined;
    };
    FacetModel.prototype.assembleMarks = function () {
        var _a = this, child = _a.child, facet = _a.facet;
        var facetRoot = this.component.data.facetRoot;
        var data = assemble_1.assembleFacetData(facetRoot);
        // If we facet by two dimensions, we need to add a cross operator to the aggregation
        // so that we create all groups
        var hasRow = this.channelHasField(channel_1.ROW);
        var hasColumn = this.channelHasField(channel_1.COLUMN);
        var layoutSizeEncodeEntry = child.assembleLayoutSize();
        var aggregateMixins = {};
        if (hasRow && hasColumn) {
            aggregateMixins.aggregate = { cross: true };
        }
        var cardinalityAggregateForChild = this.getCardinalityAggregateForChild();
        if (cardinalityAggregateForChild) {
            aggregateMixins.aggregate = __assign({}, aggregateMixins.aggregate, cardinalityAggregateForChild);
        }
        var title = child.assembleTitle();
        var style = child.assembleGroupStyle();
        var markGroup = __assign({ name: this.getName('cell'), type: 'group' }, (title ? { title: title } : {}), (style ? { style: style } : {}), { from: {
                facet: __assign({ name: facetRoot.name, data: facetRoot.data, groupby: [].concat(hasRow ? [this.vgField(channel_1.ROW)] : [], hasColumn ? [this.vgField(channel_1.COLUMN)] : []) }, aggregateMixins)
            }, sort: {
                field: [].concat(hasRow ? [this.vgField(channel_1.ROW, { expr: 'datum', })] : [], hasColumn ? [this.vgField(channel_1.COLUMN, { expr: 'datum' })] : []),
                order: [].concat(hasRow ? [(facet.row.sort) || 'ascending'] : [], hasColumn ? [(facet.column.sort) || 'ascending'] : [])
            } }, (data.length > 0 ? { data: data } : {}), (layoutSizeEncodeEntry ? { encode: { update: layoutSizeEncodeEntry } } : {}), child.assembleGroup());
        return [markGroup];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    return FacetModel;
}(model_1.ModelWithField));
exports.FacetModel = FacetModel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNDQUE4RDtBQUU5RCx3Q0FBbUM7QUFFbkMsd0NBQWlGO0FBQ2pGLDRCQUE4QjtBQUM5QixrQ0FBMkM7QUFFM0MsZ0NBQWlDO0FBQ2pDLDhDQUFzRztBQUN0RywyQ0FBd0M7QUFDeEMsNENBQWtEO0FBQ2xELHNDQUF1QztBQUN2QywwQ0FBOEU7QUFDOUUsNENBQTJEO0FBQzNELGlDQUE4QztBQUM5Qyx1Q0FBaUU7QUFDakUscUNBQTRDO0FBQzVDLHlDQUFrRTtBQUVsRTtJQUFnQyw4QkFBYztJQVE1QyxvQkFBWSxJQUFlLEVBQUUsTUFBYSxFQUFFLGVBQXVCLEVBQUUsUUFBdUIsRUFBRSxNQUFjO1FBQTVHLFlBQ0Usa0JBQU0sSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsU0FTM0Q7UUFqQmUsVUFBSSxHQUFZLE9BQU8sQ0FBQztRQVd0QyxLQUFJLENBQUMsS0FBSyxHQUFHLHVCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRyxLQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdCLElBQU0sS0FBSyxHQUF5QixpQ0FBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRWpGLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFDckMsQ0FBQztJQUVPLDhCQUFTLEdBQWpCLFVBQWtCLEtBQTJC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Li4vYWdncmVnYXRlJztcbmltcG9ydCB7Q2hhbm5lbCwgQ09MVU1OLCBST1csIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7cmVkdWNlfSBmcm9tICcuLi9lbmNvZGluZyc7XG5pbXBvcnQge0ZhY2V0TWFwcGluZ30gZnJvbSAnLi4vZmFjZXQnO1xuaW1wb3J0IHtGaWVsZERlZiwgbm9ybWFsaXplLCB0aXRsZSBhcyBmaWVsZERlZlRpdGxlLCB2Z0ZpZWxkfSBmcm9tICcuLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vbG9nJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW59IGZyb20gJy4uL3NjYWxlJztcbmltcG9ydCB7RmFjZXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBSb3dDb2wsIFZnQXhpcywgVmdEYXRhLCBWZ0xheW91dCwgVmdNYXJrR3JvdXAsIFZnU2lnbmFsfSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2J1aWxkTW9kZWx9IGZyb20gJy4vYnVpbGRtb2RlbCc7XG5pbXBvcnQge2Fzc2VtYmxlRmFjZXREYXRhfSBmcm9tICcuL2RhdGEvYXNzZW1ibGUnO1xuaW1wb3J0IHtwYXJzZURhdGF9IGZyb20gJy4vZGF0YS9wYXJzZSc7XG5pbXBvcnQge2dldEhlYWRlclR5cGUsIEhlYWRlckNoYW5uZWwsIEhlYWRlckNvbXBvbmVudH0gZnJvbSAnLi9sYXlvdXQvaGVhZGVyJztcbmltcG9ydCB7cGFyc2VDaGlsZHJlbkxheW91dFNpemV9IGZyb20gJy4vbGF5b3V0c2l6ZS9wYXJzZSc7XG5pbXBvcnQge01vZGVsLCBNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi9tb2RlbCc7XG5pbXBvcnQge1JlcGVhdGVyVmFsdWUsIHJlcGxhY2VSZXBlYXRlckluRmFjZXR9IGZyb20gJy4vcmVwZWF0ZXInO1xuaW1wb3J0IHtwYXJzZUd1aWRlUmVzb2x2ZX0gZnJvbSAnLi9yZXNvbHZlJztcbmltcG9ydCB7YXNzZW1ibGVEb21haW4sIGdldEZpZWxkRnJvbURvbWFpbn0gZnJvbSAnLi9zY2FsZS9kb21haW4nO1xuXG5leHBvcnQgY2xhc3MgRmFjZXRNb2RlbCBleHRlbmRzIE1vZGVsV2l0aEZpZWxkIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGU6ICdmYWNldCcgPSAnZmFjZXQnO1xuICBwdWJsaWMgcmVhZG9ubHkgZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+O1xuXG4gIHB1YmxpYyByZWFkb25seSBjaGlsZDogTW9kZWw7XG5cbiAgcHVibGljIHJlYWRvbmx5IGNoaWxkcmVuOiBNb2RlbFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNwZWM6IEZhY2V0U3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNwZWMsIHBhcmVudCwgcGFyZW50R2l2ZW5OYW1lLCBjb25maWcsIHNwZWMucmVzb2x2ZSk7XG5cblxuICAgIHRoaXMuY2hpbGQgPSBidWlsZE1vZGVsKHNwZWMuc3BlYywgdGhpcywgdGhpcy5nZXROYW1lKCdjaGlsZCcpLCB1bmRlZmluZWQsIHJlcGVhdGVyLCBjb25maWcsIGZhbHNlKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW3RoaXMuY2hpbGRdO1xuXG4gICAgY29uc3QgZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+ID0gcmVwbGFjZVJlcGVhdGVySW5GYWNldChzcGVjLmZhY2V0LCByZXBlYXRlcik7XG5cbiAgICB0aGlzLmZhY2V0ID0gdGhpcy5pbml0RmFjZXQoZmFjZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0RmFjZXQoZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+KTogRmFjZXRNYXBwaW5nPHN0cmluZz4ge1xuICAgIC8vIGNsb25lIHRvIHByZXZlbnQgc2lkZSBlZmZlY3QgdG8gdGhlIG9yaWdpbmFsIHNwZWNcbiAgICByZXR1cm4gcmVkdWNlKGZhY2V0LCBmdW5jdGlvbihub3JtYWxpemVkRmFjZXQsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoIWNvbnRhaW5zKFtST1csIENPTFVNTl0sIGNoYW5uZWwpKSB7XG4gICAgICAgIC8vIERyb3AgdW5zdXBwb3J0ZWQgY2hhbm5lbFxuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWwsICdmYWNldCcpKTtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRGYWNldDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLmZpZWxkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZW1wdHlGaWVsZERlZihmaWVsZERlZiwgY2hhbm5lbCkpO1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgICAgfVxuXG4gICAgICAvLyBDb252ZXJ0IHR5cGUgdG8gZnVsbCwgbG93ZXJjYXNlIHR5cGUsIG9yIGF1Z21lbnQgdGhlIGZpZWxkRGVmIHdpdGggYSBkZWZhdWx0IHR5cGUgaWYgbWlzc2luZy5cbiAgICAgIG5vcm1hbGl6ZWRGYWNldFtjaGFubmVsXSA9IG5vcm1hbGl6ZShmaWVsZERlZiwgY2hhbm5lbCk7XG4gICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBjaGFubmVsSGFzRmllbGQoY2hhbm5lbDogQ2hhbm5lbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZmFjZXRbY2hhbm5lbF07XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmZhY2V0W2NoYW5uZWxdO1xuICB9XG5cbiAgcHVibGljIHBhcnNlRGF0YSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5kYXRhID0gcGFyc2VEYXRhKHRoaXMpO1xuICAgIHRoaXMuY2hpbGQucGFyc2VEYXRhKCk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VMYXlvdXRTaXplKCkge1xuICAgIHBhcnNlQ2hpbGRyZW5MYXlvdXRTaXplKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU2VsZWN0aW9uKCkge1xuICAgIC8vIEFzIGEgZmFjZXQgaGFzIGEgc2luZ2xlIGNoaWxkLCB0aGUgc2VsZWN0aW9uIGNvbXBvbmVudHMgYXJlIHRoZSBzYW1lLlxuICAgIC8vIFRoZSBjaGlsZCBtYWludGFpbnMgaXRzIHNlbGVjdGlvbnMgdG8gYXNzZW1ibGUgc2lnbmFscywgd2hpY2ggcmVtYWluXG4gICAgLy8gd2l0aGluIGl0cyB1bml0LlxuICAgIHRoaXMuY2hpbGQucGFyc2VTZWxlY3Rpb24oKTtcbiAgICB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB0aGlzLmNoaWxkLmNvbXBvbmVudC5zZWxlY3Rpb247XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNYXJrR3JvdXAoKSB7XG4gICAgdGhpcy5jaGlsZC5wYXJzZU1hcmtHcm91cCgpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlQXhpc0FuZEhlYWRlcigpIHtcbiAgICB0aGlzLmNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgdGhpcy5wYXJzZUhlYWRlcignY29sdW1uJyk7XG4gICAgdGhpcy5wYXJzZUhlYWRlcigncm93Jyk7XG5cbiAgICB0aGlzLm1lcmdlQ2hpbGRBeGlzKCd4Jyk7XG4gICAgdGhpcy5tZXJnZUNoaWxkQXhpcygneScpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUhlYWRlcihjaGFubmVsOiBIZWFkZXJDaGFubmVsKSB7XG5cbiAgICBpZiAodGhpcy5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5mYWNldFtjaGFubmVsXTtcbiAgICAgIGNvbnN0IGhlYWRlciA9IGZpZWxkRGVmLmhlYWRlciB8fCB7fTtcbiAgICAgIGxldCB0aXRsZSA9IGhlYWRlci50aXRsZSAhPT0gdW5kZWZpbmVkID8gaGVhZGVyLnRpdGxlIDogZmllbGREZWZUaXRsZShmaWVsZERlZiwgdGhpcy5jb25maWcpO1xuXG4gICAgICBpZiAodGhpcy5jaGlsZC5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXS50aXRsZSkge1xuICAgICAgICAvLyBtZXJnZSB0aXRsZSB3aXRoIGNoaWxkIHRvIHByb2R1Y2UgXCJUaXRsZSAvIFN1YnRpdGxlIC8gU3ViLXN1YnRpdGxlXCJcbiAgICAgICAgdGl0bGUgKz0gJyAvICcgKyB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlO1xuICAgICAgICB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXSA9IHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGZhY2V0RmllbGREZWY6IGZpZWxkRGVmLFxuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IGFkZGluZyBsYWJlbCB0byBmb290ZXIgYXMgd2VsbFxuICAgICAgICBoZWFkZXI6IFt0aGlzLm1ha2VIZWFkZXJDb21wb25lbnQoY2hhbm5lbCwgdHJ1ZSldXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbWFrZUhlYWRlckNvbXBvbmVudChjaGFubmVsOiBIZWFkZXJDaGFubmVsLCBsYWJlbHM6IGJvb2xlYW4pOiBIZWFkZXJDb21wb25lbnQge1xuICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWxzLFxuICAgICAgc2l6ZVNpZ25hbDogdGhpcy5jaGlsZC5jb21wb25lbnQubGF5b3V0U2l6ZS5nZXQoc2l6ZVR5cGUpID8gdGhpcy5jaGlsZC5nZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlKSA6IHVuZGVmaW5lZCxcbiAgICAgIGF4ZXM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VDaGlsZEF4aXMoY2hhbm5lbDogJ3gnIHwgJ3knKSB7XG4gICAgY29uc3Qge2NoaWxkfSA9IHRoaXM7XG4gICAgaWYgKGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICBjb25zdCB7bGF5b3V0SGVhZGVycywgcmVzb2x2ZX0gPSB0aGlzLmNvbXBvbmVudDtcbiAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9IHBhcnNlR3VpZGVSZXNvbHZlKHJlc29sdmUsIGNoYW5uZWwpO1xuXG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBGb3Igc2hhcmVkIGF4aXMsIG1vdmUgdGhlIGF4ZXMgdG8gZmFjZXQncyBoZWFkZXIgb3IgZm9vdGVyXG4gICAgICAgIGNvbnN0IGhlYWRlckNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnY29sdW1uJyA6ICdyb3cnO1xuXG4gICAgICAgIGNvbnN0IGxheW91dEhlYWRlciA9IGxheW91dEhlYWRlcnNbaGVhZGVyQ2hhbm5lbF07XG4gICAgICAgIGZvciAoY29uc3QgYXhpc0NvbXBvbmVudCBvZiBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIGNvbnN0IG1haW5BeGlzID0gYXhpc0NvbXBvbmVudC5tYWluO1xuICAgICAgICAgIGNvbnN0IGhlYWRlclR5cGUgPSBnZXRIZWFkZXJUeXBlKG1haW5BeGlzLmdldCgnb3JpZW50JykpO1xuICAgICAgICAgIGxheW91dEhlYWRlcltoZWFkZXJUeXBlXSA9IGxheW91dEhlYWRlcltoZWFkZXJUeXBlXSB8fFxuICAgICAgICAgICAgW3RoaXMubWFrZUhlYWRlckNvbXBvbmVudChoZWFkZXJDaGFubmVsLCBmYWxzZSldO1xuXG4gICAgICAgICAgLy8gTGF5b3V0SGVhZGVyIG5vIGxvbmdlciBrZWVwIHRyYWNrIG9mIHByb3BlcnR5IHByZWNlZGVuY2UsIHRodXMgbGV0J3MgY29tYmluZS5cbiAgICAgICAgICBsYXlvdXRIZWFkZXJbaGVhZGVyVHlwZV1bMF0uYXhlcy5wdXNoKG1haW5BeGlzLmNvbWJpbmUoKSBhcyBWZ0F4aXMpO1xuICAgICAgICAgIGRlbGV0ZSBheGlzQ29tcG9uZW50Lm1haW47XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSBkbyBub3RoaW5nIGZvciBpbmRlcGVuZGVudCBheGVzXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uVG9wTGV2ZWxTaWduYWxzKHNpZ25hbHM6IGFueVtdKTogVmdTaWduYWxbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFscyk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCk6IFZnU2lnbmFsW10ge1xuICAgIHRoaXMuY2hpbGQuYXNzZW1ibGVTZWxlY3Rpb25TaWduYWxzKCk7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhOiBWZ0RhdGFbXSk6IFZnRGF0YVtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZC5hc3NlbWJsZVNlbGVjdGlvbkRhdGEoZGF0YSk7XG4gIH1cblxuICBwcml2YXRlIGdldExheW91dEJhbmRNaXhpbnMoaGVhZGVyVHlwZTogJ2hlYWRlcicgfCAnZm9vdGVyJyk6IHtcbiAgICBoZWFkZXJCYW5kPzogUm93Q29sPG51bWJlcj4sXG4gICAgZm9vdGVyQmFuZD86IFJvd0NvbDxudW1iZXI+XG4gIH0ge1xuICAgIGNvbnN0IGJhbmRNaXhpbnMgPSB7fTtcblxuICAgIGNvbnN0IGJhbmRUeXBlID0gaGVhZGVyVHlwZSA9PT0gJ2hlYWRlcicgPyAnaGVhZGVyQmFuZCcgOiAnZm9vdGVyQmFuZCc7XG5cbiAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWydyb3cnLCAnY29sdW1uJ10gYXMgKCdyb3cnIHwgJ2NvbHVtbicpW10pIHtcbiAgICAgIGNvbnN0IGxheW91dEhlYWRlckNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50LmxheW91dEhlYWRlcnNbY2hhbm5lbF07XG4gICAgICBjb25zdCBoZWFkZXJDb21wb25lbnQgPSBsYXlvdXRIZWFkZXJDb21wb25lbnRbaGVhZGVyVHlwZV07XG4gICAgICBpZiAoaGVhZGVyQ29tcG9uZW50ICYmIGhlYWRlckNvbXBvbmVudFswXSkge1xuICAgICAgICBjb25zdCBzaXplVHlwZSA9IGNoYW5uZWwgPT09ICdyb3cnID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgICAgIGlmICghdGhpcy5jaGlsZC5jb21wb25lbnQubGF5b3V0U2l6ZS5nZXQoc2l6ZVR5cGUpKSB7XG4gICAgICAgICAgLy8gSWYgZmFjZXQgY2hpbGQgZG9lcyBub3QgaGF2ZSBzaXplIHNpZ25hbCwgdGhlbiBhcHBseSBoZWFkZXJCYW5kXG4gICAgICAgICAgYmFuZE1peGluc1tiYW5kVHlwZV0gPSBiYW5kTWl4aW5zW2JhbmRUeXBlXSB8fCB7fTtcbiAgICAgICAgICBiYW5kTWl4aW5zW2JhbmRUeXBlXVtjaGFubmVsXSA9IDAuNTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYmFuZE1peGlucztcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dCgpOiBWZ0xheW91dCB7XG4gICAgY29uc3QgY29sdW1ucyA9IHRoaXMuY2hhbm5lbEhhc0ZpZWxkKCdjb2x1bW4nKSA/IHRoaXMuY29sdW1uRGlzdGluY3RTaWduYWwoKSA6IDE7XG5cbiAgICAvLyBUT0RPOiBkZXRlcm1pbmUgZGVmYXVsdCBhbGlnbiBiYXNlZCBvbiBzaGFyZWQgLyBpbmRlcGVuZGVudCBzY2FsZXNcblxuICAgIHJldHVybiB7XG4gICAgICBwYWRkaW5nOiB7cm93OiAxMCwgY29sdW1uOiAxMH0sXG4gICAgICAuLi50aGlzLmdldExheW91dEJhbmRNaXhpbnMoJ2hlYWRlcicpLFxuICAgICAgLi4udGhpcy5nZXRMYXlvdXRCYW5kTWl4aW5zKCdmb290ZXInKSxcblxuICAgICAgLy8gVE9ETzogc3VwcG9ydCBvZmZzZXQgZm9yIHJvd0hlYWRlci9yb3dGb290ZXIvcm93VGl0bGUvY29sdW1uSGVhZGVyL2NvbHVtbkZvb3Rlci9jb2x1bW5UaXRsZVxuICAgICAgb2Zmc2V0OiAxMCxcbiAgICAgIGNvbHVtbnMsXG4gICAgICBib3VuZHM6ICdmdWxsJyxcbiAgICAgIGFsaWduOiAnYWxsJ1xuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVMYXlvdXRTaWduYWxzKCk6IFZnU2lnbmFsW10ge1xuICAgIC8vIEZJWE1FKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMTE5Myk6IHRoaXMgY2FuIGJlIGluY29ycmVjdCBpZiB3ZSBoYXZlIGluZGVwZW5kZW50IHNjYWxlcy5cbiAgICByZXR1cm4gdGhpcy5jaGlsZC5hc3NlbWJsZUxheW91dFNpZ25hbHMoKTtcbiAgfVxuXG4gIHByaXZhdGUgY29sdW1uRGlzdGluY3RTaWduYWwoKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICYmICh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEZhY2V0TW9kZWwpKSB7XG4gICAgICAvLyBGb3IgbmVzdGVkIGZhY2V0LCB3ZSB3aWxsIGFkZCBjb2x1bW5zIHRvIGdyb3VwIG1hcmsgaW5zdGVhZFxuICAgICAgLy8gU2VlIGRpc2N1c3Npb24gaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS9pc3N1ZXMvOTUyXG4gICAgICAvLyBhbmQgaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS12aWV3L3JlbGVhc2VzL3RhZy92MS4yLjZcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIGZhY2V0Tm9kZS5hc3NlbWJsZSgpLCB0aGUgbmFtZSBpcyBhbHdheXMgdGhpcy5nZXROYW1lKCdjb2x1bW4nKSArICdfbGF5b3V0Jy5cbiAgICAgIGNvbnN0IGZhY2V0TGF5b3V0RGF0YU5hbWUgPSB0aGlzLmdldE5hbWUoJ2NvbHVtbl9kb21haW4nKTtcbiAgICAgIHJldHVybiB7c2lnbmFsOiBgbGVuZ3RoKGRhdGEoJyR7ZmFjZXRMYXlvdXREYXRhTmFtZX0nKSlgfTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVHcm91cChzaWduYWxzOiBWZ1NpZ25hbFtdKSB7XG4gICAgaWYgKHRoaXMucGFyZW50ICYmICh0aGlzLnBhcmVudCBpbnN0YW5jZW9mIEZhY2V0TW9kZWwpKSB7XG4gICAgICAvLyBQcm92aWRlIG51bWJlciBvZiBjb2x1bW5zIGZvciBsYXlvdXQuXG4gICAgICAvLyBTZWUgZGlzY3Vzc2lvbiBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL2lzc3Vlcy85NTJcbiAgICAgIC8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLXZpZXcvcmVsZWFzZXMvdGFnL3YxLjIuNlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uKHRoaXMuY2hhbm5lbEhhc0ZpZWxkKCdjb2x1bW4nKSA/IHtcbiAgICAgICAgICBlbmNvZGU6IHtcbiAgICAgICAgICAgIHVwZGF0ZToge1xuICAgICAgICAgICAgICAvLyBUT0RPKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjc1OSk6XG4gICAgICAgICAgICAgIC8vIENvcnJlY3QgdGhlIHNpZ25hbCBmb3IgZmFjZXQgb2YgY29uY2F0IG9mIGZhY2V0X2NvbHVtblxuICAgICAgICAgICAgICBjb2x1bW5zOiB7ZmllbGQ6IHZnRmllbGQodGhpcy5mYWNldC5jb2x1bW4sIHtwcmVmaXg6ICdkaXN0aW5jdCd9KX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gOiB7fSksXG4gICAgICAgIC4uLnN1cGVyLmFzc2VtYmxlR3JvdXAoc2lnbmFscylcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5hc3NlbWJsZUdyb3VwKHNpZ25hbHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFnZ3JlZ2F0ZSBjYXJkaW5hbGl0eSBmb3IgY2FsY3VsYXRpbmcgc2l6ZVxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkKCkge1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBvcHM6IEFnZ3JlZ2F0ZU9wW10gPSBbXTtcbiAgICBpZiAodGhpcy5jaGlsZCBpbnN0YW5jZW9mIEZhY2V0TW9kZWwpIHtcbiAgICAgIGlmICh0aGlzLmNoaWxkLmNoYW5uZWxIYXNGaWVsZCgnY29sdW1uJykpIHtcbiAgICAgICAgZmllbGRzLnB1c2godmdGaWVsZCh0aGlzLmNoaWxkLmZhY2V0LmNvbHVtbikpO1xuICAgICAgICBvcHMucHVzaCgnZGlzdGluY3QnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5J10gYXMgU2NhbGVDaGFubmVsW10pIHtcbiAgICAgICAgY29uc3QgY2hpbGRTY2FsZUNvbXBvbmVudCA9IHRoaXMuY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgICAgaWYgKGNoaWxkU2NhbGVDb21wb25lbnQgJiYgIWNoaWxkU2NhbGVDb21wb25lbnQubWVyZ2VkKSB7XG4gICAgICAgICAgY29uc3QgdHlwZSA9IGNoaWxkU2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSBjaGlsZFNjYWxlQ29tcG9uZW50LmdldCgncmFuZ2UnKTtcblxuICAgICAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbih0eXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgICAgICAgY29uc3QgZG9tYWluID0gYXNzZW1ibGVEb21haW4odGhpcy5jaGlsZCwgY2hhbm5lbCk7XG4gICAgICAgICAgICBjb25zdCBmaWVsZCA9IGdldEZpZWxkRnJvbURvbWFpbihkb21haW4pO1xuICAgICAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgICAgICAgICAgb3BzLnB1c2goJ2Rpc3RpbmN0Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBsb2cud2FybignVW5rbm93biBmaWVsZCBmb3IgJHtjaGFubmVsfS4gIENhbm5vdCBjYWxjdWxhdGUgdmlldyBzaXplLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmllbGRzLmxlbmd0aCA/IHtmaWVsZHMsIG9wc30gOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVNYXJrcygpOiBWZ01hcmtHcm91cFtdIHtcbiAgICBjb25zdCB7Y2hpbGQsIGZhY2V0fSA9IHRoaXM7XG4gICAgY29uc3QgZmFjZXRSb290ID0gdGhpcy5jb21wb25lbnQuZGF0YS5mYWNldFJvb3Q7XG4gICAgY29uc3QgZGF0YSA9IGFzc2VtYmxlRmFjZXREYXRhKGZhY2V0Um9vdCk7XG5cbiAgICAvLyBJZiB3ZSBmYWNldCBieSB0d28gZGltZW5zaW9ucywgd2UgbmVlZCB0byBhZGQgYSBjcm9zcyBvcGVyYXRvciB0byB0aGUgYWdncmVnYXRpb25cbiAgICAvLyBzbyB0aGF0IHdlIGNyZWF0ZSBhbGwgZ3JvdXBzXG4gICAgY29uc3QgaGFzUm93ID0gdGhpcy5jaGFubmVsSGFzRmllbGQoUk9XKTtcbiAgICBjb25zdCBoYXNDb2x1bW4gPSB0aGlzLmNoYW5uZWxIYXNGaWVsZChDT0xVTU4pO1xuICAgIGNvbnN0IGxheW91dFNpemVFbmNvZGVFbnRyeSA9IGNoaWxkLmFzc2VtYmxlTGF5b3V0U2l6ZSgpO1xuXG4gICAgY29uc3QgYWdncmVnYXRlTWl4aW5zOiBhbnkgPSB7fTtcbiAgICBpZiAoaGFzUm93ICYmIGhhc0NvbHVtbikge1xuICAgICAgYWdncmVnYXRlTWl4aW5zLmFnZ3JlZ2F0ZSA9IHtjcm9zczogdHJ1ZX07XG4gICAgfVxuICAgIGNvbnN0IGNhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGQgPSB0aGlzLmdldENhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGQoKTtcbiAgICBpZiAoY2FyZGluYWxpdHlBZ2dyZWdhdGVGb3JDaGlsZCkge1xuICAgICAgYWdncmVnYXRlTWl4aW5zLmFnZ3JlZ2F0ZSA9IHtcbiAgICAgICAgLi4uYWdncmVnYXRlTWl4aW5zLmFnZ3JlZ2F0ZSxcbiAgICAgICAgLi4uY2FyZGluYWxpdHlBZ2dyZWdhdGVGb3JDaGlsZFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCB0aXRsZSA9IGNoaWxkLmFzc2VtYmxlVGl0bGUoKTtcbiAgICBjb25zdCBzdHlsZSA9IGNoaWxkLmFzc2VtYmxlR3JvdXBTdHlsZSgpO1xuXG4gICAgY29uc3QgbWFya0dyb3VwID0ge1xuICAgICAgbmFtZTogdGhpcy5nZXROYW1lKCdjZWxsJyksXG4gICAgICB0eXBlOiAnZ3JvdXAnLFxuICAgICAgLi4uKHRpdGxlPyB7dGl0bGV9IDoge30pLFxuICAgICAgLi4uKHN0eWxlPyB7c3R5bGV9IDoge30pLFxuICAgICAgZnJvbToge1xuICAgICAgICBmYWNldDoge1xuICAgICAgICAgIG5hbWU6IGZhY2V0Um9vdC5uYW1lLFxuICAgICAgICAgIGRhdGE6IGZhY2V0Um9vdC5kYXRhLFxuICAgICAgICAgIGdyb3VwYnk6IFtdLmNvbmNhdChcbiAgICAgICAgICAgIGhhc1JvdyA/IFt0aGlzLnZnRmllbGQoUk9XKV0gOiBbXSxcbiAgICAgICAgICAgIGhhc0NvbHVtbiA/IFt0aGlzLnZnRmllbGQoQ09MVU1OKV0gOiBbXVxuICAgICAgICAgICksXG4gICAgICAgICAgLi4uYWdncmVnYXRlTWl4aW5zXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzb3J0OiB7XG4gICAgICAgIGZpZWxkOiBbXS5jb25jYXQoXG4gICAgICAgICAgaGFzUm93ID8gW3RoaXMudmdGaWVsZChST1csIHtleHByOiAnZGF0dW0nLH0pXSA6IFtdLFxuICAgICAgICAgIGhhc0NvbHVtbiA/IFt0aGlzLnZnRmllbGQoQ09MVU1OLCB7ZXhwcjogJ2RhdHVtJ30pXSA6IFtdXG4gICAgICAgICksXG4gICAgICAgIG9yZGVyOiBbXS5jb25jYXQoXG4gICAgICAgICAgaGFzUm93ID8gWyAoZmFjZXQucm93LnNvcnQpIHx8ICdhc2NlbmRpbmcnXSA6IFtdLFxuICAgICAgICAgIGhhc0NvbHVtbiA/IFsgKGZhY2V0LmNvbHVtbi5zb3J0KSB8fCAnYXNjZW5kaW5nJ10gOiBbXVxuICAgICAgICApXG4gICAgICB9LFxuICAgICAgLi4uKGRhdGEubGVuZ3RoID4gMCA/IHtkYXRhOiBkYXRhfSA6IHt9KSxcbiAgICAgIC4uLihsYXlvdXRTaXplRW5jb2RlRW50cnkgPyB7ZW5jb2RlOiB7dXBkYXRlOiBsYXlvdXRTaXplRW5jb2RlRW50cnl9fSA6IHt9KSxcbiAgICAgIC4uLmNoaWxkLmFzc2VtYmxlR3JvdXAoKVxuICAgIH07XG5cbiAgICByZXR1cm4gW21hcmtHcm91cF07XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0TWFwcGluZygpIHtcbiAgICByZXR1cm4gdGhpcy5mYWNldDtcbiAgfVxufVxuIl19
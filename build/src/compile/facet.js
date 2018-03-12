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
var assemble_1 = require("./axis/assemble");
var buildmodel_1 = require("./buildmodel");
var assemble_2 = require("./data/assemble");
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
                    var headerType = header_1.getHeaderType(axisComponent.get('orient'));
                    layoutHeader[headerType] = layoutHeader[headerType] ||
                        [this.makeHeaderComponent(headerChannel, false)];
                    var mainAxis = assemble_1.assembleAxis(axisComponent, 'main', this.config, { header: true });
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
        var data = assemble_2.assembleFacetData(facetRoot);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHNDQUE4RDtBQUU5RCx3Q0FBbUM7QUFFbkMsd0NBQWlGO0FBQ2pGLDRCQUE4QjtBQUM5QixrQ0FBMkM7QUFFM0MsZ0NBQWlDO0FBQ2pDLDhDQUFzRztBQUN0Ryw0Q0FBNkM7QUFDN0MsMkNBQXdDO0FBQ3hDLDRDQUFrRDtBQUNsRCxzQ0FBdUM7QUFDdkMsMENBQThFO0FBQzlFLDRDQUEyRDtBQUMzRCxpQ0FBOEM7QUFDOUMsdUNBQWlFO0FBQ2pFLHFDQUE0QztBQUM1Qyx5Q0FBa0U7QUFFbEU7SUFBZ0MsOEJBQWM7SUFRNUMsb0JBQVksSUFBeUIsRUFBRSxNQUFhLEVBQUUsZUFBdUIsRUFBRSxRQUF1QixFQUFFLE1BQWM7UUFBdEgsWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQVMzRDtRQWpCZSxVQUFJLEdBQVksT0FBTyxDQUFDO1FBV3RDLEtBQUksQ0FBQyxLQUFLLEdBQUcsdUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BHLEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0IsSUFBTSxLQUFLLEdBQXlCLGlDQUFzQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFakYsS0FBSSxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDOztJQUNyQyxDQUFDO0lBRU8sOEJBQVMsR0FB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QUFjLEdBeVU3QztBQXpVWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJ3ZlZ2EnO1xuaW1wb3J0IHtDaGFubmVsLCBDT0xVTU4sIFJPVywgU2NhbGVDaGFubmVsfSBmcm9tICcuLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHtyZWR1Y2V9IGZyb20gJy4uL2VuY29kaW5nJztcbmltcG9ydCB7RmFjZXRNYXBwaW5nfSBmcm9tICcuLi9mYWNldCc7XG5pbXBvcnQge0ZpZWxkRGVmLCBub3JtYWxpemUsIHRpdGxlIGFzIGZpZWxkRGVmVGl0bGUsIHZnRmllbGR9IGZyb20gJy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi9sb2cnO1xuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vc2NhbGUnO1xuaW1wb3J0IHtOb3JtYWxpemVkRmFjZXRTcGVjfSBmcm9tICcuLi9zcGVjJztcbmltcG9ydCB7Y29udGFpbnN9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBSb3dDb2wsIFZnQXhpcywgVmdEYXRhLCBWZ0xheW91dCwgVmdNYXJrR3JvdXAsIFZnU2lnbmFsfSBmcm9tICcuLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2Fzc2VtYmxlQXhpc30gZnJvbSAnLi9heGlzL2Fzc2VtYmxlJztcbmltcG9ydCB7YnVpbGRNb2RlbH0gZnJvbSAnLi9idWlsZG1vZGVsJztcbmltcG9ydCB7YXNzZW1ibGVGYWNldERhdGF9IGZyb20gJy4vZGF0YS9hc3NlbWJsZSc7XG5pbXBvcnQge3BhcnNlRGF0YX0gZnJvbSAnLi9kYXRhL3BhcnNlJztcbmltcG9ydCB7Z2V0SGVhZGVyVHlwZSwgSGVhZGVyQ2hhbm5lbCwgSGVhZGVyQ29tcG9uZW50fSBmcm9tICcuL2xheW91dC9oZWFkZXInO1xuaW1wb3J0IHtwYXJzZUNoaWxkcmVuTGF5b3V0U2l6ZX0gZnJvbSAnLi9sYXlvdXRzaXplL3BhcnNlJztcbmltcG9ydCB7TW9kZWwsIE1vZGVsV2l0aEZpZWxkfSBmcm9tICcuL21vZGVsJztcbmltcG9ydCB7UmVwZWF0ZXJWYWx1ZSwgcmVwbGFjZVJlcGVhdGVySW5GYWNldH0gZnJvbSAnLi9yZXBlYXRlcic7XG5pbXBvcnQge3BhcnNlR3VpZGVSZXNvbHZlfSBmcm9tICcuL3Jlc29sdmUnO1xuaW1wb3J0IHthc3NlbWJsZURvbWFpbiwgZ2V0RmllbGRGcm9tRG9tYWlufSBmcm9tICcuL3NjYWxlL2RvbWFpbic7XG5cbmV4cG9ydCBjbGFzcyBGYWNldE1vZGVsIGV4dGVuZHMgTW9kZWxXaXRoRmllbGQge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogJ2ZhY2V0JyA9ICdmYWNldCc7XG4gIHB1YmxpYyByZWFkb25seSBmYWNldDogRmFjZXRNYXBwaW5nPHN0cmluZz47XG5cbiAgcHVibGljIHJlYWRvbmx5IGNoaWxkOiBNb2RlbDtcblxuICBwdWJsaWMgcmVhZG9ubHkgY2hpbGRyZW46IE1vZGVsW107XG5cbiAgY29uc3RydWN0b3Ioc3BlYzogTm9ybWFsaXplZEZhY2V0U3BlYywgcGFyZW50OiBNb2RlbCwgcGFyZW50R2l2ZW5OYW1lOiBzdHJpbmcsIHJlcGVhdGVyOiBSZXBlYXRlclZhbHVlLCBjb25maWc6IENvbmZpZykge1xuICAgIHN1cGVyKHNwZWMsIHBhcmVudCwgcGFyZW50R2l2ZW5OYW1lLCBjb25maWcsIHNwZWMucmVzb2x2ZSk7XG5cblxuICAgIHRoaXMuY2hpbGQgPSBidWlsZE1vZGVsKHNwZWMuc3BlYywgdGhpcywgdGhpcy5nZXROYW1lKCdjaGlsZCcpLCB1bmRlZmluZWQsIHJlcGVhdGVyLCBjb25maWcsIGZhbHNlKTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW3RoaXMuY2hpbGRdO1xuXG4gICAgY29uc3QgZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+ID0gcmVwbGFjZVJlcGVhdGVySW5GYWNldChzcGVjLmZhY2V0LCByZXBlYXRlcik7XG5cbiAgICB0aGlzLmZhY2V0ID0gdGhpcy5pbml0RmFjZXQoZmFjZXQpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0RmFjZXQoZmFjZXQ6IEZhY2V0TWFwcGluZzxzdHJpbmc+KTogRmFjZXRNYXBwaW5nPHN0cmluZz4ge1xuICAgIC8vIGNsb25lIHRvIHByZXZlbnQgc2lkZSBlZmZlY3QgdG8gdGhlIG9yaWdpbmFsIHNwZWNcbiAgICByZXR1cm4gcmVkdWNlKGZhY2V0LCBmdW5jdGlvbihub3JtYWxpemVkRmFjZXQsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBjaGFubmVsOiBDaGFubmVsKSB7XG4gICAgICBpZiAoIWNvbnRhaW5zKFtST1csIENPTFVNTl0sIGNoYW5uZWwpKSB7XG4gICAgICAgIC8vIERyb3AgdW5zdXBwb3J0ZWQgY2hhbm5lbFxuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbmNvbXBhdGlibGVDaGFubmVsKGNoYW5uZWwsICdmYWNldCcpKTtcbiAgICAgICAgcmV0dXJuIG5vcm1hbGl6ZWRGYWNldDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZpZWxkRGVmLmZpZWxkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZW1wdHlGaWVsZERlZihmaWVsZERlZiwgY2hhbm5lbCkpO1xuICAgICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgICAgfVxuXG4gICAgICAvLyBDb252ZXJ0IHR5cGUgdG8gZnVsbCwgbG93ZXJjYXNlIHR5cGUsIG9yIGF1Z21lbnQgdGhlIGZpZWxkRGVmIHdpdGggYSBkZWZhdWx0IHR5cGUgaWYgbWlzc2luZy5cbiAgICAgIG5vcm1hbGl6ZWRGYWNldFtjaGFubmVsXSA9IG5vcm1hbGl6ZShmaWVsZERlZiwgY2hhbm5lbCk7XG4gICAgICByZXR1cm4gbm9ybWFsaXplZEZhY2V0O1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBjaGFubmVsSGFzRmllbGQoY2hhbm5lbDogQ2hhbm5lbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZmFjZXRbY2hhbm5lbF07XG4gIH1cblxuICBwdWJsaWMgZmllbGREZWYoY2hhbm5lbDogQ2hhbm5lbCk6IEZpZWxkRGVmPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmZhY2V0W2NoYW5uZWxdO1xuICB9XG5cbiAgcHVibGljIHBhcnNlRGF0YSgpIHtcbiAgICB0aGlzLmNvbXBvbmVudC5kYXRhID0gcGFyc2VEYXRhKHRoaXMpO1xuICAgIHRoaXMuY2hpbGQucGFyc2VEYXRhKCk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VMYXlvdXRTaXplKCkge1xuICAgIHBhcnNlQ2hpbGRyZW5MYXlvdXRTaXplKHRoaXMpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlU2VsZWN0aW9uKCkge1xuICAgIC8vIEFzIGEgZmFjZXQgaGFzIGEgc2luZ2xlIGNoaWxkLCB0aGUgc2VsZWN0aW9uIGNvbXBvbmVudHMgYXJlIHRoZSBzYW1lLlxuICAgIC8vIFRoZSBjaGlsZCBtYWludGFpbnMgaXRzIHNlbGVjdGlvbnMgdG8gYXNzZW1ibGUgc2lnbmFscywgd2hpY2ggcmVtYWluXG4gICAgLy8gd2l0aGluIGl0cyB1bml0LlxuICAgIHRoaXMuY2hpbGQucGFyc2VTZWxlY3Rpb24oKTtcbiAgICB0aGlzLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB0aGlzLmNoaWxkLmNvbXBvbmVudC5zZWxlY3Rpb247XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNYXJrR3JvdXAoKSB7XG4gICAgdGhpcy5jaGlsZC5wYXJzZU1hcmtHcm91cCgpO1xuICB9XG5cbiAgcHVibGljIHBhcnNlQXhpc0FuZEhlYWRlcigpIHtcbiAgICB0aGlzLmNoaWxkLnBhcnNlQXhpc0FuZEhlYWRlcigpO1xuXG4gICAgdGhpcy5wYXJzZUhlYWRlcignY29sdW1uJyk7XG4gICAgdGhpcy5wYXJzZUhlYWRlcigncm93Jyk7XG5cbiAgICB0aGlzLm1lcmdlQ2hpbGRBeGlzKCd4Jyk7XG4gICAgdGhpcy5tZXJnZUNoaWxkQXhpcygneScpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUhlYWRlcihjaGFubmVsOiBIZWFkZXJDaGFubmVsKSB7XG5cbiAgICBpZiAodGhpcy5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkpIHtcbiAgICAgIGNvbnN0IGZpZWxkRGVmID0gdGhpcy5mYWNldFtjaGFubmVsXTtcbiAgICAgIGNvbnN0IGhlYWRlciA9IGZpZWxkRGVmLmhlYWRlciB8fCB7fTtcbiAgICAgIGxldCB0aXRsZSA9IGhlYWRlci50aXRsZSAhPT0gdW5kZWZpbmVkID8gaGVhZGVyLnRpdGxlIDogZmllbGREZWZUaXRsZShmaWVsZERlZiwgdGhpcy5jb25maWcpO1xuXG4gICAgICBpZiAodGhpcy5jaGlsZC5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXS50aXRsZSkge1xuICAgICAgICAvLyBtZXJnZSB0aXRsZSB3aXRoIGNoaWxkIHRvIHByb2R1Y2UgXCJUaXRsZSAvIFN1YnRpdGxlIC8gU3ViLXN1YnRpdGxlXCJcbiAgICAgICAgdGl0bGUgKz0gJyAvICcgKyB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlO1xuICAgICAgICB0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRIZWFkZXJzW2NoYW5uZWxdLnRpdGxlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXSA9IHtcbiAgICAgICAgdGl0bGUsXG4gICAgICAgIGZhY2V0RmllbGREZWY6IGZpZWxkRGVmLFxuICAgICAgICAvLyBUT0RPOiBzdXBwb3J0IGFkZGluZyBsYWJlbCB0byBmb290ZXIgYXMgd2VsbFxuICAgICAgICBoZWFkZXI6IFt0aGlzLm1ha2VIZWFkZXJDb21wb25lbnQoY2hhbm5lbCwgdHJ1ZSldXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbWFrZUhlYWRlckNvbXBvbmVudChjaGFubmVsOiBIZWFkZXJDaGFubmVsLCBsYWJlbHM6IGJvb2xlYW4pOiBIZWFkZXJDb21wb25lbnQge1xuICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWxzLFxuICAgICAgc2l6ZVNpZ25hbDogdGhpcy5jaGlsZC5jb21wb25lbnQubGF5b3V0U2l6ZS5nZXQoc2l6ZVR5cGUpID8gdGhpcy5jaGlsZC5nZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlKSA6IHVuZGVmaW5lZCxcbiAgICAgIGF4ZXM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbWVyZ2VDaGlsZEF4aXMoY2hhbm5lbDogJ3gnIHwgJ3knKSB7XG4gICAgY29uc3Qge2NoaWxkfSA9IHRoaXM7XG4gICAgaWYgKGNoaWxkLmNvbXBvbmVudC5heGVzW2NoYW5uZWxdKSB7XG4gICAgICBjb25zdCB7bGF5b3V0SGVhZGVycywgcmVzb2x2ZX0gPSB0aGlzLmNvbXBvbmVudDtcbiAgICAgIHJlc29sdmUuYXhpc1tjaGFubmVsXSA9IHBhcnNlR3VpZGVSZXNvbHZlKHJlc29sdmUsIGNoYW5uZWwpO1xuXG4gICAgICBpZiAocmVzb2x2ZS5heGlzW2NoYW5uZWxdID09PSAnc2hhcmVkJykge1xuICAgICAgICAvLyBGb3Igc2hhcmVkIGF4aXMsIG1vdmUgdGhlIGF4ZXMgdG8gZmFjZXQncyBoZWFkZXIgb3IgZm9vdGVyXG4gICAgICAgIGNvbnN0IGhlYWRlckNoYW5uZWwgPSBjaGFubmVsID09PSAneCcgPyAnY29sdW1uJyA6ICdyb3cnO1xuXG4gICAgICAgIGNvbnN0IGxheW91dEhlYWRlciA9IGxheW91dEhlYWRlcnNbaGVhZGVyQ2hhbm5lbF07XG4gICAgICAgIGZvciAoY29uc3QgYXhpc0NvbXBvbmVudCBvZiBjaGlsZC5jb21wb25lbnQuYXhlc1tjaGFubmVsXSkge1xuICAgICAgICAgIGNvbnN0IGhlYWRlclR5cGUgPSBnZXRIZWFkZXJUeXBlKGF4aXNDb21wb25lbnQuZ2V0KCdvcmllbnQnKSk7XG4gICAgICAgICAgbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdID0gbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdIHx8XG4gICAgICAgICAgW3RoaXMubWFrZUhlYWRlckNvbXBvbmVudChoZWFkZXJDaGFubmVsLCBmYWxzZSldO1xuXG4gICAgICAgICAgY29uc3QgbWFpbkF4aXMgPSBhc3NlbWJsZUF4aXMoYXhpc0NvbXBvbmVudCwgJ21haW4nLCB0aGlzLmNvbmZpZywge2hlYWRlcjogdHJ1ZX0pO1xuICAgICAgICAgIC8vIExheW91dEhlYWRlciBubyBsb25nZXIga2VlcCB0cmFjayBvZiBwcm9wZXJ0eSBwcmVjZWRlbmNlLCB0aHVzIGxldCdzIGNvbWJpbmUuXG4gICAgICAgICAgbGF5b3V0SGVhZGVyW2hlYWRlclR5cGVdWzBdLmF4ZXMucHVzaChtYWluQXhpcyk7XG4gICAgICAgICAgYXhpc0NvbXBvbmVudC5tYWluRXh0cmFjdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGRvIG5vdGhpbmcgZm9yIGluZGVwZW5kZW50IGF4ZXNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25Ub3BMZXZlbFNpZ25hbHMoc2lnbmFsczogYW55W10pOiBWZ1NpZ25hbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZC5hc3NlbWJsZVNlbGVjdGlvblRvcExldmVsU2lnbmFscyhzaWduYWxzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgdGhpcy5jaGlsZC5hc3NlbWJsZVNlbGVjdGlvblNpZ25hbHMoKTtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGVTZWxlY3Rpb25EYXRhKGRhdGE6IFZnRGF0YVtdKTogVmdEYXRhW10ge1xuICAgIHJldHVybiB0aGlzLmNoaWxkLmFzc2VtYmxlU2VsZWN0aW9uRGF0YShkYXRhKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0TGF5b3V0QmFuZE1peGlucyhoZWFkZXJUeXBlOiAnaGVhZGVyJyB8ICdmb290ZXInKToge1xuICAgIGhlYWRlckJhbmQ/OiBSb3dDb2w8bnVtYmVyPixcbiAgICBmb290ZXJCYW5kPzogUm93Q29sPG51bWJlcj5cbiAgfSB7XG4gICAgY29uc3QgYmFuZE1peGlucyA9IHt9O1xuXG4gICAgY29uc3QgYmFuZFR5cGUgPSBoZWFkZXJUeXBlID09PSAnaGVhZGVyJyA/ICdoZWFkZXJCYW5kJyA6ICdmb290ZXJCYW5kJztcblxuICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3JvdycsICdjb2x1bW4nXSBhcyAoJ3JvdycgfCAnY29sdW1uJylbXSkge1xuICAgICAgY29uc3QgbGF5b3V0SGVhZGVyQ29tcG9uZW50ID0gdGhpcy5jb21wb25lbnQubGF5b3V0SGVhZGVyc1tjaGFubmVsXTtcbiAgICAgIGNvbnN0IGhlYWRlckNvbXBvbmVudCA9IGxheW91dEhlYWRlckNvbXBvbmVudFtoZWFkZXJUeXBlXTtcbiAgICAgIGlmIChoZWFkZXJDb21wb25lbnQgJiYgaGVhZGVyQ29tcG9uZW50WzBdKSB7XG4gICAgICAgIGNvbnN0IHNpemVUeXBlID0gY2hhbm5lbCA9PT0gJ3JvdycgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICAgICAgaWYgKCF0aGlzLmNoaWxkLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldChzaXplVHlwZSkpIHtcbiAgICAgICAgICAvLyBJZiBmYWNldCBjaGlsZCBkb2VzIG5vdCBoYXZlIHNpemUgc2lnbmFsLCB0aGVuIGFwcGx5IGhlYWRlckJhbmRcbiAgICAgICAgICBiYW5kTWl4aW5zW2JhbmRUeXBlXSA9IGJhbmRNaXhpbnNbYmFuZFR5cGVdIHx8IHt9O1xuICAgICAgICAgIGJhbmRNaXhpbnNbYmFuZFR5cGVdW2NoYW5uZWxdID0gMC41O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiYW5kTWl4aW5zO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlTGF5b3V0KCk6IFZnTGF5b3V0IHtcbiAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5jaGFubmVsSGFzRmllbGQoJ2NvbHVtbicpID8gdGhpcy5jb2x1bW5EaXN0aW5jdFNpZ25hbCgpIDogMTtcblxuICAgIC8vIFRPRE86IGRldGVybWluZSBkZWZhdWx0IGFsaWduIGJhc2VkIG9uIHNoYXJlZCAvIGluZGVwZW5kZW50IHNjYWxlc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhZGRpbmc6IHtyb3c6IDEwLCBjb2x1bW46IDEwfSxcbiAgICAgIC4uLnRoaXMuZ2V0TGF5b3V0QmFuZE1peGlucygnaGVhZGVyJyksXG4gICAgICAuLi50aGlzLmdldExheW91dEJhbmRNaXhpbnMoJ2Zvb3RlcicpLFxuXG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IG9mZnNldCBmb3Igcm93SGVhZGVyL3Jvd0Zvb3Rlci9yb3dUaXRsZS9jb2x1bW5IZWFkZXIvY29sdW1uRm9vdGVyL2NvbHVtblRpdGxlXG4gICAgICBvZmZzZXQ6IDEwLFxuICAgICAgY29sdW1ucyxcbiAgICAgIGJvdW5kczogJ2Z1bGwnLFxuICAgICAgYWxpZ246ICdhbGwnXG4gICAgfTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUxheW91dFNpZ25hbHMoKTogVmdTaWduYWxbXSB7XG4gICAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8xMTkzKTogdGhpcyBjYW4gYmUgaW5jb3JyZWN0IGlmIHdlIGhhdmUgaW5kZXBlbmRlbnQgc2NhbGVzLlxuICAgIHJldHVybiB0aGlzLmNoaWxkLmFzc2VtYmxlTGF5b3V0U2lnbmFscygpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2x1bW5EaXN0aW5jdFNpZ25hbCgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgRmFjZXRNb2RlbCkpIHtcbiAgICAgIC8vIEZvciBuZXN0ZWQgZmFjZXQsIHdlIHdpbGwgYWRkIGNvbHVtbnMgdG8gZ3JvdXAgbWFyayBpbnN0ZWFkXG4gICAgICAvLyBTZWUgZGlzY3Vzc2lvbiBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhL2lzc3Vlcy85NTJcbiAgICAgIC8vIGFuZCBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLXZpZXcvcmVsZWFzZXMvdGFnL3YxLjIuNlxuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gZmFjZXROb2RlLmFzc2VtYmxlKCksIHRoZSBuYW1lIGlzIGFsd2F5cyB0aGlzLmdldE5hbWUoJ2NvbHVtbicpICsgJ19sYXlvdXQnLlxuICAgICAgY29uc3QgZmFjZXRMYXlvdXREYXRhTmFtZSA9IHRoaXMuZ2V0TmFtZSgnY29sdW1uX2RvbWFpbicpO1xuICAgICAgcmV0dXJuIHtzaWduYWw6IGBsZW5ndGgoZGF0YSgnJHtmYWNldExheW91dERhdGFOYW1lfScpKWB9O1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZUdyb3VwKHNpZ25hbHM6IFZnU2lnbmFsW10pIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgKHRoaXMucGFyZW50IGluc3RhbmNlb2YgRmFjZXRNb2RlbCkpIHtcbiAgICAgIC8vIFByb3ZpZGUgbnVtYmVyIG9mIGNvbHVtbnMgZm9yIGxheW91dC5cbiAgICAgIC8vIFNlZSBkaXNjdXNzaW9uIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EvaXNzdWVzLzk1MlxuICAgICAgLy8gYW5kIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2Etdmlldy9yZWxlYXNlcy90YWcvdjEuMi42XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi4odGhpcy5jaGFubmVsSGFzRmllbGQoJ2NvbHVtbicpID8ge1xuICAgICAgICAgIGVuY29kZToge1xuICAgICAgICAgICAgdXBkYXRlOiB7XG4gICAgICAgICAgICAgIC8vIFRPRE8oaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yNzU5KTpcbiAgICAgICAgICAgICAgLy8gQ29ycmVjdCB0aGUgc2lnbmFsIGZvciBmYWNldCBvZiBjb25jYXQgb2YgZmFjZXRfY29sdW1uXG4gICAgICAgICAgICAgIGNvbHVtbnM6IHtmaWVsZDogdmdGaWVsZCh0aGlzLmZhY2V0LmNvbHVtbiwge3ByZWZpeDogJ2Rpc3RpbmN0J30pfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSA6IHt9KSxcbiAgICAgICAgLi4uc3VwZXIuYXNzZW1ibGVHcm91cChzaWduYWxzKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmFzc2VtYmxlR3JvdXAoc2lnbmFscyk7XG4gIH1cblxuICAvKipcbiAgICogQWdncmVnYXRlIGNhcmRpbmFsaXR5IGZvciBjYWxjdWxhdGluZyBzaXplXG4gICAqL1xuICBwcml2YXRlIGdldENhcmRpbmFsaXR5QWdncmVnYXRlRm9yQ2hpbGQoKSB7XG4gICAgY29uc3QgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IG9wczogQWdncmVnYXRlT3BbXSA9IFtdO1xuICAgIGlmICh0aGlzLmNoaWxkIGluc3RhbmNlb2YgRmFjZXRNb2RlbCkge1xuICAgICAgaWYgKHRoaXMuY2hpbGQuY2hhbm5lbEhhc0ZpZWxkKCdjb2x1bW4nKSkge1xuICAgICAgICBmaWVsZHMucHVzaCh2Z0ZpZWxkKHRoaXMuY2hpbGQuZmFjZXQuY29sdW1uKSk7XG4gICAgICAgIG9wcy5wdXNoKCdkaXN0aW5jdCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knXSBhcyBTY2FsZUNoYW5uZWxbXSkge1xuICAgICAgICBjb25zdCBjaGlsZFNjYWxlQ29tcG9uZW50ID0gdGhpcy5jaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgICBpZiAoY2hpbGRTY2FsZUNvbXBvbmVudCAmJiAhY2hpbGRTY2FsZUNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICAgICAgICBjb25zdCB0eXBlID0gY2hpbGRTY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgICAgICAgICBjb25zdCByYW5nZSA9IGNoaWxkU2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAgICAgICBjb25zdCBkb21haW4gPSBhc3NlbWJsZURvbWFpbih0aGlzLmNoaWxkLCBjaGFubmVsKTtcbiAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbik7XG4gICAgICAgICAgICBpZiAoZmllbGQpIHtcbiAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgICBvcHMucHVzaCgnZGlzdGluY3QnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGxvZy53YXJuKCdVbmtub3duIGZpZWxkIGZvciAke2NoYW5uZWx9LiAgQ2Fubm90IGNhbGN1bGF0ZSB2aWV3IHNpemUuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHMubGVuZ3RoID8ge2ZpZWxkcywgb3BzfSA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZU1hcmtzKCk6IFZnTWFya0dyb3VwW10ge1xuICAgIGNvbnN0IHtjaGlsZCwgZmFjZXR9ID0gdGhpcztcbiAgICBjb25zdCBmYWNldFJvb3QgPSB0aGlzLmNvbXBvbmVudC5kYXRhLmZhY2V0Um9vdDtcbiAgICBjb25zdCBkYXRhID0gYXNzZW1ibGVGYWNldERhdGEoZmFjZXRSb290KTtcblxuICAgIC8vIElmIHdlIGZhY2V0IGJ5IHR3byBkaW1lbnNpb25zLCB3ZSBuZWVkIHRvIGFkZCBhIGNyb3NzIG9wZXJhdG9yIHRvIHRoZSBhZ2dyZWdhdGlvblxuICAgIC8vIHNvIHRoYXQgd2UgY3JlYXRlIGFsbCBncm91cHNcbiAgICBjb25zdCBoYXNSb3cgPSB0aGlzLmNoYW5uZWxIYXNGaWVsZChST1cpO1xuICAgIGNvbnN0IGhhc0NvbHVtbiA9IHRoaXMuY2hhbm5lbEhhc0ZpZWxkKENPTFVNTik7XG4gICAgY29uc3QgbGF5b3V0U2l6ZUVuY29kZUVudHJ5ID0gY2hpbGQuYXNzZW1ibGVMYXlvdXRTaXplKCk7XG5cbiAgICBjb25zdCBhZ2dyZWdhdGVNaXhpbnM6IGFueSA9IHt9O1xuICAgIGlmIChoYXNSb3cgJiYgaGFzQ29sdW1uKSB7XG4gICAgICBhZ2dyZWdhdGVNaXhpbnMuYWdncmVnYXRlID0ge2Nyb3NzOiB0cnVlfTtcbiAgICB9XG4gICAgY29uc3QgY2FyZGluYWxpdHlBZ2dyZWdhdGVGb3JDaGlsZCA9IHRoaXMuZ2V0Q2FyZGluYWxpdHlBZ2dyZWdhdGVGb3JDaGlsZCgpO1xuICAgIGlmIChjYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkKSB7XG4gICAgICBhZ2dyZWdhdGVNaXhpbnMuYWdncmVnYXRlID0ge1xuICAgICAgICAuLi5hZ2dyZWdhdGVNaXhpbnMuYWdncmVnYXRlLFxuICAgICAgICAuLi5jYXJkaW5hbGl0eUFnZ3JlZ2F0ZUZvckNoaWxkXG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IHRpdGxlID0gY2hpbGQuYXNzZW1ibGVUaXRsZSgpO1xuICAgIGNvbnN0IHN0eWxlID0gY2hpbGQuYXNzZW1ibGVHcm91cFN0eWxlKCk7XG5cbiAgICBjb25zdCBtYXJrR3JvdXAgPSB7XG4gICAgICBuYW1lOiB0aGlzLmdldE5hbWUoJ2NlbGwnKSxcbiAgICAgIHR5cGU6ICdncm91cCcsXG4gICAgICAuLi4odGl0bGU/IHt0aXRsZX0gOiB7fSksXG4gICAgICAuLi4oc3R5bGU/IHtzdHlsZX0gOiB7fSksXG4gICAgICBmcm9tOiB7XG4gICAgICAgIGZhY2V0OiB7XG4gICAgICAgICAgbmFtZTogZmFjZXRSb290Lm5hbWUsXG4gICAgICAgICAgZGF0YTogZmFjZXRSb290LmRhdGEsXG4gICAgICAgICAgZ3JvdXBieTogW10uY29uY2F0KFxuICAgICAgICAgICAgaGFzUm93ID8gW3RoaXMudmdGaWVsZChST1cpXSA6IFtdLFxuICAgICAgICAgICAgaGFzQ29sdW1uID8gW3RoaXMudmdGaWVsZChDT0xVTU4pXSA6IFtdXG4gICAgICAgICAgKSxcbiAgICAgICAgICAuLi5hZ2dyZWdhdGVNaXhpbnNcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgZmllbGQ6IFtdLmNvbmNhdChcbiAgICAgICAgICBoYXNSb3cgPyBbdGhpcy52Z0ZpZWxkKFJPVywge2V4cHI6ICdkYXR1bScsfSldIDogW10sXG4gICAgICAgICAgaGFzQ29sdW1uID8gW3RoaXMudmdGaWVsZChDT0xVTU4sIHtleHByOiAnZGF0dW0nfSldIDogW11cbiAgICAgICAgKSxcbiAgICAgICAgb3JkZXI6IFtdLmNvbmNhdChcbiAgICAgICAgICBoYXNSb3cgPyBbIChmYWNldC5yb3cuc29ydCkgfHwgJ2FzY2VuZGluZyddIDogW10sXG4gICAgICAgICAgaGFzQ29sdW1uID8gWyAoZmFjZXQuY29sdW1uLnNvcnQpIHx8ICdhc2NlbmRpbmcnXSA6IFtdXG4gICAgICAgIClcbiAgICAgIH0sXG4gICAgICAuLi4oZGF0YS5sZW5ndGggPiAwID8ge2RhdGE6IGRhdGF9IDoge30pLFxuICAgICAgLi4uKGxheW91dFNpemVFbmNvZGVFbnRyeSA/IHtlbmNvZGU6IHt1cGRhdGU6IGxheW91dFNpemVFbmNvZGVFbnRyeX19IDoge30pLFxuICAgICAgLi4uY2hpbGQuYXNzZW1ibGVHcm91cCgpXG4gICAgfTtcblxuICAgIHJldHVybiBbbWFya0dyb3VwXTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRNYXBwaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmZhY2V0O1xuICB9XG59XG4iXX0=
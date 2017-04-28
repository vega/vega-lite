"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../channel");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var log = require("../log");
var mark_1 = require("../mark");
var util_1 = require("../util");
var vega_schema_1 = require("../vega.schema");
var common_1 = require("./common");
var assemble_1 = require("./data/assemble");
var parse_1 = require("./data/parse");
var header_1 = require("./layout/header");
var model_1 = require("./model");
var repeat_1 = require("./repeat");
var FacetModel = (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName, repeater, config) {
        var _this = _super.call(this, spec, parent, parentGivenName, config) || this;
        _this.child = common_1.buildModel(spec.spec, _this, _this.getName('child'), repeater, config);
        _this.children = [_this.child];
        var facet = repeat_1.replaceRepeaterInFacet(spec.facet, repeater);
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
    FacetModel.prototype.hasDiscreteDomain = function (channel) {
        return true;
    };
    FacetModel.prototype.fieldDef = function (channel) {
        return this.facet[channel];
    };
    FacetModel.prototype.parseData = function () {
        this.component.data = parse_1.parseData(this);
        this.child.parseData();
    };
    FacetModel.prototype.parseSelection = function () {
        // As a facet has a single child, the selection components are the same.
        // The child maintains its selections to assemble signals, which remain
        // within its unit.
        this.child.parseSelection();
        this.component.selection = this.child.component.selection;
    };
    FacetModel.prototype.parseScale = function () {
        var _this = this;
        var child = this.child;
        var model = this;
        child.parseScale();
        var scaleComponent = this.component.scales = {};
        // Then, move shared/union from its child spec.
        util_1.keys(child.component.scales).forEach(function (channel) {
            // TODO: correctly implement independent scale
            if (true) {
                var scale = scaleComponent[channel] = child.component.scales[channel];
                var scaleNameWithoutPrefix = scale.name.substr(child.getName('').length);
                var newName = model.scaleName(scaleNameWithoutPrefix, true);
                child.renameScale(scale.name, newName);
                scale.name = newName;
                // Replace the scale domain with data output from a cloned subtree after the facet.
                var domain = scale.domain;
                if (vega_schema_1.isDataRefDomain(domain) || vega_schema_1.isFieldRefUnionDomain(domain)) {
                    domain.data = assemble_1.FACET_SCALE_PREFIX + _this.getName(domain.data);
                }
                else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
                    domain.fields = domain.fields.map(function (f) {
                        return tslib_1.__assign({}, f, { data: assemble_1.FACET_SCALE_PREFIX + _this.getName(f.data) });
                    });
                }
                // Once put in parent, just remove the child's scale.
                delete child.component.scales[channel];
            }
        });
    };
    FacetModel.prototype.parseMark = function () {
        this.child.parseMark();
        this.component.mark = [{
                name: this.getName('cell'),
                type: 'group',
                from: {
                    facet: {
                        name: this.component.data.facetRoot.name,
                        data: this.component.data.facetRoot.data,
                        groupby: [].concat(this.channelHasField(channel_1.ROW) ? [this.field(channel_1.ROW)] : [], this.channelHasField(channel_1.COLUMN) ? [this.field(channel_1.COLUMN)] : [])
                    }
                },
                encode: {
                    update: getFacetGroupProperties(this)
                }
            }];
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
                fieldRef: common_1.formatSignalRef(fieldDef, header.format, 'parent', this.config, true),
                // TODO: support adding label to footer as well
                header: [this.makeHeaderComponent(channel, true)]
            };
        }
    };
    FacetModel.prototype.makeHeaderComponent = function (channel, labels) {
        var sizeChannel = channel === 'row' ? 'height' : 'width';
        return {
            labels: labels,
            sizeSignal: this.child.getSizeSignalRef(sizeChannel),
            axes: []
        };
    };
    FacetModel.prototype.mergeChildAxis = function (channel) {
        var child = this.child;
        if (child.component.axes[channel]) {
            // TODO: read these from the resolve syntax
            var scaleResolve = 'shared';
            var axisResolve = 'shared';
            if (scaleResolve === 'shared' && axisResolve === 'shared') {
                // For shared axis, move the axes to facet's header or footer
                var headerChannel = channel === 'x' ? 'column' : 'row';
                var layoutHeader = this.component.layoutHeaders[headerChannel];
                for (var _i = 0, _a = child.component.axes[channel].axes; _i < _a.length; _i++) {
                    var axis = _a[_i];
                    var headerType = header_1.getHeaderType(axis.orient);
                    layoutHeader[headerType] = layoutHeader[headerType] ||
                        [this.makeHeaderComponent(headerChannel, false)];
                    layoutHeader[headerType][0].axes.push(axis);
                }
                child.component.axes[channel].axes = [];
            }
            else {
                // Otherwise do nothing for independent axes
            }
        }
    };
    FacetModel.prototype.parseLegend = function () {
        this.child.parseLegend();
        // TODO: support legend for independent non-position scale across facets
        // TODO: support legend for field reference of parent data (e.g., for SPLOM)
        // For now, assuming that non-positional scales are always shared across facets
        // Thus, just move all legends from its child
        this.component.legends = this.child.component.legends;
        this.child.component.legends = {};
    };
    FacetModel.prototype.assembleData = function () {
        if (!this.parent) {
            // only assemble data in the root
            return assemble_1.assembleData(util_1.vals(this.component.data.sources));
        }
        return [];
    };
    FacetModel.prototype.assembleParentGroupProperties = function () {
        return null;
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
    FacetModel.prototype.assembleLayout = function () {
        var columns = this.channelHasField('column') ? {
            signal: this.columnDistinctSignal()
        } : 1;
        // TODO: determine default align based on shared / independent scales
        return {
            padding: { row: 10, column: 10 },
            // TODO: support offset for rowHeader/rowFooter/rowTitle/columnHeader/columnFooter/columnTitle
            offset: 10,
            columns: columns,
            bounds: 'full'
        };
    };
    FacetModel.prototype.assembleLayoutSignals = function () {
        // FIXME(https://github.com/vega/vega-lite/issues/1193): this can be incorrect if we have independent scales.
        return this.child.assembleLayoutSignals();
    };
    FacetModel.prototype.columnDistinctSignal = function () {
        // In facetNode.assemble(), the name is always this.getName('column') + '_layout'.
        var facetLayoutDataName = this.getName('column') + '_layout';
        var columnDistinct = this.field('column', { prefix: 'distinct' });
        return "data('" + facetLayoutDataName + "')[0]." + columnDistinct;
    };
    FacetModel.prototype.assembleMarks = function () {
        var facetRoot = this.component.data.facetRoot;
        var data = assemble_1.assembleFacetData(facetRoot);
        var mark = this.component.mark[0];
        // correct the name of the faceted data source
        mark.from.facet = tslib_1.__assign({}, mark.from.facet, { name: facetRoot.name, data: facetRoot.data });
        var marks = [tslib_1.__assign({}, (data.length > 0 ? { data: data } : {}), mark, this.child.assembleGroup())];
        return marks.map(this.correctDataNames);
    };
    FacetModel.prototype.channels = function () {
        return [channel_1.ROW, channel_1.COLUMN];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    return FacetModel;
}(model_1.ModelWithField));
exports.FacetModel = FacetModel;
function hasSubPlotWithXy(model) {
    return model.hasDescendantWithFieldOnChannel('x') ||
        model.hasDescendantWithFieldOnChannel('y');
}
exports.hasSubPlotWithXy = hasSubPlotWithXy;
function childSizeEncodeEntryMixins(model, sizeType) {
    return _a = {}, _a[sizeType] = model.child.getSizeSignalRef(sizeType), _a;
    var _a;
}
// FIXME(https://github.com/vega/vega-lite/issues/2041): revise this.
function getFacetGroupProperties(model) {
    var child = model.child;
    return tslib_1.__assign({}, childSizeEncodeEntryMixins(model, 'width'), childSizeEncodeEntryMixins(model, 'height'), (hasSubPlotWithXy(model) ? child.assembleParentGroupProperties() : {}), common_1.applyConfig({}, model.config.facet.cell, mark_1.FILL_STROKE_CONFIG.concat(['clip'])));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzQ0FBc0Q7QUFHdEQsd0NBQW1DO0FBRW5DLHdDQUF3RTtBQUN4RSw0QkFBOEI7QUFDOUIsZ0NBQTJDO0FBRzNDLGdDQUFvRTtBQUVwRSw4Q0FRd0I7QUFHeEIsbUNBQWtFO0FBQ2xFLDRDQUFvRjtBQUNwRixzQ0FBdUM7QUFDdkMsMENBQXFHO0FBRXJHLGlDQUE4QztBQUM5QyxtQ0FBK0Q7QUFJL0Q7SUFBZ0Msc0NBQWM7SUFPNUMsb0JBQVksSUFBZSxFQUFFLE1BQWEsRUFBRSxlQUF1QixFQUFFLFFBQXVCLEVBQUUsTUFBYztRQUE1RyxZQUNFLGtCQUFNLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxTQVE3QztRQU5DLEtBQUksQ0FBQyxLQUFLLEdBQUcsbUJBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUksRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRixLQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdCLElBQU0sS0FBSyxHQUFrQiwrQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTFFLEtBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFDckMsQ0FBQztJQUVPLDhCQUFTLEdBQWpCLFVBQWtCLEtBQW9CO1FBQ3BDLG9EQUFvRDtRQUNwRCxNQUFNLENBQUMsaUJBQU0sQ0FBQyxLQUFLLEVBQUUsVUFBUyxlQUFlLEVBQUUsUUFBMEIsRUFBRSxPQUFnQjtZQUN6RixFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFD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
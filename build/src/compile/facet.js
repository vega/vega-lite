"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = require("../log");
var axis_1 = require("../axis");
var channel_1 = require("../channel");
var config_1 = require("../config");
var encoding_1 = require("../encoding");
var fielddef_1 = require("../fielddef");
var util_1 = require("../util");
var parse_1 = require("./axis/parse");
var rules_1 = require("./axis/rules");
var common_1 = require("./common");
var data_1 = require("./data/data");
var layout_1 = require("./layout");
var model_1 = require("./model");
var init_1 = require("./scale/init");
var parse_2 = require("./scale/parse");
/**
 * Prefix for special data sources for driving column's axis group.
 */
exports.COLUMN_AXES_DATA_PREFIX = 'column-';
/**
 * Prefix for special data sources for driving row's axis group.
 */
exports.ROW_AXES_DATA_PREFIX = 'row-';
var FacetModel = (function (_super) {
    tslib_1.__extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName) {
        var _this = _super.call(this, spec, parent, parentGivenName) || this;
        _this.scales = {};
        _this.axes = {};
        _this.legends = {};
        _this.stack = null;
        _this._spacing = {};
        // Config must be initialized before child as it gets cascaded to the child
        var config = _this.config = _this.initConfig(spec.config, parent);
        var child = _this.child = common_1.buildModel(spec.spec, _this, _this.getName('child'));
        _this.children = [child];
        var facet = _this.facet = _this.initFacet(spec.facet);
        _this.scales = _this.initScalesAndSpacing(facet, config);
        _this.axes = _this.initAxis(facet, config, child);
        _this.legends = {};
        return _this;
    }
    FacetModel.prototype.initConfig = function (specConfig, parent) {
        return util_1.mergeDeep(util_1.duplicate(config_1.defaultConfig), parent ? parent.config : {}, specConfig);
    };
    FacetModel.prototype.initFacet = function (facet) {
        // clone to prevent side effect to the original spec
        facet = util_1.duplicate(facet);
        encoding_1.forEach(facet, function (fieldDef, channel) {
            if (!util_1.contains([channel_1.ROW, channel_1.COLUMN], channel)) {
                // Drop unsupported channel
                log.warn(log.message.incompatibleChannel(channel, 'facet'));
                delete facet[channel];
                return;
            }
            // TODO: array of row / column ?
            if (fieldDef.field === undefined) {
                log.warn(log.message.emptyFieldDef(fieldDef, channel));
                delete facet[channel];
                return;
            }
            // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
            fielddef_1.normalize(fieldDef, channel);
        });
        return facet;
    };
    FacetModel.prototype.initScalesAndSpacing = function (facet, config) {
        var model = this;
        return [channel_1.ROW, channel_1.COLUMN].reduce(function (_scale, channel) {
            if (facet[channel]) {
                _scale[channel] = init_1.default(channel, facet[channel], config, undefined, // Facet doesn't have one single mark
                undefined, // TODO(#1647): support width / height here
                [] // There is no xyRangeSteps here and there is no need to input
                );
                model._spacing[channel] = spacing(facet[channel].scale || {}, model, config);
            }
            return _scale;
        }, {});
    };
    FacetModel.prototype.initAxis = function (facet, config, child) {
        var model = this;
        return [channel_1.ROW, channel_1.COLUMN].reduce(function (_axis, channel) {
            if (facet[channel]) {
                var axisSpec = facet[channel].axis;
                if (axisSpec !== false) {
                    var vlOnlyAxisProperties_1 = {};
                    axis_1.VL_ONLY_AXIS_PROPERTIES.forEach(function (property) {
                        if (config.facet.axis[property] !== undefined) {
                            vlOnlyAxisProperties_1[property] = config.facet.axis[property];
                        }
                    });
                    var modelAxis = _axis[channel] = tslib_1.__assign({}, vlOnlyAxisProperties_1, axisSpec);
                    if (channel === channel_1.ROW) {
                        var yAxis = child.axis(channel_1.Y);
                        if (yAxis && yAxis.orient !== 'right' && !modelAxis.orient) {
                            modelAxis.orient = 'right';
                        }
                        if (model.hasDescendantWithFieldOnChannel(channel_1.X) && !modelAxis.labelAngle) {
                            modelAxis.labelAngle = modelAxis.orient === 'right' ? 90 : 270;
                        }
                    }
                }
            }
            return _axis;
        }, {});
    };
    FacetModel.prototype.channelHasField = function (channel) {
        return !!this.facet[channel];
    };
    FacetModel.prototype.hasSummary = function () {
        var summary = this.component.data.summary;
        for (var _i = 0, summary_1 = summary; _i < summary_1.length; _i++) {
            var s = summary_1[_i];
            if (util_1.keys(s.measures).length > 0) {
                return true;
            }
        }
        return false;
    };
    FacetModel.prototype.facetedTable = function () {
        // FIXME: revise if the suffix should be 'data'
        return 'faceted-' + this.getName('data');
    };
    FacetModel.prototype.dataTable = function () {
        // FIXME: shouldn't we apply data renaming here?
        if (this.component.data.stack) {
            return 'stacked';
        }
        if (this.hasSummary()) {
            return 'summary';
        }
        return 'source';
    };
    FacetModel.prototype.fieldDef = function (channel) {
        return this.facet[channel];
    };
    FacetModel.prototype.parseData = function () {
        this.child.parseData();
        this.component.data = data_1.parseFacetData(this);
    };
    FacetModel.prototype.parseSelection = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    FacetModel.prototype.parseLayoutData = function () {
        this.child.parseLayoutData();
        this.component.layout = layout_1.parseFacetLayout(this);
    };
    FacetModel.prototype.parseScale = function () {
        var child = this.child;
        var model = this;
        child.parseScale();
        // TODO: support scales for field reference of parent data (e.g., for SPLOM)
        // First, add scale for row and column.
        var scaleComponent = this.component.scales = parse_2.default(this);
        // Then, move shared/union from its child spec.
        util_1.keys(child.component.scales).forEach(function (channel) {
            // TODO: correctly implement independent scale
            if (true) {
                var scale = scaleComponent[channel] = child.component.scales[channel];
                var scaleNameWithoutPrefix = scale.name.substr(child.getName('').length);
                var newName = model.scaleName(scaleNameWithoutPrefix, true);
                child.renameScale(scale.name, newName);
                scale.name = newName;
                // Once put in parent, just remove the child's scale.
                delete child.component.scales[channel];
            }
        });
    };
    FacetModel.prototype.parseMark = function () {
        this.child.parseMark();
        this.component.mark = util_1.extend({
            name: this.getName('cell'),
            type: 'group',
            from: util_1.extend({
                facet: {
                    name: this.facetedTable(),
                    data: this.dataTable(),
                    groupby: [].concat(this.channelHasField(channel_1.ROW) ? [this.field(channel_1.ROW)] : [], this.channelHasField(channel_1.COLUMN) ? [this.field(channel_1.COLUMN)] : [])
                }
            }),
            encode: {
                update: getFacetGroupProperties(this)
            }
        }, 
        // FIXME: move this call to assembleMarks()
        // Call child's assembleGroup to add marks, scales, axes, and legends.
        // Note that we can call child's assembleGroup() here because parseMark()
        // is the last method in compile() and thus the child is completely compiled
        // at this point.
        this.child.assembleGroup());
    };
    FacetModel.prototype.parseAxis = function () {
        this.child.parseAxis();
        this.component.axes = parse_1.parseAxisComponent(this, [channel_1.ROW, channel_1.COLUMN]);
    };
    FacetModel.prototype.parseAxisGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child.parseAxisGroup();
        var xAxisGroup = parseAxisGroups(this, channel_1.X);
        var yAxisGroup = parseAxisGroups(this, channel_1.Y);
        this.component.axisGroups = util_1.extend(xAxisGroup ? { x: xAxisGroup } : {}, yAxisGroup ? { y: yAxisGroup } : {});
    };
    FacetModel.prototype.parseGridGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child.parseGridGroup();
        var child = this.child;
        this.component.gridGroups = util_1.extend(!child.channelHasField(channel_1.X) && this.channelHasField(channel_1.COLUMN) ? { column: getColumnGridGroups(this) } : {}, !child.channelHasField(channel_1.Y) && this.channelHasField(channel_1.ROW) ? { row: getRowGridGroups(this) } : {});
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
    FacetModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    FacetModel.prototype.assembleSignals = function (signals) {
        return [];
    };
    FacetModel.prototype.assembleSelectionData = function (data) {
        return [];
    };
    FacetModel.prototype.assembleData = function (data) {
        // Prefix traversal – parent data might be referred by children data
        data_1.assembleData(this, data);
        this.child.assembleData(data);
        assembleAxesGroupData(this, data);
        return data;
    };
    FacetModel.prototype.assembleLayout = function (layoutData) {
        // Postfix traversal – layout is assembled bottom-up
        this.child.assembleLayout(layoutData);
        return layout_1.assembleLayout(this, layoutData);
    };
    FacetModel.prototype.assembleMarks = function () {
        return [].concat(
        // axisGroup is a mapping to VgMarkGroup
        util_1.vals(this.component.axisGroups), util_1.flatten(util_1.vals(this.component.gridGroups)), this.component.mark);
    };
    FacetModel.prototype.channels = function () {
        return [channel_1.ROW, channel_1.COLUMN];
    };
    FacetModel.prototype.getMapping = function () {
        return this.facet;
    };
    FacetModel.prototype.spacing = function (channel) {
        return this._spacing[channel];
    };
    FacetModel.prototype.isFacet = function () {
        return true;
    };
    return FacetModel;
}(model_1.Model));
exports.FacetModel = FacetModel;
function hasSubPlotWithXy(model) {
    return model.hasDescendantWithFieldOnChannel('x') ||
        model.hasDescendantWithFieldOnChannel('y');
}
exports.hasSubPlotWithXy = hasSubPlotWithXy;
function spacing(scale, model, config) {
    if (scale.spacing !== undefined) {
        return scale.spacing;
    }
    if (!hasSubPlotWithXy(model)) {
        // If there is no subplot with x/y, it's a simple table so there should be no spacing.
        return 0;
    }
    return config.scale.facetSpacing;
}
exports.spacing = spacing;
function getFacetGroupProperties(model) {
    var child = model.child;
    var mergedCellConfig = util_1.extend({}, child.config.cell, child.config.facet.cell);
    return util_1.extend({
        x: model.channelHasField(channel_1.COLUMN) ? {
            scale: model.scaleName(channel_1.COLUMN),
            field: model.field(channel_1.COLUMN),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.COLUMN) / 2
        } : { value: model.config.scale.facetSpacing / 2 },
        y: model.channelHasField(channel_1.ROW) ? {
            scale: model.scaleName(channel_1.ROW),
            field: model.field(channel_1.ROW),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.ROW) / 2
        } : { value: model.config.scale.facetSpacing / 2 },
        width: { field: { parent: model.child.sizeName('width') } },
        height: { field: { parent: model.child.sizeName('height') } }
    }, hasSubPlotWithXy(model) ? child.assembleParentGroupProperties(mergedCellConfig) : {});
}
// TODO: move the rest of the file src/compile/facet/*.ts
/**
 * Add data for driving row/column axes when there are both row and column
 * Note that we don't have to deal with these in the parse step at all
 * because these items never get merged with any other items.
 */
function assembleAxesGroupData(model, data) {
    if (model.facet.column) {
        data.push({
            name: exports.COLUMN_AXES_DATA_PREFIX + model.dataTable(),
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.COLUMN)]
                }]
        });
    }
    if (model.facet.row) {
        data.push({
            name: exports.ROW_AXES_DATA_PREFIX + model.dataTable(),
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.ROW)]
                }]
        });
    }
    return data;
}
exports.assembleAxesGroupData = assembleAxesGroupData;
function parseAxisGroups(model, channel) {
    // TODO: add a case where inner spec is not a unit (facet/layer/concat)
    var axisGroup = null;
    var child = model.child;
    if (child.channelHasField(channel)) {
        if (child.axis(channel)) {
            if (true) {
                // add a group for the shared axes
                axisGroup = getSharedAxisGroup(model, channel);
                if (child.axis(channel) && rules_1.gridShow(child, channel)) {
                    // add inner axis (aka axis that shows only grid to )
                    child.component.axes[channel] = [parse_1.parseGridAxis(channel, child)];
                }
                else {
                    // Delete existing child axes
                    delete child.component.axes[channel];
                }
            }
            else {
                // TODO: implement independent axes support
            }
        }
    }
    return axisGroup;
}
function getSharedAxisGroup(model, channel) {
    var isX = channel === 'x';
    var facetChannel = isX ? 'column' : 'row';
    var hasFacet = !!model.facet[facetChannel];
    var dataPrefix = isX ? exports.COLUMN_AXES_DATA_PREFIX : exports.ROW_AXES_DATA_PREFIX;
    var axesGroup = {
        name: model.getName(channel + '-axes'),
        type: 'group'
    };
    if (hasFacet) {
        // Need to drive this with special data source that has one item for each column/row value.
        // TODO: We might only need to drive this with special data source if there are both row and column
        // However, it might be slightly difficult as we have to merge this with the main group.
        axesGroup.from = { data: dataPrefix + model.dataTable() };
    }
    if (isX) {
        axesGroup.encode = {
            update: {
                width: { field: { parent: model.child.sizeName('width') } },
                height: { field: { group: 'height' } },
                x: hasFacet ? {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN),
                    // offset by the spacing
                    offset: model.spacing(channel_1.COLUMN) / 2
                } : {
                    // TODO: support custom spacing here
                    // offset by the spacing
                    value: model.config.scale.facetSpacing / 2
                }
            }
        };
    }
    else {
        axesGroup.encode = {
            update: {
                width: { field: { group: 'width' } },
                height: { field: { parent: model.child.sizeName('height') } },
                y: hasFacet ? {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW),
                    // offset by the spacing
                    offset: model.spacing(channel_1.ROW) / 2
                } : {
                    // offset by the spacing
                    value: model.config.scale.facetSpacing / 2
                }
            }
        };
    }
    axesGroup.axes = [parse_1.parseMainAxis(channel, model.child)];
    return axesGroup;
}
exports.getSharedAxisGroup = getSharedAxisGroup;
function getRowGridGroups(model) {
    var facetGridConfig = model.config.facet.grid;
    var rowGrid = {
        name: model.getName('row-grid'),
        type: 'rule',
        from: {
            data: exports.ROW_AXES_DATA_PREFIX + model.dataTable()
        },
        encode: {
            update: {
                y: {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW)
                },
                x: { value: 0, offset: -facetGridConfig.offset },
                x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [rowGrid, {
            name: model.getName('row-grid-end'),
            type: 'rule',
            encode: {
                update: {
                    y: { field: { group: 'height' } },
                    x: { value: 0, offset: -facetGridConfig.offset },
                    x2: { field: { group: 'width' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
function getColumnGridGroups(model) {
    var facetGridConfig = model.config.facet.grid;
    var columnGrid = {
        name: model.getName('column-grid'),
        type: 'rule',
        from: {
            data: exports.COLUMN_AXES_DATA_PREFIX + model.dataTable()
        },
        encode: {
            update: {
                x: {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN)
                },
                y: { value: 0, offset: -facetGridConfig.offset },
                y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                stroke: { value: facetGridConfig.color },
                strokeOpacity: { value: facetGridConfig.opacity },
                strokeWidth: { value: 0.5 }
            }
        }
    };
    return [columnGrid, {
            name: model.getName('column-grid-end'),
            type: 'rule',
            encode: {
                update: {
                    x: { field: { group: 'width' } },
                    y: { value: 0, offset: -facetGridConfig.offset },
                    y2: { field: { group: 'height' }, offset: facetGridConfig.offset },
                    stroke: { value: facetGridConfig.color },
                    strokeOpacity: { value: facetGridConfig.opacity },
                    strokeWidth: { value: 0.5 }
                }
            }
        }];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tcGlsZS9mYWNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0QkFBOEI7QUFFOUIsZ0NBQXNFO0FBQ3RFLHNDQUFzRDtBQUN0RCxvQ0FBZ0Q7QUFFaEQsd0NBQW9DO0FBQ3BDLHdDQUFnRDtBQUloRCxnQ0FBMEY7QUFJMUYsc0NBQThFO0FBQzlFLHNDQUFzQztBQUN0QyxtQ0FBb0M7QUFDcEMsb0NBQXlEO0FBQ3pELG1DQUEwRDtBQUMxRCxpQ0FBOEI7QUFFOUIscUNBQXFDO0FBQ3JDLHVDQUFnRDtBQUVoRDs7R0FFRztBQUVVLFFBQUEsdUJBQXVCLEdBQUcsU0FBUyxDQUFDO0FBRWpEOztHQUVHO0FBQ1UsUUFBQSxvQkFBb0IsR0FBRyxNQUFNLENBQUM7QUFFM0M7SUFBZ0Msc0NBQUs7SUFxQm5DLG9CQUFZLElBQWUsRUFBRSxNQUFhLEVBQUUsZUFBdUI7UUFBbkUsWUFDRSxrQkFBTSxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQyxTQVlyQztRQTVCa0IsWUFBTSxHQUFnQixFQUFFLENBQUM7UUFFekIsVUFBSSxHQUFlLEVBQUUsQ0FBQztRQUV0QixhQUFPLEdBQWlCLEVBQUUsQ0FBQztRQUk5QixXQUFLLEdBQW9CLElBQUksQ0FBQztRQUU3QixjQUFRLEdBR3JCLEVBQUUsQ0FBQztRQUtMLDJFQUEyRTtRQUMzRSxJQUFNLE1BQU0sR0FBRyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVsRSxJQUFNLEtBQUssR0FBSSxLQUFJLENBQUMsS0FBSyxHQUFHLG1CQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQy9FLEtBQUksQ0FBQyxRQUFRLEdBQUcs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
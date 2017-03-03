"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var log = require("../log");
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
    __extends(FacetModel, _super);
    function FacetModel(spec, parent, parentGivenName) {
        var _this = _super.call(this, spec, parent, parentGivenName) || this;
        _this._spacing = {};
        // Config must be initialized before child as it gets cascaded to the child
        var config = _this._config = _this._initConfig(spec.config, parent);
        var child = _this._child = common_1.buildModel(spec.spec, _this, _this.name('child'));
        var facet = _this._facet = _this._initFacet(spec.facet);
        _this._scale = _this._initScaleAndSpacing(facet, config);
        _this._axis = _this._initAxis(facet, config, child);
        _this._legend = {};
        return _this;
    }
    FacetModel.prototype._initConfig = function (specConfig, parent) {
        return util_1.mergeDeep(util_1.duplicate(config_1.defaultConfig), parent ? parent.config() : {}, specConfig);
    };
    FacetModel.prototype._initFacet = function (facet) {
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
            // TODO: move this warning into normalize
            if (!fielddef_1.isDimension(fieldDef)) {
                log.warn(log.message.facetChannelShouldBeDiscrete(channel));
            }
        });
        return facet;
    };
    FacetModel.prototype._initScaleAndSpacing = function (facet, config) {
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
    FacetModel.prototype._initAxis = function (facet, config, child) {
        var model = this;
        return [channel_1.ROW, channel_1.COLUMN].reduce(function (_axis, channel) {
            if (facet[channel]) {
                var axisSpec = facet[channel].axis;
                if (axisSpec !== false) {
                    var modelAxis = _axis[channel] = util_1.extend({}, config.facet.axis, axisSpec === true ? {} : axisSpec || {});
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
    FacetModel.prototype.facet = function () {
        return this._facet;
    };
    FacetModel.prototype.channelHasField = function (channel) {
        return !!this._facet[channel];
    };
    FacetModel.prototype.child = function () {
        return this._child;
    };
    FacetModel.prototype.children = function () {
        return [this._child];
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
        return 'faceted-' + this.name('data');
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
        return this.facet()[channel];
    };
    FacetModel.prototype.stack = function () {
        return null; // this is only a property for UnitModel
    };
    FacetModel.prototype.parseData = function () {
        this.child().parseData();
        this.component.data = data_1.parseFacetData(this);
    };
    FacetModel.prototype.parseSelectionData = function () {
        // TODO: @arvind can write this
        // We might need to split this into compileSelectionData and compileSelectionSignals?
    };
    FacetModel.prototype.parseLayoutData = function () {
        this.child().parseLayoutData();
        this.component.layout = layout_1.parseFacetLayout(this);
    };
    FacetModel.prototype.parseScale = function () {
        var child = this.child();
        var model = this;
        child.parseScale();
        // TODO: support scales for field reference of parent data (e.g., for SPLOM)
        // First, add scale for row and column.
        var scaleComponent = this.component.scale = parse_2.default(this);
        // Then, move shared/union from its child spec.
        util_1.keys(child.component.scale).forEach(function (channel) {
            // TODO: correctly implement independent scale
            if (true) {
                scaleComponent[channel] = child.component.scale[channel];
                // for each scale, need to rename
                util_1.vals(scaleComponent[channel]).forEach(function (scale) {
                    var scaleNameWithoutPrefix = scale.name.substr(child.name('').length);
                    var newName = model.scaleName(scaleNameWithoutPrefix, true);
                    child.renameScale(scale.name, newName);
                    scale.name = newName;
                });
                // Once put in parent, just remove the child's scale.
                delete child.component.scale[channel];
            }
        });
    };
    FacetModel.prototype.parseMark = function () {
        this.child().parseMark();
        this.component.mark = util_1.extend({
            name: this.name('cell'),
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
        this.child().assembleGroup());
    };
    FacetModel.prototype.parseAxis = function () {
        this.child().parseAxis();
        this.component.axis = parse_1.parseAxisComponent(this, [channel_1.ROW, channel_1.COLUMN]);
    };
    FacetModel.prototype.parseAxisGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child().parseAxisGroup();
        var xAxisGroup = parseAxisGroups(this, channel_1.X);
        var yAxisGroup = parseAxisGroups(this, channel_1.Y);
        this.component.axisGroup = util_1.extend(xAxisGroup ? { x: xAxisGroup } : {}, yAxisGroup ? { y: yAxisGroup } : {});
    };
    FacetModel.prototype.parseGridGroup = function () {
        // TODO: with nesting, we might need to consider calling child
        // this.child().parseGridGroup();
        var child = this.child();
        this.component.gridGroup = util_1.extend(!child.channelHasField(channel_1.X) && this.channelHasField(channel_1.COLUMN) ? { column: getColumnGridGroups(this) } : {}, !child.channelHasField(channel_1.Y) && this.channelHasField(channel_1.ROW) ? { row: getRowGridGroups(this) } : {});
    };
    FacetModel.prototype.parseLegend = function () {
        this.child().parseLegend();
        // TODO: support legend for independent non-position scale across facets
        // TODO: support legend for field reference of parent data (e.g., for SPLOM)
        // For now, assuming that non-positional scales are always shared across facets
        // Thus, just move all legends from its child
        this.component.legend = this._child.component.legend;
        this._child.component.legend = {};
    };
    FacetModel.prototype.assembleParentGroupProperties = function () {
        return null;
    };
    FacetModel.prototype.assembleData = function (data) {
        // Prefix traversal – parent data might be referred by children data
        data_1.assembleData(this, data);
        this._child.assembleData(data);
        assembleAxesGroupData(this, data);
        return data;
    };
    FacetModel.prototype.assembleLayout = function (layoutData) {
        // Postfix traversal – layout is assembled bottom-up
        this._child.assembleLayout(layoutData);
        return layout_1.assembleLayout(this, layoutData);
    };
    FacetModel.prototype.assembleMarks = function () {
        return [].concat(
        // axisGroup is a mapping to VgMarkGroup
        util_1.vals(this.component.axisGroup), util_1.flatten(util_1.vals(this.component.gridGroup)), this.component.mark);
    };
    FacetModel.prototype.channels = function () {
        return [channel_1.ROW, channel_1.COLUMN];
    };
    FacetModel.prototype.mapping = function () {
        return this.facet();
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
    var child = model.child();
    var mergedCellConfig = util_1.extend({}, child.config().cell, child.config().facet.cell);
    return util_1.extend({
        x: model.channelHasField(channel_1.COLUMN) ? {
            scale: model.scaleName(channel_1.COLUMN),
            field: model.field(channel_1.COLUMN),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.COLUMN) / 2
        } : { value: model.config().scale.facetSpacing / 2 },
        y: model.channelHasField(channel_1.ROW) ? {
            scale: model.scaleName(channel_1.ROW),
            field: model.field(channel_1.ROW),
            // offset by the spacing / 2
            offset: model.spacing(channel_1.ROW) / 2
        } : { value: model.config().scale.facetSpacing / 2 },
        width: { field: { parent: model.child().sizeName('width') } },
        height: { field: { parent: model.child().sizeName('height') } }
    }, hasSubPlotWithXy(model) ? child.assembleParentGroupProperties(mergedCellConfig) : {});
}
// TODO: move the rest of the file src/compile/facet/*.ts
/**
 * Add data for driving row/column axes when there are both row and column
 * Note that we don't have to deal with these in the parse step at all
 * because these items never get merged with any other items.
 */
function assembleAxesGroupData(model, data) {
    if (model.facet().column) {
        data.push({
            name: exports.COLUMN_AXES_DATA_PREFIX + model.dataTable(),
            source: model.dataTable(),
            transform: [{
                    type: 'aggregate',
                    groupby: [model.field(channel_1.COLUMN)]
                }]
        });
    }
    if (model.facet().row) {
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
    var child = model.child();
    if (child.channelHasField(channel)) {
        if (child.axis(channel)) {
            if (true) {
                // add a group for the shared axes
                axisGroup = getSharedAxisGroup(model, channel);
                if (child.axis(channel) && rules_1.gridShow(child, channel)) {
                    // add inner axis (aka axis that shows only grid to )
                    child.component.axis[channel] = [parse_1.parseGridAxis(channel, child)];
                }
                else {
                    // Delete existing child axes
                    delete child.component.axis[channel];
                }
            }
            else {
            }
        }
    }
    return axisGroup;
}
function getSharedAxisGroup(model, channel) {
    var isX = channel === 'x';
    var facetChannel = isX ? 'column' : 'row';
    var hasFacet = !!model.facet()[facetChannel];
    var dataPrefix = isX ? exports.COLUMN_AXES_DATA_PREFIX : exports.ROW_AXES_DATA_PREFIX;
    var axesGroup = {
        name: model.name(channel + '-axes'),
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
                width: { field: { parent: model.child().sizeName('width') } },
                height: { field: { group: 'height' } },
                x: hasFacet ? {
                    scale: model.scaleName(channel_1.COLUMN),
                    field: model.field(channel_1.COLUMN),
                    // offset by the spacing
                    offset: model.spacing(channel_1.COLUMN) / 2
                } : {
                    // TODO: support custom spacing here
                    // offset by the spacing
                    value: model.config().scale.facetSpacing / 2
                }
            }
        };
    }
    else {
        axesGroup.encode = {
            update: {
                width: { field: { group: 'width' } },
                height: { field: { parent: model.child().sizeName('height') } },
                y: hasFacet ? {
                    scale: model.scaleName(channel_1.ROW),
                    field: model.field(channel_1.ROW),
                    // offset by the spacing
                    offset: model.spacing(channel_1.ROW) / 2
                } : {
                    // offset by the spacing
                    value: model.config().scale.facetSpacing / 2
                }
            }
        };
    }
    axesGroup.axes = [parse_1.parseMainAxis(channel, model.child())];
    return axesGroup;
}
exports.getSharedAxisGroup = getSharedAxisGroup;
function getRowGridGroups(model) {
    var facetGridConfig = model.config().facet.grid;
    var rowGrid = {
        name: model.name('row-grid'),
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
            name: model.name('row-grid-end'),
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
    var facetGridConfig = model.config().facet.grid;
    var columnGrid = {
        name: model.name('column-grid'),
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
            name: model.name('column-grid-end'),
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
//# sourceMappingURL=facet.js.map
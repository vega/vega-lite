"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var header_1 = require("../../../src/compile/header");
var index_1 = require("../../../src/compile/header/index");
var header_2 = require("../../../src/header");
var util_1 = require("../../util");
describe('compile/header/index', function () {
    describe('label aligns correctly according to angle', function () {
        chai_1.assert.deepEqual(header_1.labelAlign(23), { align: { value: 'right' } });
        chai_1.assert.deepEqual(header_1.labelAlign(135), { align: { value: 'left' } });
        chai_1.assert.deepEqual(header_1.labelAlign(50), { align: { value: 'right' } });
    });
    describe('label baseline adjusted according to angle', function () {
        chai_1.assert.deepEqual(header_1.labelBaseline(10), { baseline: 'middle' });
        chai_1.assert.deepEqual(header_1.labelBaseline(90), { baseline: 'top' });
    });
    describe('getHeaderGroups', function () {
        it('should correctly process sort descending', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal', sort: 'ascending' },
                    column: { field: 'a', type: 'ordinal', sort: 'descending' }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseScale();
            model.parseLayoutSize();
            model.parseAxisAndHeader();
            var rowHeaderGroups = header_1.getHeaderGroups(model, 'row');
            var columnHeaderGroups = header_1.getHeaderGroups(model, 'column');
            chai_1.assert.equal(rowHeaderGroups[0].sort.order, 'ascending');
            chai_1.assert.equal(columnHeaderGroups[0].sort.order, 'descending');
        });
        it('should correctly process sort field', function () {
            var model = util_1.parseFacetModel({
                facet: {
                    row: { field: 'a', type: 'ordinal', sort: { field: 'd', op: 'min' } }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            model.parseScale();
            model.parseLayoutSize();
            model.parseAxisAndHeader();
            var rowHeaderGroups = header_1.getHeaderGroups(model, 'row');
            chai_1.assert.equal(rowHeaderGroups[0].sort.field, 'datum["min_d"]');
        });
    });
    describe('getTitleGroup', function () {
        var model = util_1.parseFacetModel({
            facet: {
                row: { field: 'a', type: 'ordinal' },
                column: { field: 'a', type: 'ordinal' }
            },
            spec: {
                mark: 'point',
                encoding: {
                    x: { field: 'b', type: 'quantitative' },
                    y: { field: 'c', type: 'quantitative' }
                }
            }
        });
        model.parseScale();
        model.parseLayoutSize();
        model.parseAxisAndHeader();
        describe('for column', function () {
            var columnLabelGroup = header_1.getTitleGroup(model, 'column');
            var title = columnLabelGroup.title, columnTitleGroupTopLevelProps = tslib_1.__rest(columnLabelGroup, ["title"]);
            it('returns a header group mark with correct name, role, and type.', function () {
                chai_1.assert.deepEqual(columnTitleGroupTopLevelProps, {
                    name: 'column-title',
                    type: 'group',
                    role: 'column-title'
                });
            });
            var name = title.text;
            it('contains a correct title definition, including the correct name and orientation', function () {
                chai_1.assert.deepEqual(title, {
                    text: name,
                    offset: 10,
                    orient: undefined,
                    style: 'guide-title'
                });
            });
        });
        describe('for row', function () {
            var rowTitleGroup = header_1.getTitleGroup(model, 'row');
            var title = rowTitleGroup.title, rowTitleGroupTopLevelProps = tslib_1.__rest(rowTitleGroup, ["title"]);
            it('returns a header group mark with correct name, role, and type.', function () {
                chai_1.assert.deepEqual(rowTitleGroupTopLevelProps, {
                    name: 'row-title',
                    type: 'group',
                    role: 'row-title'
                });
            });
            var name = title.text;
            it('contains a correct title definition, including the correct name and orientation.', function () {
                chai_1.assert.deepEqual(title, {
                    text: name,
                    offset: 10,
                    orient: 'left',
                    style: 'guide-title'
                });
            });
        });
    });
    describe('getHeaderProperties', function () {
        describe('for title properties', function () {
            var titleSpec = util_1.parseFacetModel({
                config: { header: { titleFontSize: 20 } },
                facet: {
                    row: { field: 'a', type: 'ordinal', header: { titleFontSize: 40 } }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            titleSpec.parseScale();
            titleSpec.parseLayoutSize();
            titleSpec.parseAxisAndHeader();
            var config = titleSpec.config;
            var facetFieldDef = titleSpec.component.layoutHeaders['row'].facetFieldDef;
            var headerTitleProps = index_1.getHeaderProperties(undefined, facetFieldDef, header_2.HEADER_TITLE_PROPERTIES, header_2.HEADER_TITLE_PROPERTIES_MAP);
            it('should return the correct title property from header', function () {
                chai_1.assert.deepEqual(headerTitleProps, { fontSize: 40 });
            });
            var configTitleProps = index_1.getHeaderProperties(config, undefined, header_2.HEADER_TITLE_PROPERTIES, header_2.HEADER_TITLE_PROPERTIES_MAP);
            it('should return the correct title property from config', function () {
                chai_1.assert.deepEqual(configTitleProps, { fontSize: 20 });
            });
            var bothTitleProps = index_1.getHeaderProperties(config, facetFieldDef, header_2.HEADER_TITLE_PROPERTIES, header_2.HEADER_TITLE_PROPERTIES_MAP);
            it('should overwrite the config title property with the header title property', function () {
                chai_1.assert.deepEqual(bothTitleProps, { fontSize: 40 });
            });
        });
        describe('for label properties', function () {
            var labelSpec = util_1.parseFacetModel({
                config: { header: { labelFontSize: 20 } },
                facet: {
                    row: { field: 'a', type: 'ordinal', header: { labelFontSize: 40 } }
                },
                spec: {
                    mark: 'point',
                    encoding: {
                        x: { field: 'b', type: 'quantitative' },
                        y: { field: 'c', type: 'quantitative' }
                    }
                }
            });
            labelSpec.parseScale();
            labelSpec.parseLayoutSize();
            labelSpec.parseAxisAndHeader();
            var config = labelSpec.config;
            var facetFieldDef = labelSpec.component.layoutHeaders['row'].facetFieldDef;
            var headerLabelProps = index_1.getHeaderProperties(undefined, facetFieldDef, header_2.HEADER_LABEL_PROPERTIES, header_2.HEADER_LABEL_PROPERTIES_MAP);
            it('should return the correct label property from header', function () {
                chai_1.assert.deepEqual(headerLabelProps, { fontSize: 40 });
            });
            var configLabelProps = index_1.getHeaderProperties(config, undefined, header_2.HEADER_LABEL_PROPERTIES, header_2.HEADER_LABEL_PROPERTIES_MAP);
            it('should return the correct label property from config', function () {
                chai_1.assert.deepEqual(configLabelProps, { fontSize: 20 });
            });
            var bothLabelProps = index_1.getHeaderProperties(config, facetFieldDef, header_2.HEADER_LABEL_PROPERTIES, header_2.HEADER_LABEL_PROPERTIES_MAP);
            it('should overwrite the config label property with the header label property', function () {
                chai_1.assert.deepEqual(bothLabelProps, { fontSize: 40 });
            });
        });
    });
});
//# sourceMappingURL=index.test.js.map
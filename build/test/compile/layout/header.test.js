import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { getHeaderGroups, getTitleGroup, labelAlign, labelBaseline } from '../../../src/compile/layout/header';
import { parseFacetModel } from '../../util';
describe('compile/layout/header', function () {
    describe('label aligns correctly according to angle', function () {
        assert.deepEqual(labelAlign(23), { align: { value: 'right' } });
        assert.deepEqual(labelAlign(135), { align: { value: 'left' } });
        assert.deepEqual(labelAlign(50), { align: { value: 'right' } });
    });
    describe('label baseline adjusted according to angle', function () {
        assert.deepEqual(labelBaseline(10), { baseline: { value: 'middle' } });
        assert.deepEqual(labelBaseline(90), { baseline: { value: 'top' } });
    });
    describe('getHeaderGroups', function () {
        it('should correctly process sort descending', function () {
            var model = parseFacetModel({
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
            var rowHeaderGroups = getHeaderGroups(model, 'row');
            var columnHeaderGroups = getHeaderGroups(model, 'column');
            assert.equal(rowHeaderGroups[0].sort.order, 'ascending');
            assert.equal(columnHeaderGroups[0].sort.order, 'descending');
        });
        it('should correctly process sort field', function () {
            var model = parseFacetModel({
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
            var rowHeaderGroups = getHeaderGroups(model, 'row');
            assert.equal(rowHeaderGroups[0].sort.field, 'datum["min_d"]');
        });
    });
    describe('getTitleGroup', function () {
        var model = parseFacetModel({
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
            var columnLabelGroup = getTitleGroup(model, 'column');
            var marks = columnLabelGroup.marks, columnTitleGroupTopLevelProps = tslib_1.__rest(columnLabelGroup, ["marks"]);
            it('returns a header group mark with correct name, role, type, and from.', function () {
                assert.deepEqual(columnTitleGroupTopLevelProps, {
                    name: 'column_title',
                    type: 'group',
                    role: 'column-title'
                });
            });
            var textMark = marks[0];
            it('contains a correct text mark with the correct role and encode as the only item in marks', function () {
                assert.equal(marks.length, 1);
                assert.deepEqual(textMark, {
                    type: 'text',
                    role: 'column-title-text',
                    style: 'guide-title',
                    encode: {
                        update: {
                            text: { value: 'a' },
                            align: { value: 'center' }
                        }
                    }
                });
            });
        });
        describe('for row', function () {
            var rowTitleGroup = getTitleGroup(model, 'row');
            var marks = rowTitleGroup.marks, rowTitleGroupTopLevelProps = tslib_1.__rest(rowTitleGroup, ["marks"]);
            it('returns a header group mark with correct name, role, type, from, and encode.', function () {
                assert.deepEqual(rowTitleGroupTopLevelProps, {
                    name: 'row_title',
                    type: 'group',
                    role: 'row-title'
                });
            });
            var textMark = marks[0];
            it('contains a correct text mark with the correct role and encode as the only item in marks', function () {
                assert.equal(marks.length, 1);
                assert.deepEqual(textMark, {
                    type: 'text',
                    role: 'row-title-text',
                    style: 'guide-title',
                    encode: {
                        update: {
                            text: { value: 'a' },
                            angle: { value: 270 },
                            align: { value: 'center' }
                        }
                    }
                });
            });
        });
    });
});
//# sourceMappingURL=header.test.js.map
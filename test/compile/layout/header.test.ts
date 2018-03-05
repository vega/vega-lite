import {assert} from 'chai';
import {getHeaderGroups, getTitleGroup, labelAlign, labelBaseline} from '../../../src/compile/layout/header';
import {VgMarkGroup} from '../../../src/vega.schema';
import {parseFacetModel} from '../../util';

describe('compile/layout/header', () => {
  describe('label aligns correctly according to angle', () => {
    assert.deepEqual(labelAlign(23), {align: {value: 'right'}});
    assert.deepEqual(labelAlign(135), {align: {value: 'left'}});
    assert.deepEqual(labelAlign(50), {align: {value: 'right'}});
  });

  describe('label baseline adjusted according to angle', () => {
    assert.deepEqual(labelBaseline(10), {});
    assert.deepEqual(labelBaseline(90), {baseline: {value: 'top'}});
  });

  describe('getHeaderGroups', () => {
    const model = parseFacetModel({
      facet: {
        row: {field: 'a', type: 'ordinal', sort: 'ascending'},
        column: {field: 'a', type: 'ordinal', sort: 'descending'}
      },
      spec: {
        mark: 'point',
        encoding: {
          x: {field: 'b', type: 'quantitative'},
          y: {field: 'c', type: 'quantitative'}
        }
      }
    });
    model.parseScale();
    model.parseLayoutSize();
    model.parseAxisAndHeader();

    const rowHeaderGroups = getHeaderGroups(model, 'row');
    const columnHeaderGroups = getHeaderGroups(model, 'column');
    it('should correctly process sort', () => {
      assert.equal(rowHeaderGroups[0].sort.order, 'ascending');
      assert.equal(columnHeaderGroups[0].sort.order, 'descending');
    });
  });

  describe('getTitleGroup', () => {
    const model = parseFacetModel({
      facet: {
        row: {field: 'a', type: 'ordinal'},
        column: {field: 'a', type: 'ordinal'}
      },
      spec: {
        mark: 'point',
        encoding: {
          x: {field: 'b', type: 'quantitative'},
          y: {field: 'c', type: 'quantitative'}
        }
      }
    });
    model.parseScale();
    model.parseLayoutSize();
    model.parseAxisAndHeader();

    describe('for column', () => {
      const columnLabelGroup = getTitleGroup(model, 'column');
      const {marks, ...columnTitleGroupTopLevelProps} = columnLabelGroup;
      it('returns a header group mark with correct name, role, type, and from.', () => {

        assert.deepEqual(columnTitleGroupTopLevelProps, {
          name: 'column_title',
          type: 'group',
          role: 'column-title'
        });
      });
      const textMark = marks[0];

      it('contains a correct text mark with the correct role and encode as the only item in marks', () => {
        assert.equal(marks.length, 1);
        assert.deepEqual<VgMarkGroup>(textMark, {
          type: 'text',
          role: 'column-title-text',
          style: 'guide-title',
          encode: {
            update: {
              text: {value: 'a'},
              align: {value: 'center'}
            }
          }
        });
      });
    });

    describe('for row', () => {
      const rowTitleGroup = getTitleGroup(model, 'row');
      const {marks, ...rowTitleGroupTopLevelProps} = rowTitleGroup;
      it('returns a header group mark with correct name, role, type, from, and encode.', () => {

        assert.deepEqual(rowTitleGroupTopLevelProps, {
          name: 'row_title',
          type: 'group',
          role: 'row-title'
        });
      });
      const textMark = marks[0];

      it('contains a correct text mark with the correct role and encode as the only item in marks', () => {
        assert.equal(marks.length, 1);
        assert.deepEqual<VgMarkGroup>(textMark, {
          type: 'text',
          role: 'row-title-text',
          style: 'guide-title',
          encode: {
            update: {
              text: {value: 'a'},
              angle: {value: 270},
              align: {value: 'center'}
            }
          }
        });
      });
    });
  });
});

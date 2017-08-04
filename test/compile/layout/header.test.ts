import {assert} from 'chai';
import {getTitleGroup} from '../../../src/compile/layout/header';
import {VgMarkGroup} from '../../../src/vega.schema';
import {parseFacetModel} from '../../util';

describe('compile/layout/header', () => {
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
          encode: {
            update: {
              text: {value: 'a'},
              fontWeight: {value: 'bold'},
              align: {value: 'center'},
              fill: {value: 'black'}
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
          encode: {
            update: {
              text: {value: 'a'},
              angle: {value: 270},
              fontWeight: {value: 'bold'},
              align: {value: 'center'},
              fill: {value: 'black'}
            }
          }
        });
      });
    });
  });
});

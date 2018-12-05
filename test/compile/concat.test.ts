import * as log from '../../src/log';
import {VgLayout} from '../../src/vega.schema';
import {parseConcatModel} from '../util';

describe('Concat', () => {
  describe('merge scale domains', () => {
    it('should instantiate all children in vconcat', () => {
      const model = parseConcatModel({
        vconcat: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'ordinal'}
            }
          },
          {
            mark: 'bar',
            encoding: {
              x: {field: 'b', type: 'ordinal'},
              y: {field: 'c', type: 'quantitative'}
            }
          }
        ]
      });

      expect(model.children.length).toEqual(2);
      expect(model.isVConcat).toBeTruthy();
    });

    it('should instantiate all children in hconcat', () => {
      const model = parseConcatModel({
        hconcat: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'ordinal'}
            }
          },
          {
            mark: 'bar',
            encoding: {
              x: {field: 'b', type: 'ordinal'},
              y: {field: 'c', type: 'quantitative'}
            }
          }
        ]
      });

      expect(model.children.length).toEqual(2);
      expect(!model.isVConcat).toBeTruthy();
    });

    it('should create correct layout for vconcat', () => {
      const model = parseConcatModel({
        vconcat: [
          {
            mark: 'point',
            encoding: {}
          },
          {
            mark: 'bar',
            encoding: {}
          }
        ]
      });

      expect(model.assembleLayout()).toEqual({
        padding: {row: 10, column: 10},
        columns: 1,
        bounds: 'full',
        align: 'each'
      });
    });

    it('should create correct layout for hconcat', () => {
      const model = parseConcatModel({
        hconcat: [
          {
            mark: 'point',
            encoding: {}
          },
          {
            mark: 'bar',
            encoding: {}
          }
        ]
      });

      expect(model.assembleLayout()).toEqual({
        padding: {row: 10, column: 10},
        bounds: 'full',
        align: 'each'
      });
    });
  });

  describe('resolve', () => {
    it(
      'cannot share axes',
      log.wrap(localLogger => {
        parseConcatModel({
          hconcat: [],
          resolve: {
            axis: {
              x: 'shared'
            }
          }
        });
        expect(localLogger.warns[0]).toEqual(log.message.CONCAT_CANNOT_SHARE_AXIS);
      })
    );
  });
});

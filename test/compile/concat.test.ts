import * as log from '../../src/log';
import {DEFAULT_SPACING} from '../../src/spec/base';
import {parseConcatModel} from '../util';

describe('ConcatModel', () => {
  describe('concat', () => {
    it('should correctly apply columns config', () => {
      const model = parseConcatModel({
        concat: [
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
        ],
        config: {
          concat: {columns: 1}
        }
      });

      expect(model.layout).toMatchObject({columns: 1, spacing: DEFAULT_SPACING});
      expect(model.concatType).toEqual('concat');
    });
  });

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

      expect(model.children).toHaveLength(2);
      expect(model.concatType).toEqual('vconcat');
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

      expect(model.children).toHaveLength(2);
      expect(model.concatType).toEqual('hconcat');
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
        padding: DEFAULT_SPACING,
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

      expect(model.concatType).toEqual('hconcat');

      expect(model.assembleLayout()).toEqual({
        padding: DEFAULT_SPACING,
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

import * as log from '../../src/log/index.js';
import {DEFAULT_SPACING} from '../../src/spec/base.js';
import {parseConcatModel} from '../util.js';

describe('ConcatModel', () => {
  describe('concat', () => {
    it('should correctly apply columns config', () => {
      const model = parseConcatModel({
        concat: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'ordinal'},
            },
          },
          {
            mark: 'bar',
            encoding: {
              x: {field: 'b', type: 'ordinal'},
              y: {field: 'c', type: 'quantitative'},
            },
          },
        ],
        config: {
          concat: {columns: 1},
        },
      });

      expect(model.layout).toMatchObject({columns: 1, spacing: DEFAULT_SPACING});
    });
  });

  describe('merge scale domains', () => {
    it('should instantiate all children in vconcat', () => {
      const model = parseConcatModel({
        vconcat: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'ordinal'},
            },
          },
          {
            mark: 'bar',
            encoding: {
              x: {field: 'b', type: 'ordinal'},
              y: {field: 'c', type: 'quantitative'},
            },
          },
        ],
      });

      expect(model.children).toHaveLength(2);
      expect(model.layout.columns).toBe(1);
    });

    it('should instantiate all children in hconcat', () => {
      const model = parseConcatModel({
        hconcat: [
          {
            mark: 'point',
            encoding: {
              x: {field: 'a', type: 'ordinal'},
            },
          },
          {
            mark: 'bar',
            encoding: {
              x: {field: 'b', type: 'ordinal'},
              y: {field: 'c', type: 'quantitative'},
            },
          },
        ],
      });

      expect(model.children).toHaveLength(2);
      expect(model.layout.columns).toBeUndefined();
    });

    it('should create correct layout for vconcat', () => {
      const model = parseConcatModel({
        vconcat: [
          {
            mark: 'point',
            encoding: {},
          },
          {
            mark: 'bar',
            encoding: {},
          },
        ],
      });

      expect(model.assembleLayout()).toEqual({
        padding: DEFAULT_SPACING,
        columns: 1,
        bounds: 'full',
        align: 'each',
      });
    });

    it('should create correct layout for hconcat', () => {
      const model = parseConcatModel({
        hconcat: [
          {
            mark: 'point',
            encoding: {},
          },
          {
            mark: 'bar',
            encoding: {},
          },
        ],
      });

      expect(model.layout.columns).toBeUndefined();

      expect(model.assembleLayout()).toEqual({
        padding: DEFAULT_SPACING,
        bounds: 'full',
        align: 'each',
      });
    });
  });

  describe('resolve', () => {
    it(
      'cannot share axes',
      log.wrap((localLogger) => {
        parseConcatModel({
          hconcat: [],
          resolve: {
            axis: {
              x: 'shared',
            },
          },
        });
        expect(localLogger.warns[0]).toEqual(log.message.CONCAT_CANNOT_SHARE_AXIS);
      }),
    );
  });
});

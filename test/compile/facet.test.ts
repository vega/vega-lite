import {assert} from 'chai';

import * as log from '../../src/log';

import {FacetModel} from '../../src/compile/facet';
import * as facet from '../../src/compile/facet';
import {SHAPE, ROW} from '../../src/channel';
import {POINT} from '../../src/mark';
import {FacetSpec} from '../../src/spec';
import {Facet} from '../../src/facet';
import {ORDINAL} from '../../src/type';
import {parseFacetModel} from '../util';

describe('FacetModel', function() {
  it('should say it is facet', function() {
    const model = new FacetModel({facet: {}, spec: {
      mark: POINT,
      encoding: {}
    }} as FacetSpec, null, null);
    assert(!model.isUnit());
    assert(model.isFacet());
    assert(!model.isLayer());
  });

  describe('initFacet', () => {
    it('should drop unsupported channel and throws warning', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseFacetModel({
          facet: ({
            shape: {field: 'a', type: 'quantitative'}
          }) as Facet, // Cast to allow invalid facet type for test
          spec: {
            mark: 'point'
          }
        });
        assert.equal(model.facet()['shape'], undefined);
        assert.equal(localLogger.warns[0], log.message.incompatibleChannel(SHAPE, 'facet'));
      });
    });

    it('should drop channel without field and value and throws warning', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseFacetModel({
          facet: {
            row: {type: 'ordinal'}
          },
          spec: {
            mark: 'point'
          }
        });
        assert.equal(model.facet().row, undefined);
        assert.equal(localLogger.warns[0], log.message.emptyFieldDef({type: ORDINAL}, ROW));
      });
    });

    it('should drop channel without field and value and throws warning', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseFacetModel({
          facet: {
            row: {field: 'a', type: 'quantitative'}
          },
          spec: {
            mark: 'point'
          }
        });
        assert.deepEqual(model.facet().row, {field: 'a', type: 'quantitative'});
        assert.equal(localLogger.warns[0], log.message.facetChannelShouldBeDiscrete(ROW));
      });
    });
  });
});

describe('compile/facet', () => {
  describe('assembleAxesGroupData', () => {
    it('should output row-source when there is row', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point'
        }
      });

      // HACK: mock that we have parsed its data and there is not summary
      // This way, we won't have surge in test coverage for the parse methods.
      model['hasSummary'] = () => false;

      assert.deepEqual(
        facet.assembleAxesGroupData(model, []),
        [{
          name: facet.ROW_AXES_DATA_PREFIX + 'source',
          source: 'source',
          transform: [{
            type: 'aggregate',
            groupby: ['a']
          }]
        }]
      );
    });

    it('should output column-source when there is column', () => {
      const model = parseFacetModel({
        facet: {
          column: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point'
        }
      });

      // HACK: mock that we have parsed its data and there is not summary
      // This way, we won't have surge in test coverage for the parse methods.
      model['hasSummary'] = () => false;

      assert.deepEqual(
        facet.assembleAxesGroupData(model, []),
        [{
          name: facet.COLUMN_AXES_DATA_PREFIX + 'source',
          source: 'source',
          transform: [{
            type: 'aggregate',
            groupby: ['a']
          }]
        }]
      );
    });

    it('should output row- and column-source when there are both row and column', () => {
      const model = parseFacetModel({
        facet: {
          column: {field: 'a', type: 'ordinal'},
          row: {field: 'b', type: 'ordinal'}
        },
        spec: {
          mark: 'point'
        }
      });

      // HACK: mock that we have parsed its data and there is not summary
      // This way, we won't have surge in test coverage for the parse methods.
      model['hasSummary'] = () => false;

      assert.deepEqual(
        facet.assembleAxesGroupData(model, []),
        [{
          name: facet.COLUMN_AXES_DATA_PREFIX + 'source',
          source: 'source',
          transform: [{
            type: 'aggregate',
            groupby: ['a']
          }]
        },{
          name: facet.ROW_AXES_DATA_PREFIX + 'source',
          source: 'source',
          transform: [{
            type: 'aggregate',
            groupby: ['b']
          }]
        }]
      );
    });
  });
});

import {assert} from 'chai';

import * as log from '../../src/log';

import {FacetModel} from '../../src/compile/facet';
import {SHAPE, ROW} from '../../src/channel';
import {POINT} from '../../src/mark';
import {FacetSpec} from '../../src/spec';
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
          facet: {
            shape: {field: 'a', type: 'quantitative'}
          },
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

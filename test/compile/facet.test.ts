/* tslint:disable quotemark */

import {assert} from 'chai';
import {Axis} from '../../src/axis';
import {ROW, SHAPE} from '../../src/channel';
import * as facet from '../../src/compile/facet';
import {FacetModel} from '../../src/compile/facet';
import {defaultConfig} from '../../src/config';
import {Facet} from '../../src/facet';
import {PositionFieldDef} from '../../src/fielddef';
import * as log from '../../src/log';
import {POINT} from '../../src/mark';
import {ORDINAL} from '../../src/type';
import {VgLayout} from '../../src/vega.schema';
import {parseFacetModel} from '../util';

describe('FacetModel', function() {
  describe('initFacet', () => {
    it('should drop unsupported channel and throws warning', () => {
      log.runLocalLogger((localLogger) => {
        const model = parseFacetModel({
          facet: ({
            shape: {field: 'a', type: 'quantitative'}
          }) as Facet<string>, // Cast to allow invalid facet type for test
          spec: {
            mark: 'point',
            encoding: {}
          }
        });
        assert.equal(model.facet['shape'], undefined);
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
            mark: 'point',
            encoding: {}
          }
        });
        assert.equal(model.facet.row, undefined);
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
            mark: 'point',
            encoding: {}
          }
        });
        assert.deepEqual<PositionFieldDef<string>>(model.facet.row, {field: 'a', type: 'quantitative'});
        assert.equal(localLogger.warns[0], log.message.facetChannelShouldBeDiscrete(ROW));
      });
    });
  });

  describe('parseScale', () => {
    it('should correctly set scale component for a model', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'quantitative'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'}
          }
        }
      });

      model.parseScale();

      assert(model.component.scales['x']);
    });
  });

  describe('assembleLayout', () => {
    it('returns a layout with only one column', () => {
      const model = parseFacetModel({
        facet: {
          column: {field: 'a', type: 'quantitative'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'}
          }
        }
      });
      const layout = model.assembleLayout();
      assert.deepEqual<VgLayout>(layout, {
        padding: {row: 10, column: 10},
        offset: 10,
        columns: {
          signal: "data('column_layout')[0].distinct_a"
        },
        bounds: 'full'
      });
    });
  });

  describe('dataTable', () => {
    it('should return stacked if there is a stacked data component', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "color": {"field": "site", "type": "nominal"}
          }
        }
      });

      // Mock
      model.component.data = {stack: {}} as any;

      // assert.equal(model.dataTable(), 'stacked');
    });

    it('should return summary if there is a summary data component and no stacked', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"}
          }
        }
      });

      // Mock
      model.component.data = {summary: [{
        measures: {a: 1}
      }]} as any;

      // assert.equal(model.dataTable(), 'main');
    });

    it('should return source if there is no stacked nor summary data component', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            "x": {"field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"}
          }
        }
      });
      // Mock
      model.component.data = {summary: []} as any;

      // assert.equal(model.dataTable(), 'main');
    });
  });
});

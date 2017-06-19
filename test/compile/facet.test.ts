/* tslint:disable quotemark */

import {assert} from 'chai';
import {Axis} from '../../src/axis';
import {ROW, SHAPE} from '../../src/channel';
import {parseData} from '../../src/compile/data/parse';
import {FacetModel} from '../../src/compile/facet';
import * as facet from '../../src/compile/facet';
import {defaultConfig} from '../../src/config';
import {Facet} from '../../src/facet';
import {PositionFieldDef} from '../../src/fielddef';
import * as log from '../../src/log';
import {POINT} from '../../src/mark';
import {ORDINAL} from '../../src/type';
import {VgLayout} from '../../src/vega.schema';
import {parseFacetModel, parseFacetModelWithScale} from '../util';

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

  describe('parseMarkGroup', () => {
    it('should add cross and sort if we facet my multiple dimensions', () => {
      const model = parseFacetModelWithScale({
        facet: {
          row: {field: 'a', type: 'ordinal'},
          column: {field: 'b', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseData();
      model.parseLayoutSize();
      model.parseMarkGroup();


      assert(model.component.mark[0].from.facet.aggregate.cross);
      assert.deepEqual(model.component.mark[0].sort, {
        field: [
          'datum["a"]',
          'datum["b"]'
        ],
        order: [
          'ascending',
          'ascending'
        ]
      });
    });
  });

  describe('parseScale', () => {
    it('should correctly set scale component for a model', () => {
      const model = parseFacetModelWithScale({
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


      assert(model.component.scales['x']);
    });

    it('should create independent scales if resolve is set to independent', () => {
      const model = parseFacetModelWithScale({
        facet: {
          row: {field: 'a', type: 'quantitative'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'}
          }
        },
        resolve: {
          x: {
            scale: 'independent'
          }
        }
      });

      assert(!model.component.scales['x']);
    });
  });

  describe('assembleLayout', () => {
    it('returns a layout with only one column', () => {
      const model = parseFacetModelWithScale({
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
          signal: "data('column_layout')[0][\"distinct_a\"]"
        },
        bounds: 'full'
      });
    });
  });


  describe('parseAxisAndHeader', () => {
    // TODO: add more tests
    // - correctly join title for nested facet
    // - correctly generate headers with right labels and axes


    it('applies text format to the fieldref of a temporal field', () => {
      const model = parseFacetModelWithScale({
        facet: {
          column: {timeUnit:'year', field: 'date', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseAxisAndHeader();
      assert(model.component.layoutHeaders.column.fieldRef, "timeFormat(parent[\"year_date\"], '%Y')");
    });

    it('applies number format for fieldref of a quantitative field', () => {
      const model = parseFacetModelWithScale({
        facet: {
          column: {field: 'a', type: 'quantitative', format: 'd'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseAxisAndHeader();
      assert(model.component.layoutHeaders.column.fieldRef, "format(parent[\"a\"], 'd')");
    });

    it('ignores number format for fieldref of a binned field', () => {
      const model = parseFacetModelWithScale({
        facet: {
          column: {bin: true, field: 'a', type: 'quantitative'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseAxisAndHeader();
      assert(model.component.layoutHeaders.column.fieldRef, "parent[\"a\"]");
    });
  });
});

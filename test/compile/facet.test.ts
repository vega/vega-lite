/* tslint:disable quotemark */

import {assert} from 'chai';

import * as log from '../../src/log';

import {FacetModel} from '../../src/compile/facet';
import * as facet from '../../src/compile/facet';
import {SHAPE, ROW} from '../../src/channel';
import {defaultConfig} from '../../src/config';
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
        assert.deepEqual(model.facet.row, {field: 'a', type: 'quantitative'});
        assert.equal(localLogger.warns[0], log.message.facetChannelShouldBeDiscrete(ROW));
      });
    });
  });

  describe('spacing', () => {
    it('should return specified spacing if specified', () => {
      assert.equal(facet.spacing({spacing: 123}, null, null), 123);
    });

    it('should return default facetSpacing if there is a subplot and no specified spacing', () => {
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
      assert.equal(facet.spacing({}, model, defaultConfig), defaultConfig.scale.facetSpacing);
    });

    it('should return 0 if it is a simple table without subplot with x/y and no specified spacing', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            "color": {"field": "site", "type": "nominal"}
          }
        }
      });
      assert.equal(facet.spacing({}, model, defaultConfig), 0);
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

      assert.equal(model.dataTable(), 'stacked');
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

      assert.equal(model.dataTable(), 'summary');
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

      assert.equal(model.dataTable(), 'source');
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
          mark: 'point',
          encoding: {}
        }
      });

      // HACK: mock that we have parsed its data and there is no stack and no summary
      // This way, we won't have surge in test coverage for the parse methods.
      model.component.data = {} as any;
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
          mark: 'point',
          encoding: {}
        }
      });

      // HACK: mock that we have parsed its data and there is no stack and no summary
      // This way, we won't have surge in test coverage for the parse methods.
      model.component.data = {} as any;
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
          mark: 'point',
          encoding: {}
        }
      });

      // HACK: mock that we have parsed its data and there is no stack and no summary
      // This way, we won't have surge in test coverage for the parse methods.
      model.component.data = {} as any;
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

  describe('getSharedAxisGroup', () => {
    describe('column-only', () => {
      const model = parseFacetModel({
        facet: {
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

      // HACK: mock that we have parsed its data and there is no stack and no summary
      // This way, we won't have surge in test coverage for the parse methods.
      model.component.data = {} as any;
      model['hasSummary'] = () => false;

      describe('xAxisGroup', () => {
        const xSharedAxisGroup = facet.getSharedAxisGroup(model, 'x');
        it('should have correct type, name, and data source', () => {
          assert.equal(xSharedAxisGroup.name, 'x-axes');
          assert.equal(xSharedAxisGroup.type, 'group');
          assert.deepEqual(xSharedAxisGroup.from, {data: 'column-source'});
        });

        it('should have width = child width, height = group height, x = column field', () => {
          assert.deepEqual(xSharedAxisGroup.encode.update.width, {field: {parent: 'child_width'}});
          assert.deepEqual(xSharedAxisGroup.encode.update.height, {field: {group: 'height'}});
          assert.deepEqual(xSharedAxisGroup.encode.update.x, {scale: 'column', field: 'a', offset: 8});
        });
      });

      describe('yAxisGroup', () => {
        const ySharedAxisGroup = facet.getSharedAxisGroup(model, 'y');
        it('should have correct type, name, and data source', () => {
          assert.equal(ySharedAxisGroup.name, 'y-axes');
          assert.equal(ySharedAxisGroup.type, 'group');
          assert.equal(ySharedAxisGroup.from, undefined);
        });

        it('should have height = child height, width = group width, y = defaultFacetSpacing / 2.', () => {
          assert.deepEqual(ySharedAxisGroup.encode.update.height, {field: {parent: 'child_height'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.width, {field: {group: 'width'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.y, {value: 8});
        });
      });
    });

    describe('row-only', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });

      // HACK: mock that we have parsed its data and there is no stack and no summary
      // This way, we won't have surge in test coverage for the parse methods.
      model.component.data = {} as any;
      model['hasSummary'] = () => false;

      describe('yAxisGroup', () => {
        const ySharedAxisGroup = facet.getSharedAxisGroup(model, 'y');
        it('should have correct type, name, and data source', () => {
          assert.equal(ySharedAxisGroup.name, 'y-axes');
          assert.equal(ySharedAxisGroup.type, 'group');
          assert.deepEqual(ySharedAxisGroup.from, {data: 'row-source'});
        });

        it('should have height = child height, width = group width, y= row field', () => {
          assert.deepEqual(ySharedAxisGroup.encode.update.height, {field: {parent: 'child_height'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.width, {field: {group: 'width'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.y, {scale: 'row', field: 'a', offset: 8});
        });
      });

      describe('xAxisGroup', () => {
        const xSharedAxisGroup = facet.getSharedAxisGroup(model, 'x');
        it('should have correct type, name, and data source', () => {
          assert.equal(xSharedAxisGroup.name, 'x-axes');
          assert.equal(xSharedAxisGroup.type, 'group');
          assert.equal(xSharedAxisGroup.from, undefined);
        });

        it('should have width = child width, height = group height, x, x = defaultFacetSpacing / 2.', () => {
          assert.deepEqual(xSharedAxisGroup.encode.update.width, {field: {parent: 'child_width'}});
          assert.deepEqual(xSharedAxisGroup.encode.update.height, {field: {group: 'height'}});
          assert.deepEqual(xSharedAxisGroup.encode.update.x, {value: 8});
        });
      });
    });
  });
});


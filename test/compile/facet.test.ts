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
import {parseFacetModel} from '../util';

describe('FacetModel', function() {
  it('should say it is facet', function() {
    const model = parseFacetModel({
      facet: {},
      spec: {
        mark: POINT,
        encoding: {}
      }
    });
    assert(model instanceof FacetModel);
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
        assert.deepEqual<PositionFieldDef>(model.facet.row, {field: 'a', type: 'quantitative'});
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

describe('compile/facet', () => {
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
          assert.deepEqual(xSharedAxisGroup.from, {data: 'column'});
        });

        it('should have width = child width, height = group height and have no x', () => {
          assert.deepEqual(xSharedAxisGroup.encode.update.width, {field: {parent: 'child_width'}});
          assert.deepEqual(xSharedAxisGroup.encode.update.height, {field: {group: 'height'}});
          assert.equal(xSharedAxisGroup.encode.update.x, undefined);
        });
      });

      describe('yAxisGroup', () => {
        const ySharedAxisGroup = facet.getSharedAxisGroup(model, 'y');
        it('should have correct type, name, and data source', () => {
          assert.equal(ySharedAxisGroup.name, 'y-axes');
          assert.equal(ySharedAxisGroup.type, 'group');
          assert.equal(ySharedAxisGroup.from, undefined);
        });

        it('should have height = child height, width = group width, and have no y.', () => {
          assert.deepEqual(ySharedAxisGroup.encode.update.height, {field: {parent: 'child_height'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.width, {field: {group: 'width'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.y, undefined);
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
          assert.deepEqual(ySharedAxisGroup.from, {data: 'row'});
        });

        it('should have height = child height, width = group width, and have no y.', () => {
          assert.deepEqual(ySharedAxisGroup.encode.update.height, {field: {parent: 'child_height'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.width, {field: {group: 'width'}});
          assert.deepEqual(ySharedAxisGroup.encode.update.y, undefined);
        });
      });

      describe('xAxisGroup', () => {
        const xSharedAxisGroup = facet.getSharedAxisGroup(model, 'x');
        it('should have correct type, name, and data source', () => {
          assert.equal(xSharedAxisGroup.name, 'x-axes');
          assert.equal(xSharedAxisGroup.type, 'group');
          assert.equal(xSharedAxisGroup.from, undefined);
        });

        it('should have width = child width, height = group height, x, and have no y.', () => {
          assert.deepEqual(xSharedAxisGroup.encode.update.width, {field: {parent: 'child_width'}});
          assert.deepEqual(xSharedAxisGroup.encode.update.height, {field: {group: 'height'}});
          assert.deepEqual(xSharedAxisGroup.encode.update.x, undefined);
        });
      });
    });
  });

  describe('initAxis', () => {
    it('should include properties from axis and config.facet.axis', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal', axis: {offset: 30}}
        },
        spec: {
          mark: 'point',
          encoding: {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
          },
        },
        config: {"facet": {"axis": {"labelPadding": 123}}}
      });
      assert.deepEqual<Axis>(model.axis(ROW), {"orient": "right", "labelAngle": 90, "offset": 30, "labelPadding": 123});
    });

    it('should set the labelAngle if specified', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'c', type: 'ordinal', "axis": {"labelAngle": 0}}
        },
        spec: {
          mark: 'point',
          encoding: {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"}
          },
        }
      });
      assert.deepEqual<Axis>(model.axis(ROW), {"orient": "right", "labelAngle": 0});
    });

    it('should set the labelAngle if labelAngle is not specified', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal'}
        },
        spec: {
          mark: 'point',
          encoding: {
            "x": {"aggregate": "sum", "field": "yield", "type": "quantitative"},
            "y": {"field": "variety", "type": "nominal"},
            "row": {
              "field": "c", "type": "nominal",
              "axis": {
                  "title": "title"
              }
            }
          },
        }
      });
      assert.deepEqual<Axis>(model.axis(ROW), {"orient": "right", "labelAngle": 90});
    });
  });
});

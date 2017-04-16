/* tslint:disable quotemark */

import {assert} from 'chai';
import {Axis} from '../../src/axis';
import {ROW, SHAPE} from '../../src/channel';
import * as facet from '../../src/compile/facet';
import {FacetModel, getLabelGroup, getTitleGroup} from '../../src/compile/facet';
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
        padding: {row: 10, column: 10, header: 10}, // TODO: allow customizing padding
        columns: 1,
        bounds: 'full'
      });
    });
  });

  describe('assembleSignals', () => {
    it('includes signal for calculating column length when there is a column field', () => {
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
      const signals = model.assembleSignals([]);
      assert.includeDeepMembers(signals, [
        {
          name: 'column',
          update: `data('layout')[0].distinct_a`
        }
      ]);
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

      });

      describe('yAxisGroup', () => {
        const ySharedAxisGroup = facet.getSharedAxisGroup(model, 'y');
        it('should have correct type, name, and data source', () => {
          assert.equal(ySharedAxisGroup.name, 'y-axes');
          assert.equal(ySharedAxisGroup.type, 'group');
          assert.equal(ySharedAxisGroup.from, undefined);
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
      });

      describe('xAxisGroup', () => {
        const xSharedAxisGroup = facet.getSharedAxisGroup(model, 'x');
        it('should have correct type, name, and data source', () => {
          assert.equal(xSharedAxisGroup.name, 'x-axes');
          assert.equal(xSharedAxisGroup.type, 'group');
          assert.equal(xSharedAxisGroup.from, undefined);
        });
      });
    });
  });

  describe('getLabelGroup', () => {
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

    describe('for column', () => {
      const columnLabelGroup = getLabelGroup(model, 'column');
      const {marks, ...columnLabelGroupTopLevelProps} = columnLabelGroup;
      it('returns a header group mark with correct name, role, type, from, and encode.', () => {

        assert.deepEqual(columnLabelGroupTopLevelProps, {
          name: 'column-labels',
          type: 'group',
          role: 'column-header',
          from: {data: 'column'},
          encode: {
            update: {
              width: {field: {parent: 'child_width', level: 2}}
            }
          }
        });
      });
      const textMark = marks[0];

      it('contains a correct text mark with the correct role and encode as the only item in marks', () => {
        assert.equal(marks.length, 1);
        assert.deepEqual(textMark, {
          type: 'text',
          role: 'column-labels',
          encode: {
            update: {
              x: {field: {group: 'width'}, mult: 0.5},
              y: {value: -10},
              text: {field: {parent: 'a'}},
              align: {value: 'center'},
              fill: {value: 'black'}
            }
          }
        });
      });
    });

    describe('for row', () => {
      const rowLabelGroup = getLabelGroup(model, 'row');
      const {marks, ...rowLabelGroupTopLevelProps} = rowLabelGroup;
      it('returns a header group mark with correct name, role, type, from, and encode.', () => {

        assert.deepEqual(rowLabelGroupTopLevelProps, {
          name: 'row-labels',
          type: 'group',
          role: 'row-header',
          from: {data: 'row'},
          encode: {
            update: {
              height: {field: {parent: 'child_height', level: 2}}
            }
          }
        });
      });
      const textMark = marks[0];

      it('contains a correct text mark with the correct role and encode as the only item in marks', () => {
        assert.equal(marks.length, 1);
        assert.deepEqual(textMark, {
          type: 'text',
          role: 'row-labels',
          encode: {
            update: {
              y: {field: {group: 'height'}, mult: 0.5},
              x: {value: -10},
              text: {field: {parent: 'a'}},
              align: {value: 'right'},
              fill: {value: 'black'}
            }
          }
        });
      });
    });
  });

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

    describe('for column', () => {
      const columnLabelGroup = getTitleGroup(model, 'column');
      const {marks, ...columnTitleGroupTopLevelProps} = columnLabelGroup;
      it('returns a header group mark with correct name, role, type, and from.', () => {

        assert.deepEqual(columnTitleGroupTopLevelProps, {
          name: 'column-title',
          type: 'group',
          role: 'column-header'
        });
      });
      const textMark = marks[0];

      it('contains a correct text mark with the correct role and encode as the only item in marks', () => {
        assert.equal(marks.length, 1);
        assert.deepEqual(textMark, {
          type: 'text',
          role: 'column-title',
          encode: {
            update: {
              x: {signal: `0.5 * width`},
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
          name: 'row-title',
          type: 'group',
          role: 'row-header'
        });
      });
      const textMark = marks[0];

      it('contains a correct text mark with the correct role and encode as the only item in marks', () => {
        assert.equal(marks.length, 1);
        assert.deepEqual(textMark, {
          type: 'text',
          role: 'row-title',
          encode: {
            update: {
              y: {signal: `0.5 * height`},
              text: {value: 'a'},
              angle: {value: 270},
              fontWeight: {value: 'bold'},
              align: {value: 'right'},
              fill: {value: 'black'}
            }
          }
        });
      });
    });
  });
});

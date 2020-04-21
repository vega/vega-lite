import {
  assembleHeaderGroups,
  assembleHeaderProperties,
  assembleLabelTitle,
  assembleTitleGroup,
  defaultHeaderGuideAlign,
  defaultHeaderGuideBaseline,
  getLayoutTitleBand
} from '../../../src/compile/header/assemble';
import {HEADER_CHANNELS} from '../../../src/compile/header/component';
import {
  HEADER_LABEL_PROPERTIES,
  HEADER_LABEL_PROPERTIES_MAP,
  HEADER_TITLE_PROPERTIES,
  HEADER_TITLE_PROPERTIES_MAP
} from '../../../src/header';
import {parseFacetModel} from '../../util';

describe('compile/header/index', () => {
  describe('defaultHeaderGuideAlign', () => {
    it('should return left for anchor=start', () => {
      for (const headerChannel of HEADER_CHANNELS) {
        expect(defaultHeaderGuideAlign(headerChannel, 0, 'start')).toEqual({align: 'left'});
      }
    });

    it('should return right for anchor=start', () => {
      for (const headerChannel of HEADER_CHANNELS) {
        expect(defaultHeaderGuideAlign(headerChannel, 0, 'end')).toEqual({align: 'right'});
      }
    });

    it('label aligns correctly according to angle for row', () => {
      expect(defaultHeaderGuideAlign('row', 0)).toEqual({align: 'right'});
      expect(defaultHeaderGuideAlign('row', 10)).toEqual({align: 'right'});
      expect(defaultHeaderGuideAlign('row', 135)).toEqual({align: 'left'});
      expect(defaultHeaderGuideAlign('row', 90)).toEqual({align: 'center'});
    });

    it('label aligns correctly according to angle for column', () => {
      expect(defaultHeaderGuideAlign('column', 0)).toEqual({});
      expect(defaultHeaderGuideAlign('column', 10)).toEqual({align: 'right'});
      expect(defaultHeaderGuideAlign('column', 350)).toEqual({align: 'left'});
    });
  });

  describe('labelBaseline', () => {
    it('label baseline adjusted according to angle for row', () => {
      expect(defaultHeaderGuideBaseline(0, 'row')).toEqual({baseline: 'middle'});
      expect(defaultHeaderGuideBaseline(90, 'row')).toEqual({baseline: 'top'});
    });

    it('label baseline adjusted according to angle for column', () => {
      expect(defaultHeaderGuideBaseline(0, 'column')).toEqual({baseline: 'bottom'});
      expect(defaultHeaderGuideBaseline(60, 'column')).toEqual({baseline: 'middle'});
    });
  });

  describe('getHeaderGroups', () => {
    it('should correctly process sort descending', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal', sort: 'ascending'},
          column: {field: 'a', type: 'ordinal', sort: 'descending'}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseScale();
      model.parseLayoutSize();
      model.parseAxesAndHeaders();

      const rowHeaderGroups = assembleHeaderGroups(model, 'row');
      const columnHeaderGroups = assembleHeaderGroups(model, 'column');
      expect(rowHeaderGroups[0].sort.order).toBe('ascending');
      expect(columnHeaderGroups[0].sort.order).toBe('descending');
    });

    it('should correctly process sort field', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'ordinal', sort: {field: 'd', op: 'min'}}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseScale();
      model.parseLayoutSize();
      model.parseAxesAndHeaders();

      const rowHeaderGroups = assembleHeaderGroups(model, 'row');
      expect(rowHeaderGroups[0].sort.field).toBe('datum["min_d"]');
    });
  });

  describe('getLayoutTitleBand', () => {
    it('should return 0 for column start', () => {
      expect(getLayoutTitleBand('start', 'column')).toEqual(0);
    });

    it('should return 1 for column end', () => {
      expect(getLayoutTitleBand('end', 'column')).toEqual(1);
    });
    it('should return 1 for row start', () => {
      expect(getLayoutTitleBand('start', 'row')).toEqual(1);
    });

    it('should return 0 for row end', () => {
      expect(getLayoutTitleBand('end', 'row')).toEqual(0);
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
    model.parseScale();
    model.parseLayoutSize();
    model.parseAxesAndHeaders();

    describe('for column', () => {
      const columnLabelGroup = assembleTitleGroup(model, 'column');
      const {title, ...columnTitleGroupTopLevelProps} = columnLabelGroup;
      it('returns a header group mark with correct name, role, and type.', () => {
        expect(columnTitleGroupTopLevelProps).toEqual({
          name: 'column-title',
          type: 'group',
          role: 'column-title'
        });
      });
      const name = title.text;
      it('contains a correct title definition, including the correct name and orientation', () => {
        expect(title).toEqual({
          text: name,
          offset: 10,
          style: 'guide-title'
        });
      });
    });

    describe('for row', () => {
      const rowTitleGroup = assembleTitleGroup(model, 'row');
      const {title, ...rowTitleGroupTopLevelProps} = rowTitleGroup;
      it('returns a header group mark with correct name, role, and type.', () => {
        expect(rowTitleGroupTopLevelProps).toEqual({
          name: 'row-title',
          type: 'group',
          role: 'row-title'
        });
      });
      const name = title.text;
      it('contains a correct title definition, including the correct name and orientation.', () => {
        expect(title).toEqual({
          text: name,
          offset: 10,
          orient: 'left',
          style: 'guide-title'
        });
      });
    });
  });

  describe('assembleHeaderProperties', () => {
    describe('for title properties', () => {
      const model = parseFacetModel({
        config: {header: {titleFontSize: 20}},
        facet: {
          row: {field: 'a', type: 'ordinal', header: {titleFontSize: 40}}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseScale();
      model.parseLayoutSize();
      model.parseAxesAndHeaders();
      const config = model.config;
      const facetFieldDef = model.component.layoutHeaders['row'].facetFieldDef;

      const headerTitleProps = assembleHeaderProperties(
        config,
        facetFieldDef,
        'column',
        HEADER_TITLE_PROPERTIES,
        HEADER_TITLE_PROPERTIES_MAP
      );
      it('should return the correct title property from header', () => {
        expect(headerTitleProps.fontSize).toEqual(40);
      });

      const configTitleProps = assembleHeaderProperties(
        config,
        undefined,
        'column',
        HEADER_TITLE_PROPERTIES,
        HEADER_TITLE_PROPERTIES_MAP
      );
      it('should return the correct title property from config', () => {
        expect(configTitleProps).toEqual({fontSize: 20, offset: 10});
      });

      const bothTitleProps = assembleHeaderProperties(
        config,
        facetFieldDef,
        'column',
        HEADER_TITLE_PROPERTIES,
        HEADER_TITLE_PROPERTIES_MAP
      );
      it('should overwrite the config title property with the header title property', () => {
        expect(bothTitleProps.fontSize).toEqual(40);
      });
    });

    describe('for label properties', () => {
      const model = parseFacetModel({
        config: {header: {labelFontSize: 20}},
        facet: {
          row: {field: 'a', type: 'ordinal', header: {labelFontSize: 40}}
        },
        spec: {
          mark: 'point',
          encoding: {
            x: {field: 'b', type: 'quantitative'},
            y: {field: 'c', type: 'quantitative'}
          }
        }
      });
      model.parseScale();
      model.parseLayoutSize();
      model.parseAxesAndHeaders();
      const config = model.config;
      const facetFieldDef = model.component.layoutHeaders['row'].facetFieldDef;

      const headerLabelProps = assembleHeaderProperties(
        config,
        facetFieldDef,
        'column',
        HEADER_LABEL_PROPERTIES,
        HEADER_LABEL_PROPERTIES_MAP
      );
      it('should return the correct label property from header', () => {
        expect(headerLabelProps.fontSize).toEqual(40);
      });

      const configLabelProps = assembleHeaderProperties(
        config,
        undefined,
        'column',
        HEADER_LABEL_PROPERTIES,
        HEADER_LABEL_PROPERTIES_MAP
      );
      it('should return the correct label property from config', () => {
        expect(configLabelProps).toEqual({fontSize: 20, offset: 10});
      });

      const bothLabelProps = assembleHeaderProperties(
        config,
        facetFieldDef,
        'column',
        HEADER_LABEL_PROPERTIES,
        HEADER_LABEL_PROPERTIES_MAP
      );
      it('should overwrite the config label property with the header label property', () => {
        expect(bothLabelProps.fontSize).toEqual(40);
      });
    });
  });

  describe('assembleLabelTitle', () => {
    it('correctly applies labelExpr', () => {
      const title = assembleLabelTitle(
        {field: 'foo', type: 'ordinal', header: {labelExpr: 'datum.label[0]'}},
        'column',
        {headerColumn: {format: 'd'}, header: {format: 'd'}}
      );

      expect(title.text).toEqual({signal: 'format(parent["foo"], "d")[0]'});
    });

    it('correctly applies custom format type', () => {
      const title = assembleLabelTitle(
        {field: 'foo', type: 'ordinal', header: {format: 'abc', formatType: 'foo'}},
        'column',
        {headerColumn: {format: 'd'}, header: {format: 'd'}, customFormatTypes: true}
      );
      expect(title.text).toEqual({signal: 'foo(parent["foo"], "abc")'});
    });

    it('correctly applies labelExpr when accessing the value', () => {
      const title = assembleLabelTitle(
        {field: 'foo', type: 'ordinal', header: {labelExpr: 'datum.value[0]'}},
        'column',
        {
          headerColumn: {format: 'd'},
          header: {format: 'd'}
        }
      );

      expect(title.text).toEqual({signal: 'parent["foo"][0]'});
    });
  });
});

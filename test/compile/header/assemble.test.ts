import {
  assembleHeaderGroups,
  assembleTitleGroup,
  getHeaderProperties,
  getLayoutTitleBand,
  labelAlign,
  labelBaseline,
  titleAlign
} from '../../../src/compile/header/assemble';
import {
  HEADER_LABEL_PROPERTIES,
  HEADER_LABEL_PROPERTIES_MAP,
  HEADER_TITLE_PROPERTIES,
  HEADER_TITLE_PROPERTIES_MAP
} from '../../../src/header';
import {parseFacetModel} from '../../util';

describe('compile/header/index', () => {
  describe('titleAlign', () => {
    it('should return left for anchor=start', () => {
      expect(titleAlign('start')).toEqual({align: 'left'});
    });

    it('should return right for anchor=start', () => {
      expect(titleAlign('end')).toEqual({align: 'right'});
    });
  });

  describe('labelAlign', () => {
    it('label aligns correctly according to angle', () => {
      expect(labelAlign(23)).toEqual({align: {value: 'right'}});
      expect(labelAlign(135)).toEqual({align: {value: 'left'}});
      expect(labelAlign(50)).toEqual({align: {value: 'right'}});
    });
  });

  describe('label baseline adjusted according to angle', () => {
    expect(labelBaseline(10)).toEqual({baseline: 'middle'});
    expect(labelBaseline(90)).toEqual({baseline: 'top'});
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
      expect(rowHeaderGroups[0].sort.order).toEqual('ascending');
      expect(columnHeaderGroups[0].sort.order).toEqual('descending');
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
      expect(rowHeaderGroups[0].sort.field).toEqual('datum["min_d"]');
    });
  });

  describe('getLayoutTitleBand', () => {
    it('should return 0 for start', () => {
      expect(getLayoutTitleBand('start')).toEqual(0);
    });

    it('should return 1 for end', () => {
      expect(getLayoutTitleBand('end')).toEqual(1);
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

  describe('getHeaderProperties', () => {
    describe('for title properties', () => {
      const titleSpec = parseFacetModel({
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
      titleSpec.parseScale();
      titleSpec.parseLayoutSize();
      titleSpec.parseAxesAndHeaders();
      const config = titleSpec.config;
      const facetFieldDef = titleSpec.component.layoutHeaders['row'].facetFieldDef;

      const headerTitleProps = getHeaderProperties(
        undefined,
        facetFieldDef,
        HEADER_TITLE_PROPERTIES,
        HEADER_TITLE_PROPERTIES_MAP
      );
      it('should return the correct title property from header', () => {
        expect(headerTitleProps).toEqual({fontSize: 40});
      });

      const configTitleProps = getHeaderProperties(
        config,
        undefined,
        HEADER_TITLE_PROPERTIES,
        HEADER_TITLE_PROPERTIES_MAP
      );
      it('should return the correct title property from config', () => {
        expect(configTitleProps).toEqual({fontSize: 20});
      });

      const bothTitleProps = getHeaderProperties(
        config,
        facetFieldDef,
        HEADER_TITLE_PROPERTIES,
        HEADER_TITLE_PROPERTIES_MAP
      );
      it('should overwrite the config title property with the header title property', () => {
        expect(bothTitleProps).toEqual({fontSize: 40});
      });
    });

    describe('for label properties', () => {
      const labelSpec = parseFacetModel({
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
      labelSpec.parseScale();
      labelSpec.parseLayoutSize();
      labelSpec.parseAxesAndHeaders();
      const config = labelSpec.config;
      const facetFieldDef = labelSpec.component.layoutHeaders['row'].facetFieldDef;

      const headerLabelProps = getHeaderProperties(
        undefined,
        facetFieldDef,
        HEADER_LABEL_PROPERTIES,
        HEADER_LABEL_PROPERTIES_MAP
      );
      it('should return the correct label property from header', () => {
        expect(headerLabelProps).toEqual({fontSize: 40});
      });

      const configLabelProps = getHeaderProperties(
        config,
        undefined,
        HEADER_LABEL_PROPERTIES,
        HEADER_LABEL_PROPERTIES_MAP
      );
      it('should return the correct label property from config', () => {
        expect(configLabelProps).toEqual({fontSize: 20});
      });

      const bothLabelProps = getHeaderProperties(
        config,
        facetFieldDef,
        HEADER_LABEL_PROPERTIES,
        HEADER_LABEL_PROPERTIES_MAP
      );
      it('should overwrite the config label property with the header label property', () => {
        expect(bothLabelProps).toEqual({fontSize: 40});
      });
    });
  });
});

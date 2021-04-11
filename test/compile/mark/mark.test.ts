import {getSort, parseMarkGroups} from '../../../src/compile/mark/mark';
import {UnitModel} from '../../../src/compile/unit';
import {GEOSHAPE} from '../../../src/mark';
import {
  parseFacetModel,
  parseUnitModel,
  parseUnitModelWithScale,
  parseUnitModelWithScaleAndLayoutSize,
  parseConcatModel,
  parseUnitModelWithScaleAndSelection
} from '../../util';

describe('Mark', () => {
  describe('parseMarkGroup', () => {
    // PATH
    describe('Multi-series Line', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {type: 'line', style: 'trend'},
        encoding: {
          x: {field: 'date', type: 'temporal', axis: {format: '%Y'}},
          y: {field: 'price', type: 'quantitative'},
          color: {field: 'symbol', type: 'nominal'}
        }
      });
      it('should have a facet directive and a nested mark group that uses the faceted data.', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.name).toBe('pathgroup');
        expect(markGroup.from).toEqual({
          facet: {
            name: 'faceted_path_main',
            data: 'main',
            groupby: ['symbol']
          }
        });
        const submarkGroup = markGroup.marks[0];
        expect(submarkGroup.name).toBe('marks');
        expect(submarkGroup.type).toBe('line');
        expect(submarkGroup.style).toEqual(['line', 'trend']);
        expect(submarkGroup.from.data).toBe('faceted_path_main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.name).toBe('pathgroup');
        expect(markGroup.from).toEqual({
          facet: {
            name: 'faceted_path_main',
            data: 'main',
            groupby: ['symbol']
          }
        });
        const submarkGroup = markGroup.marks[0];
        expect(submarkGroup.transform).not.toBeDefined();
      });
    });

    describe('Single Line', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'line',
        encoding: {
          x: {field: 'date', type: 'temporal', axis: {format: '%Y'}},
          y: {field: 'price', type: 'quantitative'}
        }
      });
      it('should have mark group with proper data and key', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.name).toBe('marks');
        expect(markGroup.type).toBe('line');
        expect(markGroup.from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).not.toBeDefined();
      });

      // NON-PATH
    });
    describe('Points with key', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'point',
        encoding: {
          x: {field: 'date', type: 'temporal', axis: {format: '%Y'}},
          y: {field: 'price', type: 'quantitative'},
          key: {field: 'k', type: 'quantitative'}
        }
      });
      it('should have mark group with proper data and key', () => {
        const markGroup = parseMarkGroups(model)[0];
        expect(markGroup.type).toBe('symbol');
        expect(markGroup.key).toBe('k');
        expect(markGroup.from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).not.toBeDefined();
      });
    });

    it('Geoshape should have post encoding transform', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        projection: {
          type: 'albersUsa'
        },
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states'
          }
        },
        encoding: {}
      });
      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].transform).toBeDefined();
      expect(markGroup[0].transform[0].type).toEqual(GEOSHAPE);
    });

    describe('Aggregated Bar with a color with binned x', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'quantitative', field: 'Cost__Other', aggregate: 'sum'},
          y: {bin: true, type: 'quantitative', field: 'Cost__Total_$'},
          color: {type: 'ordinal', field: 'Effect__Amount_of_damage'}
        }
      });
      it('should use main stacked data source', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].from.data).toBe('main');
        expect(markGroup[0].style).toEqual(['bar']);
      });
      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).not.toBeDefined();
      });
    });

    describe('Faceted aggregated Bar with a color with binned x', () => {
      const model = parseFacetModel({
        facet: {
          row: {field: 'a', type: 'nominal'}
        },
        spec: {
          mark: 'bar',
          encoding: {
            x: {type: 'quantitative', field: 'Cost__Other', aggregate: 'sum'},
            y: {bin: true, type: 'quantitative', field: 'Cost__Total_$'},
            color: {type: 'ordinal', field: 'Effect__Amount_of_damage'}
          }
        }
      });
      it('should use faceted data source', () => {
        model.parseScale();
        model.parseLayoutSize();

        const markGroup = parseMarkGroups(model.child as UnitModel);
        expect(markGroup[0].from.data).toBe('child_main');
      });

      it('should not have post encoding transform', () => {
        model.parseScale();
        model.parseLayoutSize();

        const markGroup = parseMarkGroups(model.child as UnitModel);
        expect(markGroup[0].transform).not.toBeDefined();
      });
    });

    describe('Aggregated bar', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'bar',
        encoding: {
          x: {type: 'quantitative', field: 'Cost__Other', aggregate: 'sum'},
          y: {bin: true, type: 'quantitative', field: 'Cost__Total_$'}
        }
      });

      it('should use main aggregated data source', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].transform).not.toBeDefined();
      });
    });

    it('should set aria to false for bar mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          aria: false
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'}
        }
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].aria).toBe(false);
    });

    it('should set aria to false for rounded bar mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          aria: false,
          cornerRadius: 2
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'}
        }
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].marks[0].marks[0].aria).toBe(false);
    });

    it('should set aria to false for line mark', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'line',
          aria: false
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'}
        }
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].aria).toBe(false);
    });

    it('should group mark with corder radius by nominal field', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: {
          type: 'bar',
          cornerRadius: 2
        },
        encoding: {
          x: {type: 'quantitative', field: 'foo'},
          y: {type: 'nominal', field: 'bar'}
        }
      });

      const markGroup = parseMarkGroups(model);
      expect(markGroup[0].from.facet.groupby).toEqual(['bar']);
    });

    describe('interactiveFlag', () => {
      it('should not contain flag if no selections', () => {
        const model = parseUnitModelWithScaleAndSelection({
          mark: 'point',
          encoding: {
            x: {type: 'quantitative', field: 'foo'},
            y: {type: 'nominal', field: 'bar'}
          }
        });

        const markGroup = parseMarkGroups(model);
        expect(markGroup[0].interactive).toBeUndefined();
      });

      it('should be true for units with a selection', () => {
        const model = parseConcatModel({
          vconcat: [
            {
              params: [{name: 'brush', select: 'interval'}],
              mark: 'point',
              encoding: {
                x: {type: 'quantitative', field: 'foo'},
                y: {type: 'nominal', field: 'bar'}
              }
            },
            {
              mark: 'point',
              encoding: {
                x: {type: 'ordinal', field: 'baz'},
                y: {type: 'quantitative', field: 'world'}
              }
            }
          ]
        });

        model.parseScale();
        model.parseSelections();
        model.parseMarkGroup();
        expect(model.children[0].component.mark[0].interactive).toBeTruthy();
        expect(model.children[1].component.mark[0].interactive).toBeFalsy();
      });

      it('should be true for units with a selection or tooltip', () => {
        const model = parseConcatModel({
          vconcat: [
            {
              params: [{name: 'brush', select: {type: 'interval'}}],
              mark: 'point',
              encoding: {
                x: {type: 'quantitative', field: 'foo'},
                y: {type: 'nominal', field: 'bar'}
              }
            },
            {
              mark: 'point',
              encoding: {
                x: {type: 'ordinal', field: 'baz'},
                y: {type: 'quantitative', field: 'world'},
                tooltip: {type: 'nominal', field: 'hello'}
              }
            }
          ]
        });

        model.parseScale();
        model.parseSelections();
        model.parseMarkGroup();
        expect(model.children[0].component.mark[0].interactive).toBeTruthy();
        expect(model.children[1].component.mark[0].interactive).toBeTruthy();
      });
    });
  });

  describe('getSort', () => {
    it('should order by order field', () => {
      const model = parseUnitModel({
        data: {url: 'data/driving.json'},
        mark: 'line',
        encoding: {
          x: {field: 'miles', type: 'quantitative', scale: {zero: false}},
          y: {field: 'gas', type: 'quantitative', scale: {zero: false}},
          order: {field: 'year', type: 'temporal'}
        }
      });
      expect(getSort(model)).toEqual({
        field: ['datum["year"]'],
        order: ['ascending']
      });
    });

    it('should have no sort if order = {value: null}', () => {
      const model = parseUnitModel({
        data: {url: 'data/driving.json'},
        mark: 'line',
        encoding: {
          x: {field: 'miles', type: 'quantitative', scale: {zero: false}},
          y: {field: 'gas', type: 'quantitative', scale: {zero: false}},
          order: {value: null}
        }
      });
      expect(getSort(model)).toBeUndefined();
    });

    it('should order by x by default if x is the dimension', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            bin: {maxbins: 10},
            field: 'IMDB_Rating',
            type: 'quantitative'
          },
          color: {
            field: 'Source',
            type: 'nominal'
          },
          y: {
            aggregate: 'count',
            type: 'quantitative'
          }
        }
      });
      expect(getSort(model)).toEqual({
        field: 'datum["bin_maxbins_10_IMDB_Rating"]'
      });
    });

    it('have no sort if the dimension field has sort:null', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            field: 'a',
            type: 'nominal',
            sort: null
          },
          color: {
            field: 'Source',
            type: 'nominal'
          },
          y: {
            aggregate: 'count',
            type: 'quantitative'
          }
        }
      });
      expect(getSort(model)).toBeUndefined();
    });

    it("should order by x's custom sort order by default if x is the dimension", () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            type: 'nominal',
            field: 'Name',
            sort: ['Peter', 'Mary', 'Paul']
          },
          y: {type: 'quantitative', field: 'Score'}
        }
      });
      expect(getSort(model)).toEqual({
        field: 'datum["x_Name_sort_index"]'
      });
    });

    it('should order by the right channel when sort by encoding', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          x: {
            type: 'nominal',
            field: 'Name',
            sort: 'y'
          },
          y: {type: 'quantitative', field: 'Score'}
        }
      });
      expect(getSort(model)).toEqual({
        field: 'datum["Score"]'
      });
    });

    it('should not order by a missing dimension', () => {
      const model = parseUnitModelWithScale({
        data: {url: 'data/movies.json'},
        mark: 'line',
        encoding: {
          color: {
            field: 'Source',
            type: 'nominal'
          },
          y: {
            aggregate: 'count',
            type: 'quantitative'
          }
        }
      });
      expect(getSort(model)).toBeUndefined();
    });
  });

  describe('projection clipping', () => {
    it('should not clip if auto-fit', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        projection: {
          type: 'albersUsa'
        },
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states'
          }
        },
        encoding: {
          color: {
            value: 'black'
          },
          opacity: {
            value: 0.8
          }
        },
        config: {mark: {tooltip: null}}
      });
      model.parse();
      const mark = parseMarkGroups(model);
      expect(mark[0].clip).toBeUndefined();
    });
    it('should clip if auto-fit', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        projection: {
          type: 'albersUsa',
          scale: 1000
        },
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states'
          }
        },
        encoding: {
          color: {
            value: 'black'
          },
          opacity: {
            value: 0.8
          }
        },
        config: {mark: {tooltip: null}}
      });
      model.parse();
      const mark = parseMarkGroups(model);
      expect(mark[0].clip).toBe(true);
    });
  });
});

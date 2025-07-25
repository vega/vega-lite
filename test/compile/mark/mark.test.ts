import {getLabelMark, getSort, parseMarkGroupsAndLabels} from '../../../src/compile/mark/mark';
import {UnitModel} from '../../../src/compile/unit';
import * as log from '../../../src/log';
import {GEOSHAPE} from '../../../src/mark';
import {
  parseConcatModel,
  parseFacetModel,
  parseUnitModel,
  parseUnitModelWithScale,
  parseUnitModelWithScaleAndLayoutSize,
  parseUnitModelWithScaleAndSelection
} from '../../util';

describe('Mark', () => {
  describe('parseMarkGroupAndLabels', () => {
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
        const markGroup = parseMarkGroupsAndLabels(model).mark[0];
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
        const markGroup = parseMarkGroupsAndLabels(model).mark[0];
        expect(markGroup.name).toBe('pathgroup');
        expect(markGroup.from).toEqual({
          facet: {
            name: 'faceted_path_main',
            data: 'main',
            groupby: ['symbol']
          }
        });
        const submarkGroup = markGroup.marks[0];
        expect(submarkGroup.transform).toBeUndefined();
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
        const markGroup = parseMarkGroupsAndLabels(model).mark[0];
        expect(markGroup.name).toBe('marks');
        expect(markGroup.type).toBe('line');
        expect(markGroup.from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroupsAndLabels(model).mark;
        expect(markGroup[0].transform).toBeUndefined();
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
        const markGroup = parseMarkGroupsAndLabels(model).mark[0];
        expect(markGroup.type).toBe('symbol');
        expect(markGroup.key).toBe('k');
        expect(markGroup.from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroupsAndLabels(model).mark;
        expect(markGroup[0].transform).toBeUndefined();
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
      const markGroup = parseMarkGroupsAndLabels(model).mark;
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
        const markGroup = parseMarkGroupsAndLabels(model).mark;
        expect(markGroup[0].from.data).toBe('main');
        expect(markGroup[0].style).toEqual(['bar']);
      });
      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroupsAndLabels(model).mark;
        expect(markGroup[0].transform).toBeUndefined();
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

        const markGroup = parseMarkGroupsAndLabels(model.child as UnitModel).mark;
        expect(markGroup[0].from.data).toBe('child_main');
      });

      it('should not have post encoding transform', () => {
        model.parseScale();
        model.parseLayoutSize();

        const markGroup = parseMarkGroupsAndLabels(model.child as UnitModel).mark;
        expect(markGroup[0].transform).toBeUndefined();
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
        const markGroup = parseMarkGroupsAndLabels(model).mark;
        expect(markGroup[0].from.data).toBe('main');
      });

      it('should not have post encoding transform', () => {
        const markGroup = parseMarkGroupsAndLabels(model).mark;
        expect(markGroup[0].transform).toBeUndefined();
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

      const markGroup = parseMarkGroupsAndLabels(model).mark;
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

      const markGroup = parseMarkGroupsAndLabels(model).mark;
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

      const markGroup = parseMarkGroupsAndLabels(model).mark;
      expect(markGroup[0].aria).toBe(false);
    });

    it('should group mark with corner radius by nominal field', () => {
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

      const markGroup = parseMarkGroupsAndLabels(model).mark;
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

        const markGroup = parseMarkGroupsAndLabels(model).mark;
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

    describe('parse labels', () => {
      it('should parse mark and label saparately', () => {
        const model = parseUnitModelWithScale({
          mark: 'bar',
          encoding: {
            x: {type: 'quantitative', field: 'foo'},
            y: {type: 'nominal', field: 'bar'},
            label: {type: 'nominal', field: 'bar2', avoid: {ancestor: 1}}
          }
        });
        const {label} = parseMarkGroupsAndLabels(model);
        expect(label).toEqual({
          name: 'marks_label',
          type: 'text',
          style: ['text'],
          from: {data: 'marks'},
          encode: {
            update: {
              fill: {value: 'black'},
              description: {signal: '"bar2: " + (isValid(datum["bar2"]) ? datum["bar2"] : ""+datum["bar2"])'},
              text: {signal: 'isValid(datum.datum["bar2"]) ? datum.datum["bar2"] : ""+datum.datum["bar2"]'}
            }
          },
          transform: [{type: 'label', size: {signal: '[width, height]'}, anchor: ['right', 'right'], offset: [2, -2]}]
        });
      });

      it(
        'should parse mark with label when the mark is stacked bar with rounded corner with a warning',
        log.wrap(localLogger => {
          const model = parseUnitModelWithScale({
            mark: {
              type: 'bar',
              cornerRadius: 2
            },
            encoding: {
              x: {type: 'quantitative', field: 'foo'},
              y: {type: 'nominal', field: 'bar'},
              label: {type: 'nominal', field: 'bar2', avoid: {ancestor: 1}}
            }
          });
          const {mark, label} = parseMarkGroupsAndLabels(model);
          expect(label).toBeFalsy();
          expect(mark[0].marks[0].marks[1]).toEqual({
            name: 'marks_label',
            type: 'text',
            style: ['text'],
            from: {data: 'marks'},
            encode: {
              update: {
                fill: {value: 'black'},
                description: {signal: '"bar2: " + (isValid(datum["bar2"]) ? datum["bar2"] : ""+datum["bar2"])'},
                text: {signal: 'isValid(datum.datum["bar2"]) ? datum.datum["bar2"] : ""+datum.datum["bar2"]'}
              }
            },
            transform: [{type: 'label', size: {signal: '[width, height]'}, anchor: ['right', 'right'], offset: [2, -2]}]
          });
          expect(localLogger.warns[0]).toEqual(log.message.ROUNDED_CORNERS_STACKED_BAR_WITH_AVOID);
        })
      );
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
      const mark = parseMarkGroupsAndLabels(model).mark;
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
      const mark = parseMarkGroupsAndLabels(model).mark;
      expect(mark[0].clip).toBe(true);
    });
  });

  describe('getLabel', () => {
    it('should return empty array when a model does not encode label', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {x: {type: 'nominal', field: 'col'}}
      });
      const label = getLabelMark(model, 'anything');
      expect(label).toBeFalsy();
    });

    it(
      'should warn when getLabel on a mark that does not support label',
      log.wrap(localLogger => {
        const model = parseUnitModel({
          mark: 'arc',
          encoding: {x: {type: 'nominal', field: 'col'}}
        });
        model.encoding.label = {type: 'nominal', field: 'col'};
        const label = getLabelMark(model, 'anything');
        expect(label).toBeFalsy();
        expect(localLogger.warns[0]).toEqual(log.message.incompatibleChannel('label', 'arc'));
      })
    );

    describe('default label-transform config', () => {
      it('should have correct default label-transform config for area', () => {
        const model = parseUnitModelWithScale({
          mark: 'area',
          encoding: {label: {type: 'nominal', field: 'col'}}
        });

        const label = getLabelMark(model, 'anything');
        expect(label.transform[0]).toStrictEqual({
          type: 'label',
          size: {signal: '[width, height]'},
          method: 'reduced-search'
        });
      });

      it('should have correct default label-transform config for bar (horizontal)', () => {
        const model = parseUnitModelWithScale({
          mark: 'bar',
          encoding: {
            x: {type: 'nominal', field: 'col1'},
            y: {type: 'quantitative', field: 'col2'},
            label: {type: 'nominal', field: 'col'}
          }
        });

        const label = getLabelMark(model, 'anything');
        expect(label.transform[0]).toStrictEqual({
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['top', 'top'],
          offset: [2, -2]
        });
      });

      it('should have correct default label-transform config for bar (vertical)', () => {
        const model = parseUnitModelWithScale({
          mark: 'bar',
          encoding: {
            y: {type: 'nominal', field: 'col1'},
            x: {type: 'quantitative', field: 'col2'},
            label: {type: 'nominal', field: 'col'}
          }
        });

        const label = getLabelMark(model, 'anything');
        expect(label.transform[0]).toStrictEqual({
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['right', 'right'],
          offset: [2, -2]
        });
      });

      it('should have correct default label-transform config for bar (stacked)', () => {
        const model = parseUnitModelWithScale({
          mark: 'bar',
          encoding: {
            y: {type: 'nominal', field: 'col1'},
            x: {type: 'quantitative', field: 'col2'},
            color: {type: 'quantitative', field: 'col3'},
            label: {type: 'nominal', field: 'col'}
          }
        });

        const label = getLabelMark(model, 'anything');
        expect(label.transform[0]).toStrictEqual({
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['middle'],
          offset: [0]
        });
      });

      (['line', 'trail'] as const).forEach(mark => {
        it(`should have correct default lineAnchor for ${mark}`, () => {
          const model = parseUnitModelWithScale({
            mark,
            encoding: {
              x: {type: 'nominal', field: 'col1'},
              y: {type: 'quantitative', field: 'col2'},
              color: {type: 'quantitative', field: 'col3'},
              label: {type: 'nominal', field: 'col'}
            }
          });

          const label = getLabelMark(model, 'anything');
          expect(label.transform[0].lineAnchor).toBe('end');
          expect(label.encode.update.fill).toStrictEqual({field: 'col3', scale: 'color'});
          expect(label.encode.update.text).toStrictEqual({
            signal: 'isValid(datum.datum["col"]) ? datum.datum["col"] : ""+datum.datum["col"]'
          });
        });

        it(`should correctly inherit default encoding channels for ${mark}`, () => {
          const model = parseUnitModelWithScale({
            mark,
            encoding: {
              x: {type: 'nominal', field: 'col1'},
              y: {type: 'quantitative', field: 'col2'},
              color: {type: 'quantitative', field: 'col3'},
              fill: {type: 'quantitative', field: 'col4'},
              stroke: {type: 'quantitative', field: 'col5'},
              opacity: {type: 'quantitative', field: 'col6'},
              fillOpacity: {type: 'quantitative', field: 'col7'},
              strokeOpacity: {type: 'quantitative', field: 'col8'},
              strokeWidth: {type: 'quantitative', field: 'col9'},
              strokeDash: {type: 'quantitative', field: 'col10'},
              tooltip: {type: 'quantitative', field: 'col11'},
              href: {type: 'quantitative', field: 'col12'},
              description: {type: 'quantitative', field: 'col14'},
              label: {type: 'nominal', field: 'col'}
            }
          });

          const label = getLabelMark(model, 'anything');
          expect(label.transform[0].lineAnchor).toBe('end');
          expect(label.encode.update).toStrictEqual({
            description: {
              signal:
                '"col3: " + (format(datum["col3"], "")) + "; col6: " + (format(datum["col6"], "")) + "; col: " + (isValid(datum["col"]) ? datum["col"] : ""+datum["col"])'
            },
            fill: {field: 'col3', scale: 'color'},
            opacity: {field: 'col6', scale: 'opacity'},
            text: {signal: 'isValid(datum.datum["col"]) ? datum.datum["col"] : ""+datum.datum["col"]'}
          });
        });

        it(`should correctly inherit encoding channel for ${mark} as specified by users`, () => {
          const model = parseUnitModelWithScale({
            mark,
            encoding: {
              x: {type: 'nominal', field: 'col1'},
              y: {type: 'quantitative', field: 'col2'},
              color: {type: 'quantitative', field: 'col3'},
              fill: {type: 'quantitative', field: 'col4'},
              stroke: {type: 'quantitative', field: 'col5'},
              opacity: {type: 'quantitative', field: 'col6'},
              fillOpacity: {type: 'quantitative', field: 'col7'},
              strokeOpacity: {type: 'quantitative', field: 'col8'},
              strokeWidth: {type: 'quantitative', field: 'col9'},
              strokeDash: {type: 'quantitative', field: 'col10'},
              tooltip: {type: 'quantitative', field: 'col11'},
              href: {type: 'quantitative', field: 'col12'},
              description: {type: 'quantitative', field: 'col14'},
              label: {type: 'nominal', field: 'col', inherit: ['color', 'opacity', 'href']}
            }
          });

          const label = getLabelMark(model, 'anything');
          expect(label.transform[0].lineAnchor).toBe('end');
          expect(label.encode.update).toStrictEqual({
            cursor: {value: 'pointer'},
            description: {
              signal:
                '"col3: " + (format(datum["col3"], "")) + "; col6: " + (format(datum["col6"], "")) + "; col: " + (isValid(datum["col"]) ? datum["col"] : ""+datum["col"]) + "; col12: " + (format(datum["col12"], ""))'
            },
            fill: {field: 'col3', scale: 'color'},
            href: {signal: 'format(datum["col12"], "")'},
            opacity: {field: 'col6', scale: 'opacity'},
            text: {signal: 'isValid(datum.datum["col"]) ? datum.datum["col"] : ""+datum.datum["col"]'}
          });
        });

        it(`should have correct default label-transform config for ${mark} (begin - vertical)`, () => {
          const model = parseUnitModelWithScale({
            mark,
            encoding: {
              x: {type: 'nominal', field: 'col1'},
              y: {type: 'quantitative', field: 'col2'},
              color: {type: 'quantitative', field: 'col3'},
              label: {type: 'nominal', field: 'col', lineAnchor: 'begin'}
            }
          });

          const label = getLabelMark(model, 'anything');
          expect(model.markDef.orient).toBe('vertical');
          expect(label.transform[0]).toStrictEqual({
            type: 'label',
            size: {signal: '[width, height]'},
            padding: null,
            lineAnchor: 'begin',
            anchor: ['top-left', 'left', 'bottom-left'],
            offset: [2, 2, 2]
          });
        });

        it(`should have correct default label-transform config for ${mark} (end - vertical)`, () => {
          const model = parseUnitModelWithScale({
            mark,
            encoding: {
              x: {type: 'nominal', field: 'col1'},
              y: {type: 'quantitative', field: 'col2'},
              color: {type: 'quantitative', field: 'col3'},
              label: {type: 'nominal', field: 'col', lineAnchor: 'end'}
            }
          });

          const label = getLabelMark(model, 'anything');
          expect(model.markDef.orient).toBe('vertical');
          expect(label.transform[0]).toStrictEqual({
            type: 'label',
            size: {signal: '[width, height]'},
            padding: null,
            lineAnchor: 'end',
            anchor: ['top-right', 'right', 'bottom-right'],
            offset: [2, 2, 2]
          });
        });
      });

      (['circle', 'point', 'square'] as const).forEach(mark => {
        it(`should have correct default label-transform config for ${mark}`, () => {
          const model = parseUnitModelWithScale({
            mark,
            encoding: {
              label: {type: 'nominal', field: 'col'}
            }
          });

          const label = getLabelMark(model, 'anything');
          expect(label.transform[0]).toStrictEqual({
            type: 'label',
            size: {signal: '[width, height]'},
            anchor: ['top-right', 'top', 'top-left', 'left', 'bottom-left', 'bottom', 'bottom-right', 'middle'],
            offset: [2, 2, 2, 2, 2, 2, 2, 2, 2]
          });
        });
      });

      it('should have correct default label-transform config for rect', () => {
        const model = parseUnitModelWithScale({
          mark: 'rect',
          encoding: {
            label: {type: 'nominal', field: 'col'}
          }
        });

        const label = getLabelMark(model, 'anything');
        expect(label.transform[0]).toStrictEqual({
          type: 'label',
          size: {signal: '[width, height]'},
          anchor: ['middle'],
          offset: [0]
        });
      });
    });
  });
});

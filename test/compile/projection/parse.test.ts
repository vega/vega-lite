import {parseLayerModel, parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('src/compile/projection/parse', () => {
  describe('parseUnitProjection', () => {
    it('should create projection from specified projection', () => {
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
      model.parse();
      expect(model.component.projection.isFit).toBe(true);
      expect(typeof model.component.projection.data[0]).toBe('string');
      expect(model.component.projection.size).toEqual([{signal: 'width'}, {signal: 'height'}]);
      expect(model.component.projection.explicit).toEqual({type: 'albersUsa'});
    });

    it('should create projection with no props', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states'
          }
        },
        encoding: {}
      });
      model.parse();
      expect(model.component.projection.explicit).toEqual({});
      expect(model.component.projection.implicit).toEqual({name: 'projection', type: 'equalEarth'});
    });

    it('should create projection from config', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states'
          }
        },
        encoding: {},
        config: {
          projection: {
            type: 'albersUsa'
          }
        }
      });
      model.parse();
      expect(model.component.projection.explicit).toEqual({type: 'albersUsa'});
    });

    it('should add data with signal', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        data: {
          url: 'data/airports.csv',
          format: {
            type: 'csv'
          }
        },
        mark: 'circle',
        projection: {
          type: 'albersUsa'
        },
        encoding: {
          longitude: {
            field: 'longitude',
            type: 'quantitative'
          },
          latitude: {
            field: 'latitude',
            type: 'quantitative'
          }
        }
      });
      model.parse();
      expect(typeof model.component.projection.data[0]).toBe('object');
      expect(model.component.projection.data[0]).toHaveProperty('signal');
    });

    it('should add data from main', () => {
      const model = parseUnitModelWithScaleAndLayoutSize({
        mark: 'geoshape',
        data: {
          url: 'data/us-10m.json',
          format: {
            type: 'topojson',
            feature: 'states'
          }
        },
        encoding: {}
      });
      model.parse();
      expect(typeof model.component.projection.data[0]).toBe('string');
      expect(typeof model.component.projection.data[0]).not.toBe('object');
    });
  });

  it('should create projection from specified projection with scale', () => {
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
      encoding: {}
    });
    model.parse();
    expect(model.component.projection.isFit).toBe(false);
    expect(model.component.projection.data).toBeUndefined();
    expect(model.component.projection.size).toBeUndefined();
    expect(model.component.projection.explicit).toEqual({type: 'albersUsa', scale: 1000});
  });

  it('should create projection from specified projection with translate', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      mark: 'geoshape',
      projection: {
        type: 'albersUsa',
        translate: [100, 100]
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
    model.parse();
    expect(model.component.projection.isFit).toBe(false);
    expect(model.component.projection.data).toBeUndefined();
    expect(model.component.projection.size).toBeUndefined();
    expect(model.component.projection.explicit).toEqual({type: 'albersUsa', translate: [100, 100]});
  });

  describe('parseNonUnitProjection', () => {
    it('should merge the same projection', () => {
      const model = parseLayerModel({
        layer: [
          {
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
          },
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa'
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      model.parse();
      expect(model.component.projection.isFit).toBe(true);
      expect(model.component.projection.explicit).toEqual({type: 'albersUsa'});
    });

    it('should merge the same projection with custom scale', () => {
      const model = parseLayerModel({
        layer: [
          {
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
            encoding: {}
          },
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa',
              scale: 1000
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      model.parse();
      expect(model.component.projection.isFit).toBe(false);
      expect(model.component.projection.explicit).toEqual({type: 'albersUsa', scale: 1000});
    });

    it('should merge the same projection with custom translate', () => {
      const model = parseLayerModel({
        layer: [
          {
            mark: 'geoshape',
            projection: {
              type: 'albersUsa',
              translate: [100, 100]
            },
            data: {
              url: 'data/us-10m.json',
              format: {
                type: 'topojson',
                feature: 'states'
              }
            },
            encoding: {}
          },
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa',
              translate: [100, 100]
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      model.parse();
      expect(model.component.projection.isFit).toBe(false);
      expect(model.component.projection.explicit).toEqual({type: 'albersUsa', translate: [100, 100]});
    });

    it('should merge in empty projection to specified projection', () => {
      const emptyFirst = parseLayerModel({
        layer: [
          {
            mark: 'geoshape',
            data: {
              url: 'data/us-10m.json',
              format: {
                type: 'topojson',
                feature: 'states'
              }
            },
            encoding: {}
          },
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa'
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      emptyFirst.parse();
      expect(emptyFirst.component.projection.explicit).toEqual({type: 'albersUsa'});
      const emptyLast = parseLayerModel({
        layer: [
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa'
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          },
          {
            mark: 'geoshape',
            data: {
              url: 'data/us-10m.json',
              format: {
                type: 'topojson',
                feature: 'states'
              }
            },
            encoding: {}
          }
        ]
      });
      emptyLast.parse();
      expect(emptyLast.component.projection.explicit).toEqual({type: 'albersUsa'});
    });

    it('should merge projections with same size, different data', () => {
      const model = parseLayerModel({
        layer: [
          {
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
          },
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa'
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      model.parse();
      expect(model.component.projection.explicit).toEqual({type: 'albersUsa'});
    });

    it('should not merge different specified projections', () => {
      const model = parseLayerModel({
        layer: [
          {
            mark: 'geoshape',
            projection: {
              type: 'mercator'
            },
            data: {
              url: 'data/us-10m.json',
              format: {
                type: 'topojson',
                feature: 'states'
              }
            },
            encoding: {}
          },
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa'
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      model.parse();
      expect(model.component.projection).toBeUndefined();
    });

    it('should not merge fit and custom projections', () => {
      const model = parseLayerModel({
        layer: [
          {
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
            encoding: {}
          },
          {
            data: {
              url: 'data/airports.csv'
            },
            mark: 'circle',
            projection: {
              type: 'albersUsa'
            },
            encoding: {
              longitude: {
                field: 'longitude',
                type: 'quantitative'
              },
              latitude: {
                field: 'latitude',
                type: 'quantitative'
              }
            }
          }
        ]
      });
      model.parse();
      expect(model.component.projection).toBeUndefined();
    });
  });
});

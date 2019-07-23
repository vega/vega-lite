import {compile} from '../../src/compile/compile';
import * as log from '../../src/log';

describe('compile/compile', () => {
  it('should throw error for invalid spec', () => {
    expect(() => {
      compile({} as any);
    }).toThrow();
  });

  it('should return a spec with default top-level properties, size signals, data, marks, and title', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.padding).toEqual(5);
    expect(spec.autosize).toBe('pad');
    expect(spec.width).toEqual(20);
    expect(spec.height).toEqual(20);
    expect(spec.title).toEqual({text: 'test', frame: 'group'});

    expect(spec.data.length).toEqual(1); // just source
    expect(spec.marks.length).toEqual(1); // just the root group
  });

  it('should return a spec with specified top-level properties, size signals, data and marks', () => {
    const spec = compile({
      padding: 123,
      data: {
        values: [{a: 'A', b: 28}]
      },
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.padding).toEqual(123);
    expect(spec.autosize).toBe('pad');
    expect(spec.width).toEqual(20);
    expect(spec.height).toEqual(20);

    expect(spec.data.length).toEqual(1); // just source.
    expect(spec.marks.length).toEqual(1); // just the root group
  });

  it('should drop fit in top-level properties for discrete x discrete chart', () => {
    const spec = compile({
      data: {
        values: [{x: 'foo', y: 'bar'}]
      },
      autosize: 'fit',
      mark: 'point',
      encoding: {
        x: {field: 'x', type: 'nominal'},
        y: {field: 'y', type: 'nominal'}
      }
    }).spec;

    expect(spec.autosize).toBe('pad');
  });

  it('should drop fit-y in top-level properties for quantitative x discrete chart', () => {
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 1, y: 'bar'}]
        },
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'quantitative'},
          y: {field: 'y', type: 'nominal'}
        }
      }).spec;

      expect(localLogger.warns[0]).toEqual(log.message.droppingFit());
      expect(spec.autosize).toBe('fit-x');
    });
  });

  it('should drop fit-y in top-level properties for quantitative x discrete chart', () => {
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 1, y: 'bar'}]
        },
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'quantitative'},
          y: {field: 'y', type: 'nominal'}
        }
      }).spec;

      expect(localLogger.warns[0]).toEqual(log.message.droppingFit('y'));
      expect(spec.autosize).toBe('fit-x');
    });
  });

  it('should drop fit-x in top-level properties for discrete x quantitative chart', () => {
    log.wrap(localLogger => {
      const spec = compile({
        data: {
          values: [{x: 'foo', y: 1}]
        },
        autosize: 'fit',
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'nominal'},
          y: {field: 'y', type: 'quantitative'}
        }
      }).spec;

      expect(localLogger.warns[0]).toEqual(log.message.droppingFit('x'));
      expect(spec.autosize).toBe('fit-y');
    });
  });

  it('should use size signal for bar chart width', () => {
    const spec = compile({
      data: {values: [{a: 'A', b: 28}]},
      mark: 'bar',
      encoding: {
        x: {field: 'a', type: 'ordinal'},
        y: {field: 'b', type: 'quantitative'}
      }
    }).spec;

    expect(spec.signals).toEqual([
      {
        name: 'x_step',
        value: 20
      },
      {
        name: 'width',
        update: `bandspace(domain('x').length, 0.1, 0.05) * x_step`
      }
    ]);
    expect(spec.height).toEqual(200);
  });

  it('should set resize to true if requested', () => {
    const spec = compile({
      autosize: {
        resize: true
      },
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect((spec.autosize as any).resize).toBeTruthy();
  });

  it('should set autosize to fit and containment if requested', () => {
    const spec = compile({
      autosize: {
        type: 'fit',
        contains: 'content'
      },
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.autosize).toEqual({type: 'fit', contains: 'content'});
  });

  it('should set autosize to fit if requested', () => {
    const spec = compile({
      autosize: 'fit',
      data: {url: 'foo.csv'},
      mark: 'point',
      encoding: {}
    }).spec;

    expect(spec.autosize).toBe('fit');
  });

  it(
    'warn if trying to fit composed spec',
    log.wrap(localLogger => {
      const spec = compile({
        data: {values: [{a: 'A', b: 28}]},
        autosize: 'fit',
        vconcat: [
          {
            mark: 'point',
            encoding: {}
          }
        ]
      }).spec;
      expect(localLogger.warns[0]).toEqual(log.message.FIT_NON_SINGLE);
      expect(spec.autosize).toBe('pad');
    })
  );

  it('should return title for a layered spec.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      layer: [
        {
          mark: 'point',
          encoding: {}
        }
      ]
    }).spec;
    expect(spec.title).toEqual({text: 'test', frame: 'group'});
  });

  it('should return title (string) for a layered spec.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: 'test',
      layer: [
        {
          mark: 'point',
          encoding: {}
        }
      ]
    }).spec;
    expect(spec.title).toEqual({text: 'test', frame: 'group'});
  });

  it('should return title from a child of a layer spec if parent has no title.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      layer: [
        {
          title: {text: 'test'},
          mark: 'point',
          encoding: {}
        }
      ]
    }).spec;
    expect(spec.title).toEqual({text: 'test', frame: 'group'});
  });

  it('should return a title for a concat spec', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      hconcat: [
        {
          mark: 'point',
          encoding: {}
        }
      ],
      config: {title: {anchor: 'middle'}}
    }).spec;
    expect(spec.title).toEqual({
      text: 'test',
      anchor: 'middle' // We only support anchor as start for concat
    });
  });

  it('should return a title for a concat spec, automatically set anchor to "start", and augment the title with non-mark title config (e.g., offset).', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      title: {text: 'test'},
      hconcat: [
        {
          mark: 'point',
          encoding: {}
        }
      ],
      config: {title: {offset: 5}}
    }).spec;
    expect(spec.title).toEqual({
      text: 'test',
      anchor: 'start',
      offset: 5
    });
  });

  it('should not have title if there is no title.', () => {
    const spec = compile({
      data: {
        values: [{a: 'A', b: 28}]
      },
      hconcat: [
        {
          mark: 'point',
          encoding: {}
        }
      ],
      config: {title: {offset: 5}}
    }).spec;
    expect(spec.title).not.toBeDefined();
  });

  it('should use provided config.', () => {
    const spec = compile(
      {
        mark: 'point',
        data: {url: 'foo.csv'},
        encoding: {}
      },
      {
        config: {
          background: 'blue'
        }
      }
    ).spec;
    expect(spec.config.background).toBe('blue');
  });

  it('should merge spec and provided config.', () => {
    const spec = compile(
      {
        mark: 'point',
        data: {url: 'foo.csv'},
        encoding: {},
        config: {
          background: 'red'
        }
      },
      {
        config: {
          background: 'blue'
        }
      }
    ).spec;
    expect(spec.config.background).toBe('red');
  });

  it('should return a spec with projections (implicit)', () => {
    const spec = compile({
      mark: 'geoshape',
      data: {
        url: 'data/us-10m.json',
        format: {
          type: 'topojson',
          feature: 'states'
        }
      },
      encoding: {}
    }).spec;
    expect(spec.projections).toBeDefined();
  });

  it('should return a spec with projections (explicit)', () => {
    const spec = compile({
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
    }).spec;
    expect(spec.projections).toBeDefined();
  });
});

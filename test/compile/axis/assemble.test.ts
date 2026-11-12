import {parse, View} from 'vega';
import {assembleAxis} from '../../../src/compile/axis/assemble.js';
import {AxisComponent} from '../../../src/compile/axis/component.js';
import {compile} from '../../../src/compile/compile.js';
import {defaultConfig} from '../../../src/config.js';
import {parseUnitModelWithScale} from '../../util.js';

describe('compile/axis/assemble', () => {
  describe('assembleAxis()', () => {
    it('outputs grid axis with only grid encode blocks', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        grid: true,
        encode: {
          grid: {update: {stroke: {value: 'red'}}},
          labels: {update: {fill: {value: 'red'}}},
        },
      });
      const axis = assembleAxis(axisCmpt, 'grid', defaultConfig);
      expect(axis.encode.labels).toBeUndefined();
    });

    it('outputs grid axis with custom zindex', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        grid: true,
        zindex: 3,
      });
      const axis = assembleAxis(axisCmpt, 'grid', defaultConfig);
      expect(axis.zindex).toBe(3);
    });

    it('outputs main axis without grid encode blocks', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        encode: {
          grid: {update: {stroke: {value: 'red'}}},
          labels: {update: {fill: {value: 'red'}}},
        },
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.encode.grid).toBeUndefined();
    });

    it('correctly assemble title fieldDefs', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        title: [
          {aggregate: 'max', field: 'a'},
          {aggregate: 'min', field: 'b'},
        ],
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.title).toBe('Max of a, Min of b');
    });

    it('correctly redirect color signal', () => {
      const axisCmpt = new AxisComponent({
        labelColor: {signal: 'a'},
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.encode.labels.update.fill).toEqual({signal: 'a'});
    });

    it('redirects conditional labelOpacity to fillOpacity', () => {
      const axisCmpt = new AxisComponent({
        labelOpacity: {
          condition: {test: 'datum.value >= 5', value: 1},
          signal: 'a',
        },
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.encode.labels.update.fillOpacity).toEqual([{test: 'datum.value >= 5', value: 1}, {signal: 'a'}]);
      expect(axis.encode.labels.update.opacity).toBeUndefined();
    });

    it('applies a labelOpacity expression to labels that are checked for overlap', async () => {
      const {spec} = compile({
        data: {values: [{a: 1}, {a: 10}]},
        params: [{name: 'dim', value: true}],
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative', axis: {labelOverlap: true, labelOpacity: {expr: 'dim ? 0.2 : 1'}}},
        },
      });
      const view = new View(parse(spec), {renderer: 'none'});

      // Opacity of the axis labels that are shown, as rendered
      const getLabelOpacities = () => {
        const opacities = new Set<number>();
        (function walk(node: any) {
          if (node.role === 'axis-label') {
            for (const item of node.items) {
              if (item.opacity !== 0) {
                opacities.add(item.opacity * (item.fillOpacity ?? 1));
              }
            }
          } else if (Array.isArray(node.items)) {
            node.items.forEach(walk);
          }
        })((view.scenegraph() as any).root);
        return opacities;
      };

      await view.runAsync();
      expect(getLabelOpacities()).toEqual(new Set([0.2]));

      await view.signal('dim', false).runAsync();
      expect(getLabelOpacities()).toEqual(new Set([1]));
    });

    it('correctly applies conditional axis tickSize', () => {
      const axisCmpt = new AxisComponent({
        tickSize: {
          condition: {test: 'datum.index === 0 || datum.index === 1', value: 4},
          value: 2,
        },
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.tickSize).toEqual({signal: 'datum.index === 0 || datum.index === 1 ? 4 : 2'});
    });

    it('correctly applies conditional signal for axis tickSize', () => {
      const axisCmpt = new AxisComponent({
        tickSize: {
          condition: {test: 'datum.index === 0 || datum.index === 1', signal: 'a'},
          signal: 'b',
        },
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.tickSize).toEqual({signal: 'datum.index === 0 || datum.index === 1 ? a : b'});
    });
  });

  it('outputs grid axis with aria false', () => {
    const axisCmpt = new AxisComponent({
      orient: 'left',
      grid: true,
    });
    const axis = assembleAxis(axisCmpt, 'grid', defaultConfig);
    expect(axis.aria).toBe(false);
  });

  it('outputs aria false if set in config', () => {
    const axisCmpt = new AxisComponent({
      orient: 'left',
    });
    const axis = assembleAxis(axisCmpt, 'main', {...defaultConfig, aria: false});
    expect(axis.aria).toBe(false);
  });

  it('correctly applies custom formatter to labelExpr.', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        y: {
          field: 'Miles_per_Gallon',
          type: 'quantitative',
          axis: {
            format: {a: 'b'},
            formatType: 'myFormat',
            labelExpr: 'datum.label[0]',
          },
        },
      },
      config: {customFormatTypes: true},
    });
    model.parseAxesAndHeaders();

    const axes = model.assembleAxes();
    expect(axes[1].encode.labels.update.text).toEqual({
      signal: 'myFormat(datum.value, {"a":"b"})[0]',
    });
  });
});

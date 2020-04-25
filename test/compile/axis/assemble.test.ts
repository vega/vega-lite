import {assembleAxis} from '../../../src/compile/axis/assemble';
import {AxisComponent} from '../../../src/compile/axis/component';
import {defaultConfig} from '../../../src/config';

describe('compile/axis/assemble', () => {
  describe('assembleAxis()', () => {
    it('outputs grid axis with only grid encode blocks', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        grid: true,
        encode: {
          grid: {update: {stroke: {value: 'red'}}},
          labels: {update: {fill: {value: 'red'}}}
        }
      });
      const axis = assembleAxis(axisCmpt, 'grid', defaultConfig);
      expect(axis.encode.labels).toBeUndefined();
    });

    it('outputs grid axis with custom zindex', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        grid: true,
        zindex: 3
      });
      const axis = assembleAxis(axisCmpt, 'grid', defaultConfig);
      expect(axis.zindex).toEqual(3);
    });

    it('outputs main axis without grid encode blocks', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        encode: {
          grid: {update: {stroke: {value: 'red'}}},
          labels: {update: {fill: {value: 'red'}}}
        }
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.encode.grid).toBeUndefined();
    });

    it('correctly assemble title fieldDefs', () => {
      const axisCmpt = new AxisComponent({
        orient: 'left',
        title: [
          {aggregate: 'max', field: 'a'},
          {aggregate: 'min', field: 'b'}
        ]
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.title).toBe('Max of a, Min of b');
    });

    it('correctly redirect color signal', () => {
      const axisCmpt = new AxisComponent({
        labelColor: {signal: 'a'}
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.encode.labels.update.fill).toEqual({signal: 'a'});
    });

    it('correctly applies conditional axis tickSize', () => {
      const axisCmpt = new AxisComponent({
        tickSize: {
          condition: {test: 'datum.index === 0 || datum.index === 1', value: 4},
          value: 2
        }
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.tickSize).toEqual({signal: 'datum.index === 0 || datum.index === 1 ? 4 : 2'});
    });

    it('correctly applies conditional signal for axis tickSize', () => {
      const axisCmpt = new AxisComponent({
        tickSize: {
          condition: {test: 'datum.index === 0 || datum.index === 1', signal: 'a'},
          signal: 'b'
        }
      });
      const axis = assembleAxis(axisCmpt, 'main', defaultConfig);
      expect(axis.tickSize).toEqual({signal: 'datum.index === 0 || datum.index === 1 ? a : b'});
    });
  });
});

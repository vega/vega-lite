import {image} from '../../../src/compile/mark/image.js';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util.js';

describe('Mark: Image', () => {
  describe('without explicit size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {values: [{t: 'a', s: 1, img: 'data/ffox.png'}]},
      mark: 'image',
      encoding: {
        x: {field: 't', type: 'nominal'},
        y: {field: 's', type: 'quantitative'},
        url: {field: 'img', type: 'nominal'},
      },
    });
    const props = image.encodeEntry(model);

    it('should center the image and use its natural dimensions', () => {
      expect(props.x).toEqual({scale: 'x', field: 't', band: 0.5});
      expect(props.align).toEqual({value: 'center'});
      expect(props.y).toEqual({scale: 'y', field: 's'});
      expect(props.baseline).toEqual({value: 'middle'});
      expect(props.width).toBeUndefined();
      expect(props.height).toBeUndefined();
      expect(props.x2).toBeUndefined();
      expect(props.y2).toBeUndefined();
    });
  });

  describe('without explicit size and with align and baseline', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {values: [{a: 1, b: 2, img: 'data/ffox.png'}]},
      mark: {type: 'image', align: 'left', baseline: 'top'},
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'quantitative'},
        url: {field: 'img', type: 'nominal'},
      },
    });
    const props = image.encodeEntry(model);

    it('should respect align and baseline', () => {
      expect(props.x).toEqual({scale: 'x', field: 'a'});
      expect(props.align).toEqual({value: 'left'});
      expect(props.y).toEqual({scale: 'y', field: 'b'});
      expect(props.baseline).toEqual({value: 'top'});
      expect(props.width).toBeUndefined();
      expect(props.height).toBeUndefined();
    });
  });

  describe('with x2 and y2', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {values: [{a: 1, a2: 2, b: 1, b2: 2, img: 'data/ffox.png'}]},
      mark: 'image',
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        x2: {field: 'a2'},
        y: {field: 'b', type: 'quantitative'},
        y2: {field: 'b2'},
        url: {field: 'img', type: 'nominal'},
      },
    });
    const props = image.encodeEntry(model);

    it('should draw the image between the primary and secondary channels', () => {
      expect(props.x).toEqual({scale: 'x', field: 'a'});
      expect(props.x2).toEqual({scale: 'x', field: 'a2'});
      expect(props.y).toEqual({scale: 'y', field: 'b'});
      expect(props.y2).toEqual({scale: 'y', field: 'b2'});
      expect(props.align).toBeUndefined();
      expect(props.baseline).toBeUndefined();
    });
  });

  describe('with explicit width and height', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {values: [{a: 1, b: 2, img: 'data/ffox.png'}]},
      mark: {type: 'image', width: 50, height: 49},
      encoding: {
        x: {field: 'a', type: 'quantitative'},
        y: {field: 'b', type: 'quantitative'},
        url: {field: 'img', type: 'nominal'},
      },
    });
    const props = image.encodeEntry(model);

    it('should center the image and use the specified size', () => {
      expect(props.xc).toEqual({scale: 'x', field: 'a'});
      expect(props.width).toEqual({value: 50});
      expect(props.yc).toEqual({scale: 'y', field: 'b'});
      expect(props.height).toEqual({value: 49});
      expect(props.align).toBeUndefined();
      expect(props.baseline).toBeUndefined();
    });
  });

  describe('with position value and without explicit size', () => {
    const model = parseUnitModelWithScaleAndLayoutSize({
      data: {values: [{img: 'data/ffox.png'}]},
      mark: 'image',
      encoding: {
        y: {value: 100},
        url: {field: 'img', type: 'nominal'},
      },
    });
    const props = image.encodeEntry(model);

    it('should center the image at the value', () => {
      expect(props.y).toEqual({value: 100});
      expect(props.baseline).toEqual({value: 'middle'});
      expect(props.height).toBeUndefined();
    });
  });
});

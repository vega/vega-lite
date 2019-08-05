import * as log from '../../../src/log';
import {parseUnitModelWithScaleAndLayoutSize} from '../../util';

describe('compile/layout', () => {
  describe('initLayoutSize', () => {
    it(
      'should have step-based width/height for ordinal x,y',
      log.wrap(localLogger => {
        const model = parseUnitModelWithScaleAndLayoutSize({
          mark: 'point',
          width: {step: 20},
          encoding: {
            x: {field: 'a', type: 'quantitative'}
          }
        });

        expect(localLogger.warns[0]).toEqual(log.message.stepDropped('width'));

        expect(model.component.layoutSize.get('width')).toBe(200);
      })
    );
  });
});

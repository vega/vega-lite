import {DETAIL, SHAPE, X} from '../../src/channel';
import * as log from '../../src/log';
import {BAR} from '../../src/mark';
import {QUANTITATIVE} from '../../src/type';
import {parseUnitModel} from '../util';

describe('UnitModel', () => {
  describe('initEncoding', () => {
    it(
      'should drop unsupported channel and throws warning',
      log.wrap(localLogger => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            shape: {field: 'a', type: 'nominal'}
          }
        });
        expect(model.encoding.shape).toEqual(undefined);
        expect(localLogger.warns[0]).toEqual(log.message.incompatibleChannel(SHAPE, BAR));
      })
    );

    it(
      'should drop invalid channel and throws warning',
      log.wrap(localLogger => {
        parseUnitModel({
          mark: 'bar',
          encoding: {
            _y: {type: 'quantitative'}
          }
        } as any); // To make parseUnitModel accept the model with invalid encoding channel
        expect(localLogger.warns[0]).toEqual(log.message.invalidEncodingChannel('_y'));
      })
    );

    it(
      'should drop channel without field and value and throws warning',
      log.wrap(localLogger => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            x: {type: 'quantitative'}
          }
        });
        expect(model.encoding.x).toEqual(undefined);
        expect(localLogger.warns[0]).toEqual(log.message.emptyFieldDef({type: QUANTITATIVE}, X));
      })
    );

    it(
      'should drop a fieldDef without field and value from the channel def list and throws warning',
      log.wrap(localLogger => {
        const model = parseUnitModel({
          mark: 'bar',
          encoding: {
            detail: [{field: 'a', type: 'ordinal'}, {type: 'quantitative'}]
          }
        });
        expect(model.encoding.detail).toEqual([{field: 'a', type: 'ordinal'}]);
        expect(localLogger.warns[0]).toEqual(log.message.emptyFieldDef({type: QUANTITATIVE}, DETAIL));
      })
    );
  });

  describe('initAxes', () => {
    it('should not include properties of non-VlOnlyAxisConfig in config.axis', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal'},
          y: {field: 'b', type: 'ordinal'}
        },
        config: {axis: {domainWidth: 123}}
      });

      expect(model.axis(X)['domainWidth']).toEqual(undefined);
    });

    it('it should have axis.offset = encode.x.axis.offset', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', axis: {offset: 345}},
          y: {field: 'b', type: 'ordinal'}
        }
      });

      expect(model.axis(X).offset).toEqual(345);
    });
  });
});

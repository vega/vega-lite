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
        expect(model.encoding.shape).toBeUndefined();
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
        expect(localLogger.warns[0]).toEqual(log.message.invalidEncodingChannel('_y' as any));
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
        expect(model.encoding.x).toBeUndefined();
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

  describe('initScales', () => {
    it('redirects encode.x.scale to scale.x and replaces expression with signal', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', scale: {domain: [1, {expr: 'max'}], scheme: {signal: 'scheme'}}},
          y: {field: 'b', type: 'ordinal'}
        }
      });

      expect(model.scaleDomain(X)).toEqual([1, {signal: 'max'}]);
      expect(model.specifiedScales['x'].scheme).toEqual({signal: 'scheme'});
    });
  });

  describe('initAxes', () => {
    it('redirects encode.x.axis to axis.x and replace expression with signal', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'ordinal', axis: {offset: 345, labelColor: {expr: 'red'}}},
          y: {field: 'b', type: 'ordinal'}
        }
      });

      expect(model.axis(X).offset).toBe(345);
      expect(model.axis(X).labelColor).toEqual({signal: 'red'});
    });
  });

  describe('initLegend', () => {
    it('redirects encode.color.legend to legend.color and replace expression with signal', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          color: {field: 'a', type: 'ordinal', legend: {labelColor: {expr: 'red'}}}
        }
      });

      expect(model.legend('color').labelColor).toEqual({signal: 'red'});
    });
  });

  describe('label', () => {
    it('parses label', () => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'a', type: 'quantitative'},
          label: {field: 'b', type: 'nominal'}
        }
      });
      model.parse();
      expect(model.labelMark).toEqual({
        name: 'marks_label',
        type: 'text',
        style: ['text'],
        from: {data: 'marks'},
        encode: {
          update: {
            fill: {value: 'black'},
            description: {signal: '"b: " + (isValid(datum["b"]) ? datum["b"] : ""+datum["b"])'},
            text: {signal: 'isValid(datum.datum["b"]) ? datum.datum["b"] : ""+datum.datum["b"]'}
          }
        },
        transform: [
          {
            type: 'label',
            size: {signal: '[width, height]'},
            anchor: ['top-right', 'top', 'top-left', 'left', 'bottom-left', 'bottom', 'bottom-right', 'middle'],
            offset: [2, 2, 2, 2, 2, 2, 2, 2, 2]
          }
        ]
      });
    });
  });
});

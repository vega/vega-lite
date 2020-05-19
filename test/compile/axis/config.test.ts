import {getAxisConfigs} from '../../../src/compile/axis/config';

describe('getAxisConfigs', () => {
  it('correctly get axis types for orient signal', () => {
    const {vgAxisConfig} = getAxisConfigs(
      'x',
      'point',
      {signal: 'a'},
      {
        axisTop: {labelBaseline: 'line-bottom', labelPadding: 2},
        axisBottom: {labelBaseline: {signal: 'a'}}
      }
    );

    expect(vgAxisConfig).toEqual({
      labelBaseline: {signal: 'a === "bottom" ? a : "line-bottom"'},
      labelPadding: {signal: 'a === "bottom" ? null : 2'}
    });
  });
});

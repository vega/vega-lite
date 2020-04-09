import {getAxisConfigs} from '../../../src/compile/axis/config';

describe('getAxisConfigs', () => {
  it('correctly get axis types for orient signal', () => {
    const {vgAxisConfig} = getAxisConfigs(
      'x',
      'point',
      {signal: 'a'},
      {
        axisTop: {labelBaseline: 'line-bottom', labelPadding: 2},
        axisBottom: {labelBaseline: 'line-top'}
      }
    );

    expect(vgAxisConfig).toEqual({
      labelBaseline: {signal: 'a === "bottom" ? "line-top" : "line-bottom"'},
      labelPadding: {signal: 'a === "bottom" ? undefined : 2'}
    });
  });
});

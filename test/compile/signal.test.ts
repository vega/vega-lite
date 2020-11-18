import {SignalRefWrapper} from '../../src/compile/signal';
import {keys, stringify} from '../../src/util';

describe('SignalRefWrapper', () => {
  const s = new SignalRefWrapper(() => 'hello world');

  it('should have a signal property', () => {
    expect(s).toHaveProperty('signal');
    expect(s.signal).toBe('hello world');
    expect(keys(s)).toEqual(['signal']);
  });

  it('should serialize correctly', () => {
    expect(stringify(s)).toBe('{"signal":"hello world"}');
  });

  it('should look like a signal', () => {
    expect(s).toEqual({signal: 'hello world'});
  });

  it('should not overwrite previous property', () => {
    const t = new SignalRefWrapper(() => 'hello vega');
    expect(t).toEqual({signal: 'hello vega'});

    expect(s).toEqual({signal: 'hello world'});
  });
});

import {expect} from 'chai';

import {labelTemplate} from '../../src/compiler/time';

describe('time', function() {
  it('should get the right time template', function() {
    expect(labelTemplate('month', true)).to.equal('month-abbrev');
    expect(labelTemplate('month')).to.equal('month');
    expect(labelTemplate('day', true)).to.equal('day-abbrev');
    expect(labelTemplate('day')).to.equal('day');
    expect(labelTemplate('week')).to.equal(null);
  });
});

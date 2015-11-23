import {expect} from 'chai';

import * as util from '../src/util';

describe('util.isSimplePropertyName', function () {
  it('should flag invalid identifiers', function() {
    expect(util.isSimplePropertyName('foo bar')).to.eql(false);
    expect(util.isSimplePropertyName('"foo"')).to.eql(false);
    expect(util.isSimplePropertyName('&bar')).to.eql(false);
  });

  it('should accept simple identifiers', function() {
    expect(util.isSimplePropertyName('Foo')).to.eql(true);
    expect(util.isSimplePropertyName('foo_bar')).to.eql(true);
    expect(util.isSimplePropertyName('123')).to.eql(true);
    expect(util.isSimplePropertyName('$')).to.eql(true);
    expect(util.isSimplePropertyName('_')).to.eql(true);
  });
});

describe('util.makeValidPropertyName', function () {
  it('should leave simple names', function() {
    expect(util.makeValidPropertyName('foo')).to.eql('foo');
  });

  it('should encode invalid names', function() {
    expect(util.makeValidPropertyName('foo bar')).to.eql('Zm9vIGJhcg__');
  });
});

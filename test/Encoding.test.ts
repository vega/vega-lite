import {expect} from 'chai';
import Encoding from '../src/Encoding';
import {Enctype} from '../src/consts';

describe('Encoding.fromShorthand()', function () {
  it('should parse shorthand correctly', function () {
    var shorthand = 'mark=point|x=Effect__Amount_of_damage,O|y=mean_Cost__Total_$,Q';
    var encoding = Encoding.fromShorthand(shorthand);
    expect(encoding.has(Enctype.Y)).ok;
    expect(encoding.has(Enctype.X)).ok;
  });
});

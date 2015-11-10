var chai_1 = require('chai');
var Encoding_1 = require('../src/Encoding');
var consts_1 = require('../src/consts');
describe('Encoding.fromShorthand()', function () {
    it('should parse shorthand correctly', function () {
        var shorthand = 'mark=point|x=Effect__Amount_of_damage,O|y=mean_Cost__Total_$,Q';
        var encoding = Encoding_1.default.fromShorthand(shorthand);
        chai_1.expect(encoding.has(consts_1.Enctype.Y)).ok;
        chai_1.expect(encoding.has(consts_1.Enctype.X)).ok;
    });
});

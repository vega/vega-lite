"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../src/util");
describe('util', function () {
    describe('varName', function () {
        it('replace all non-alphanumeric characters with _', function () {
            chai_1.assert.equal(util_1.varName('bin-mpg$!@#%_+1'), 'bin_mpg_______1');
        });
        it('prepends _ if the string starts with number', function () {
            chai_1.assert.equal(util_1.varName('1a'), '_1a');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC91dGlsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsb0NBQW9DO0FBRXBDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixRQUFRLENBQUMsU0FBUyxFQUFFO1FBQ2xCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxhQUFNLENBQUMsS0FBSyxDQUFDLGNBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHt2YXJOYW1lfSBmcm9tICcuLi9zcmMvdXRpbCc7XG5cbmRlc2NyaWJlKCd1dGlsJywgKCkgPT4ge1xuICBkZXNjcmliZSgndmFyTmFtZScsICgpID0+IHtcbiAgICBpdCgncmVwbGFjZSBhbGwgbm9uLWFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIHdpdGggXycsICgpID0+IHtcbiAgICAgIGFzc2VydC5lcXVhbCh2YXJOYW1lKCdiaW4tbXBnJCFAIyVfKzEnKSwgJ2Jpbl9tcGdfX19fX19fMScpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3ByZXBlbmRzIF8gaWYgdGhlIHN0cmluZyBzdGFydHMgd2l0aCBudW1iZXInLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZXF1YWwodmFyTmFtZSgnMWEnKSwgJ18xYScpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var multi_1 = require("./multi");
var selection_1 = require("./selection");
var single = {
    predicate: 'vlSingle',
    scaleDomain: 'vlSingleDomain',
    signals: multi_1.default.signals,
    topLevelSignals: function (model, selCmpt, signals) {
        var hasSignal = signals.filter(function (s) { return s.name === selCmpt.name; });
        var data = "data(" + vega_util_1.stringValue(selCmpt.name + selection_1.STORE) + ")";
        var values = data + "[0].values";
        return hasSignal.length ? signals : signals.concat({
            name: selCmpt.name,
            update: data + ".length && {" +
                selCmpt.project.map(function (p, i) { return p.field + ": " + values + "[" + i + "]"; }).join(', ') + '}'
        });
    },
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + selection_1.TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'true' : "{unit: " + selection_1.unitName(model) + "}");
    }
};
exports.default = single;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NpbmdsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFzQztBQUN0QyxpQ0FBNEI7QUFDNUIseUNBQXNFO0FBR3RFLElBQU0sTUFBTSxHQUFxQjtJQUMvQixTQUFTLEVBQUUsVUFBVTtJQUNyQixXQUFXLEVBQUUsZ0JBQWdCO0lBRTdCLE9BQU8sRUFBRSxlQUFLLENBQUMsT0FBTztJQUV0QixlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0MsSUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLElBQUksRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1FBQ2pFLElBQU0sSUFBSSxHQUFHLFVBQVEsdUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUMsTUFBRyxDQUFDO1FBQzFELElBQU0sTUFBTSxHQUFNLElBQUksZUFBWSxDQUFDO1FBQ25DLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDakQsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO1lBQ2xCLE1BQU0sRUFBSyxJQUFJLGlCQUFjO2dCQUMzQixPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBRyxDQUFDLENBQUMsS0FBSyxVQUFLLE1BQU0sU0FBSSxDQUFDLE1BQUcsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHO1NBQ2hGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTztRQUNqQyxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLGlCQUFLLENBQUM7UUFDakMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJO1lBQ2YsQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFVLG9CQUFRLENBQUMsS0FBSyxDQUFDLE1BQUcsQ0FBQyxDQUFDO0lBQzNFLENBQUM7Q0FDRixDQUFDO0FBRWdCLHlCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzdHJpbmdWYWx1ZX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCBtdWx0aSBmcm9tICcuL211bHRpJztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcGlsZXIsIFNUT1JFLCBUVVBMRSwgdW5pdE5hbWV9IGZyb20gJy4vc2VsZWN0aW9uJztcblxuXG5jb25zdCBzaW5nbGU6U2VsZWN0aW9uQ29tcGlsZXIgPSB7XG4gIHByZWRpY2F0ZTogJ3ZsU2luZ2xlJyxcbiAgc2NhbGVEb21haW46ICd2bFNpbmdsZURvbWFpbicsXG5cbiAgc2lnbmFsczogbXVsdGkuc2lnbmFscyxcblxuICB0b3BMZXZlbFNpZ25hbHM6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0LCBzaWduYWxzKSB7XG4gICAgY29uc3QgaGFzU2lnbmFsID0gc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gc2VsQ21wdC5uYW1lKTtcbiAgICBjb25zdCBkYXRhID0gYGRhdGEoJHtzdHJpbmdWYWx1ZShzZWxDbXB0Lm5hbWUgKyBTVE9SRSl9KWA7XG4gICAgY29uc3QgdmFsdWVzID0gYCR7ZGF0YX1bMF0udmFsdWVzYDtcbiAgICByZXR1cm4gaGFzU2lnbmFsLmxlbmd0aCA/IHNpZ25hbHMgOiBzaWduYWxzLmNvbmNhdCh7XG4gICAgICBuYW1lOiBzZWxDbXB0Lm5hbWUsXG4gICAgICB1cGRhdGU6IGAke2RhdGF9Lmxlbmd0aCAmJiB7YCArXG4gICAgICAgIHNlbENtcHQucHJvamVjdC5tYXAoKHAsIGkpID0+IGAke3AuZmllbGR9OiAke3ZhbHVlc31bJHtpfV1gKS5qb2luKCcsICcpICsgJ30nXG4gICAgfSk7XG4gIH0sXG5cbiAgbW9kaWZ5RXhwcjogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQpIHtcbiAgICBjb25zdCB0cGwgPSBzZWxDbXB0Lm5hbWUgKyBUVVBMRTtcbiAgICByZXR1cm4gdHBsICsgJywgJyArXG4gICAgICAoc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJyA/ICd0cnVlJyA6IGB7dW5pdDogJHt1bml0TmFtZShtb2RlbCl9fWApO1xuICB9XG59O1xuXG5leHBvcnQge3NpbmdsZSBhcyBkZWZhdWx0fTtcbiJdfQ==
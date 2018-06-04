"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var util_1 = require("../../../util");
var selection_1 = require("../selection");
var nearest_1 = tslib_1.__importDefault(require("./nearest"));
var inputBindings = {
    has: function (selCmpt) {
        return selCmpt.type === 'single' && selCmpt.resolve === 'global' &&
            selCmpt.bind && selCmpt.bind !== 'scales';
    },
    topLevelSignals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var proj = selCmpt.project;
        var bind = selCmpt.bind;
        var datum = nearest_1.default.has(selCmpt) ?
            '(item().isVoronoi ? datum.datum : datum)' : 'datum';
        proj.forEach(function (p) {
            var sgname = util_1.varName(name + "_" + p.field);
            var hasSignal = signals.filter(function (s) { return s.name === sgname; });
            if (!hasSignal.length) {
                signals.unshift({
                    name: sgname,
                    value: '',
                    on: [{
                            events: selCmpt.events,
                            update: "datum && item().mark.marktype !== 'group' ? " + util_1.accessPathWithDatum(p.field, datum) + " : null"
                        }],
                    bind: bind[p.field] || bind[p.channel] || bind
                });
            }
        });
        return signals;
    },
    signals: function (model, selCmpt, signals) {
        var name = selCmpt.name;
        var proj = selCmpt.project;
        var signal = signals.filter(function (s) { return s.name === name + selection_1.TUPLE; })[0];
        var fields = proj.map(function (p) { return vega_util_1.stringValue(p.field); }).join(', ');
        var values = proj.map(function (p) { return util_1.varName(name + "_" + p.field); });
        if (values.length) {
            signal.update = values.join(' && ') + " ? {fields: [" + fields + "], values: [" + values.join(', ') + "]} : null";
        }
        delete signal.value;
        delete signal.on;
        return signals;
    }
};
exports.default = inputBindings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvaW5wdXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFzQztBQUN0QyxzQ0FBMkQ7QUFDM0QsMENBQW1DO0FBQ25DLDhEQUFnQztBQUloQyxJQUFNLGFBQWEsR0FBcUI7SUFDdEMsR0FBRyxFQUFFLFVBQVMsT0FBTztRQUNuQixPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUTtZQUM5RCxPQUFPLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDO0lBQzlDLENBQUM7SUFFRCxlQUFlLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDL0MsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDMUIsSUFBTSxLQUFLLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNsQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRXZELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBUyxDQUFDO1lBQ3JCLElBQU0sTUFBTSxHQUFHLGNBQU8sQ0FBSSxJQUFJLFNBQUksQ0FBQyxDQUFDLEtBQU8sQ0FBQyxDQUFDO1lBQzdDLElBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO2dCQUNyQixPQUFPLENBQUMsT0FBTyxDQUFDO29CQUNkLElBQUksRUFBRSxNQUFNO29CQUNaLEtBQUssRUFBRSxFQUFFO29CQUNULEVBQUUsRUFBRSxDQUFDOzRCQUNILE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTs0QkFDdEIsTUFBTSxFQUFFLGlEQUErQywwQkFBbUIsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxZQUFTO3lCQUNwRyxDQUFDO29CQUNGLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSTtpQkFDL0MsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxLQUFLLEVBQUUsT0FBTyxFQUFFLE9BQU87UUFDdkMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQztRQUMxQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxpQkFBSyxFQUF2QixDQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakUsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLHVCQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxjQUFPLENBQUksSUFBSSxTQUFJLENBQUMsQ0FBQyxLQUFPLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDO1FBRTlELElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNqQixNQUFNLENBQUMsTUFBTSxHQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFnQixNQUFNLG9CQUFlLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQVcsQ0FBQztTQUN6RztRQUVELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNwQixPQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFFakIsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztDQUNGLENBQUM7QUFFRixrQkFBZSxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3N0cmluZ1ZhbHVlfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHthY2Nlc3NQYXRoV2l0aERhdHVtLCB2YXJOYW1lfSBmcm9tICcuLi8uLi8uLi91dGlsJztcbmltcG9ydCB7VFVQTEV9IGZyb20gJy4uL3NlbGVjdGlvbic7XG5pbXBvcnQgbmVhcmVzdCBmcm9tICcuL25lYXJlc3QnO1xuaW1wb3J0IHtUcmFuc2Zvcm1Db21waWxlcn0gZnJvbSAnLi90cmFuc2Zvcm1zJztcblxuXG5jb25zdCBpbnB1dEJpbmRpbmdzOlRyYW5zZm9ybUNvbXBpbGVyID0ge1xuICBoYXM6IGZ1bmN0aW9uKHNlbENtcHQpIHtcbiAgICByZXR1cm4gc2VsQ21wdC50eXBlID09PSAnc2luZ2xlJyAmJiBzZWxDbXB0LnJlc29sdmUgPT09ICdnbG9iYWwnICYmXG4gICAgICBzZWxDbXB0LmJpbmQgJiYgc2VsQ21wdC5iaW5kICE9PSAnc2NhbGVzJztcbiAgfSxcblxuICB0b3BMZXZlbFNpZ25hbHM6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0LCBzaWduYWxzKSB7XG4gICAgY29uc3QgbmFtZSA9IHNlbENtcHQubmFtZTtcbiAgICBjb25zdCBwcm9qID0gc2VsQ21wdC5wcm9qZWN0O1xuICAgIGNvbnN0IGJpbmQgPSBzZWxDbXB0LmJpbmQ7XG4gICAgY29uc3QgZGF0dW0gPSBuZWFyZXN0LmhhcyhzZWxDbXB0KSA/XG4gICAgICAnKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKScgOiAnZGF0dW0nO1xuXG4gICAgcHJvai5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICAgIGNvbnN0IHNnbmFtZSA9IHZhck5hbWUoYCR7bmFtZX1fJHtwLmZpZWxkfWApO1xuICAgICAgY29uc3QgaGFzU2lnbmFsID0gc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gc2duYW1lKTtcbiAgICAgIGlmICghaGFzU2lnbmFsLmxlbmd0aCkge1xuICAgICAgICBzaWduYWxzLnVuc2hpZnQoe1xuICAgICAgICAgIG5hbWU6IHNnbmFtZSxcbiAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgb246IFt7XG4gICAgICAgICAgICBldmVudHM6IHNlbENtcHQuZXZlbnRzLFxuICAgICAgICAgICAgdXBkYXRlOiBgZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyAke2FjY2Vzc1BhdGhXaXRoRGF0dW0ocC5maWVsZCwgZGF0dW0pfSA6IG51bGxgXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgYmluZDogYmluZFtwLmZpZWxkXSB8fCBiaW5kW3AuY2hhbm5lbF0gfHwgYmluZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBzaWduYWxzO1xuICB9LFxuXG4gIHNpZ25hbHM6IGZ1bmN0aW9uKG1vZGVsLCBzZWxDbXB0LCBzaWduYWxzKSB7XG4gICAgY29uc3QgbmFtZSA9IHNlbENtcHQubmFtZTtcbiAgICBjb25zdCBwcm9qID0gc2VsQ21wdC5wcm9qZWN0O1xuICAgIGNvbnN0IHNpZ25hbCA9IHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09IG5hbWUgKyBUVVBMRSlbMF07XG4gICAgY29uc3QgZmllbGRzID0gcHJvai5tYXAoKHApID0+IHN0cmluZ1ZhbHVlKHAuZmllbGQpKS5qb2luKCcsICcpO1xuICAgIGNvbnN0IHZhbHVlcyA9IHByb2oubWFwKChwKSA9PiB2YXJOYW1lKGAke25hbWV9XyR7cC5maWVsZH1gKSk7XG5cbiAgICBpZiAodmFsdWVzLmxlbmd0aCkge1xuICAgICAgc2lnbmFsLnVwZGF0ZSA9IGAke3ZhbHVlcy5qb2luKCcgJiYgJyl9ID8ge2ZpZWxkczogWyR7ZmllbGRzfV0sIHZhbHVlczogWyR7dmFsdWVzLmpvaW4oJywgJyl9XX0gOiBudWxsYDtcbiAgICB9XG5cbiAgICBkZWxldGUgc2lnbmFsLnZhbHVlO1xuICAgIGRlbGV0ZSBzaWduYWwub247XG5cbiAgICByZXR1cm4gc2lnbmFscztcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5wdXRCaW5kaW5ncztcbiJdfQ==
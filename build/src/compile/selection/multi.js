import { stringValue } from 'vega-util';
import { accessPathWithDatum } from '../../util';
import { TUPLE, unitName } from './selection';
import nearest from './transforms/nearest';
export function signals(model, selCmpt) {
    var proj = selCmpt.project;
    var datum = nearest.has(selCmpt) ?
        '(item().isVoronoi ? datum.datum : datum)' : 'datum';
    var bins = [];
    var encodings = proj.map(function (p) { return stringValue(p.channel); }).filter(function (e) { return e; }).join(', ');
    var fields = proj.map(function (p) { return stringValue(p.field); }).join(', ');
    var values = proj.map(function (p) {
        var channel = p.channel;
        var fieldDef = model.fieldDef(channel);
        // Binned fields should capture extents, for a range test against the raw field.
        return (fieldDef && fieldDef.bin) ? (bins.push(p.field),
            "[" + accessPathWithDatum(model.vgField(channel, {}), datum) + ", " +
                (accessPathWithDatum(model.vgField(channel, { binSuffix: 'end' }), datum) + "]")) :
            "" + accessPathWithDatum(p.field, datum);
    }).join(', ');
    // Only add a discrete selection to the store if a datum is present _and_
    // the interaction isn't occurring on a group mark. This guards against
    // polluting interactive state with invalid values in faceted displays
    // as the group marks are also data-driven. We force the update to account
    // for constant null states but varying toggles (e.g., shift-click in
    // whitespace followed by a click in whitespace; the store should only
    // be cleared on the second click).
    return [{
            name: selCmpt.name + TUPLE,
            value: {},
            on: [{
                    events: selCmpt.events,
                    update: "datum && item().mark.marktype !== 'group' ? " +
                        ("{unit: " + unitName(model) + ", encodings: [" + encodings + "], ") +
                        ("fields: [" + fields + "], values: [" + values + "]") +
                        (bins.length ? ', ' + bins.map(function (b) { return stringValue('bin_' + b) + ": 1"; }).join(', ') : '') +
                        '} : null',
                    force: true
                }]
        }];
}
var multi = {
    predicate: 'vlMulti',
    scaleDomain: 'vlMultiDomain',
    signals: signals,
    modifyExpr: function (model, selCmpt) {
        var tpl = selCmpt.name + TUPLE;
        return tpl + ', ' +
            (selCmpt.resolve === 'global' ? 'null' : "{unit: " + unitName(model) + "}");
    }
};
export default multi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUV0QyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFL0MsT0FBTyxFQUF3QyxLQUFLLEVBQUUsUUFBUSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ25GLE9BQU8sT0FBTyxNQUFNLHNCQUFzQixDQUFDO0FBRTNDLE1BQU0sa0JBQWtCLEtBQWdCLEVBQUUsT0FBMkI7SUFDbkUsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztJQUM3QixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbEMsMENBQTBDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUN2RCxJQUFNLElBQUksR0FBYSxFQUFFLENBQUM7SUFDMUIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLFdBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RGLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFwQixDQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO1FBQ3hCLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDMUIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxnRkFBZ0Y7UUFDaEYsT0FBTyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3JELE1BQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQUk7aUJBQ3ZELG1CQUFtQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQUcsQ0FBQSxDQUFDLENBQUMsQ0FBQztZQUNuRixLQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFHLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRWQseUVBQXlFO0lBQ3pFLHVFQUF1RTtJQUN2RSxzRUFBc0U7SUFDdEUsMEVBQTBFO0lBQzFFLHFFQUFxRTtJQUNyRSxzRUFBc0U7SUFDdEUsbUNBQW1DO0lBQ25DLE9BQU8sQ0FBQztZQUNOLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxHQUFHLEtBQUs7WUFDMUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxFQUFFLEVBQUUsQ0FBQztvQkFDSCxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07b0JBQ3RCLE1BQU0sRUFBRSw4Q0FBOEM7eUJBQ3BELFlBQVUsUUFBUSxDQUFDLEtBQUssQ0FBQyxzQkFBaUIsU0FBUyxRQUFLLENBQUE7eUJBQ3hELGNBQVksTUFBTSxvQkFBZSxNQUFNLE1BQUcsQ0FBQTt3QkFDMUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFHLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFFBQUssRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO3dCQUN2RixVQUFVO29CQUNaLEtBQUssRUFBRSxJQUFJO2lCQUNaLENBQUM7U0FDSCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsSUFBTSxLQUFLLEdBQXFCO0lBQzlCLFNBQVMsRUFBRSxTQUFTO0lBQ3BCLFdBQVcsRUFBRSxlQUFlO0lBRTVCLE9BQU8sRUFBRSxPQUFPO0lBRWhCLFVBQVUsRUFBRSxVQUFTLEtBQUssRUFBRSxPQUFPO1FBQ2pDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLE9BQU8sR0FBRyxHQUFHLElBQUk7WUFDZixDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFlBQVUsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFHLENBQUMsQ0FBQztJQUMzRSxDQUFDO0NBQ0YsQ0FBQztBQUVGLGVBQWUsS0FBSyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzdHJpbmdWYWx1ZX0gZnJvbSAndmVnYS11dGlsJztcblxuaW1wb3J0IHthY2Nlc3NQYXRoV2l0aERhdHVtfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2VsZWN0aW9uQ29tcGlsZXIsIFNlbGVjdGlvbkNvbXBvbmVudCwgVFVQTEUsIHVuaXROYW1lfSBmcm9tICcuL3NlbGVjdGlvbic7XG5pbXBvcnQgbmVhcmVzdCBmcm9tICcuL3RyYW5zZm9ybXMvbmVhcmVzdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduYWxzKG1vZGVsOiBVbml0TW9kZWwsIHNlbENtcHQ6IFNlbGVjdGlvbkNvbXBvbmVudCkge1xuICBjb25zdCBwcm9qID0gc2VsQ21wdC5wcm9qZWN0O1xuICBjb25zdCBkYXR1bSA9IG5lYXJlc3QuaGFzKHNlbENtcHQpID9cbiAgICAnKGl0ZW0oKS5pc1Zvcm9ub2kgPyBkYXR1bS5kYXR1bSA6IGRhdHVtKScgOiAnZGF0dW0nO1xuICBjb25zdCBiaW5zOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCBlbmNvZGluZ3MgPSBwcm9qLm1hcCgocCkgPT4gc3RyaW5nVmFsdWUocC5jaGFubmVsKSkuZmlsdGVyKChlKSA9PiBlKS5qb2luKCcsICcpO1xuICBjb25zdCBmaWVsZHMgPSBwcm9qLm1hcCgocCkgPT4gc3RyaW5nVmFsdWUocC5maWVsZCkpLmpvaW4oJywgJyk7XG4gIGNvbnN0IHZhbHVlcyA9IHByb2oubWFwKChwKSA9PiB7XG4gICAgY29uc3QgY2hhbm5lbCA9IHAuY2hhbm5lbDtcbiAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgIC8vIEJpbm5lZCBmaWVsZHMgc2hvdWxkIGNhcHR1cmUgZXh0ZW50cywgZm9yIGEgcmFuZ2UgdGVzdCBhZ2FpbnN0IHRoZSByYXcgZmllbGQuXG4gICAgcmV0dXJuIChmaWVsZERlZiAmJiBmaWVsZERlZi5iaW4pID8gKGJpbnMucHVzaChwLmZpZWxkKSxcbiAgICAgIGBbJHthY2Nlc3NQYXRoV2l0aERhdHVtKG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pLCBkYXR1bSl9LCBgICtcbiAgICAgICAgICBgJHthY2Nlc3NQYXRoV2l0aERhdHVtKG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ2VuZCd9KSwgZGF0dW0pfV1gKSA6XG4gICAgICBgJHthY2Nlc3NQYXRoV2l0aERhdHVtKHAuZmllbGQsIGRhdHVtKX1gO1xuICB9KS5qb2luKCcsICcpO1xuXG4gIC8vIE9ubHkgYWRkIGEgZGlzY3JldGUgc2VsZWN0aW9uIHRvIHRoZSBzdG9yZSBpZiBhIGRhdHVtIGlzIHByZXNlbnQgX2FuZF9cbiAgLy8gdGhlIGludGVyYWN0aW9uIGlzbid0IG9jY3VycmluZyBvbiBhIGdyb3VwIG1hcmsuIFRoaXMgZ3VhcmRzIGFnYWluc3RcbiAgLy8gcG9sbHV0aW5nIGludGVyYWN0aXZlIHN0YXRlIHdpdGggaW52YWxpZCB2YWx1ZXMgaW4gZmFjZXRlZCBkaXNwbGF5c1xuICAvLyBhcyB0aGUgZ3JvdXAgbWFya3MgYXJlIGFsc28gZGF0YS1kcml2ZW4uIFdlIGZvcmNlIHRoZSB1cGRhdGUgdG8gYWNjb3VudFxuICAvLyBmb3IgY29uc3RhbnQgbnVsbCBzdGF0ZXMgYnV0IHZhcnlpbmcgdG9nZ2xlcyAoZS5nLiwgc2hpZnQtY2xpY2sgaW5cbiAgLy8gd2hpdGVzcGFjZSBmb2xsb3dlZCBieSBhIGNsaWNrIGluIHdoaXRlc3BhY2U7IHRoZSBzdG9yZSBzaG91bGQgb25seVxuICAvLyBiZSBjbGVhcmVkIG9uIHRoZSBzZWNvbmQgY2xpY2spLlxuICByZXR1cm4gW3tcbiAgICBuYW1lOiBzZWxDbXB0Lm5hbWUgKyBUVVBMRSxcbiAgICB2YWx1ZToge30sXG4gICAgb246IFt7XG4gICAgICBldmVudHM6IHNlbENtcHQuZXZlbnRzLFxuICAgICAgdXBkYXRlOiBgZGF0dW0gJiYgaXRlbSgpLm1hcmsubWFya3R5cGUgIT09ICdncm91cCcgPyBgICtcbiAgICAgICAgYHt1bml0OiAke3VuaXROYW1lKG1vZGVsKX0sIGVuY29kaW5nczogWyR7ZW5jb2RpbmdzfV0sIGAgK1xuICAgICAgICBgZmllbGRzOiBbJHtmaWVsZHN9XSwgdmFsdWVzOiBbJHt2YWx1ZXN9XWAgK1xuICAgICAgICAoYmlucy5sZW5ndGggPyAnLCAnICsgYmlucy5tYXAoKGIpID0+IGAke3N0cmluZ1ZhbHVlKCdiaW5fJyArIGIpfTogMWApLmpvaW4oJywgJykgOiAnJykgK1xuICAgICAgICAnfSA6IG51bGwnLFxuICAgICAgZm9yY2U6IHRydWVcbiAgICB9XVxuICB9XTtcbn1cblxuY29uc3QgbXVsdGk6U2VsZWN0aW9uQ29tcGlsZXIgPSB7XG4gIHByZWRpY2F0ZTogJ3ZsTXVsdGknLFxuICBzY2FsZURvbWFpbjogJ3ZsTXVsdGlEb21haW4nLFxuXG4gIHNpZ25hbHM6IHNpZ25hbHMsXG5cbiAgbW9kaWZ5RXhwcjogZnVuY3Rpb24obW9kZWwsIHNlbENtcHQpIHtcbiAgICBjb25zdCB0cGwgPSBzZWxDbXB0Lm5hbWUgKyBUVVBMRTtcbiAgICByZXR1cm4gdHBsICsgJywgJyArXG4gICAgICAoc2VsQ21wdC5yZXNvbHZlID09PSAnZ2xvYmFsJyA/ICdudWxsJyA6IGB7dW5pdDogJHt1bml0TmFtZShtb2RlbCl9fWApO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBtdWx0aTtcbiJdfQ==
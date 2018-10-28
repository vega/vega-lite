import { vgField } from '../../fielddef';
import { isSortField } from '../../sort';
import { facetSortFieldName } from '../facet';
import { WindowTransformNode } from './window';
export function makeWindowFromFacet(parent, facet) {
    var row = facet.row, column = facet.column;
    if (row && column) {
        var newParent = null;
        // only need to make one for crossed facet
        for (var _i = 0, _a = [row, column]; _i < _a.length; _i++) {
            var fieldDef = _a[_i];
            if (isSortField(fieldDef.sort)) {
                var _b = fieldDef.sort, field = _b.field, op = _b.op;
                parent = newParent = new WindowTransformNode(parent, {
                    window: [
                        {
                            op: op,
                            field: field,
                            as: facetSortFieldName(fieldDef, fieldDef.sort, { forAs: true })
                        }
                    ],
                    groupby: [vgField(fieldDef)],
                    frame: [null, null]
                });
            }
        }
        return newParent;
    }
    return null;
}
//# sourceMappingURL=windowfacet.js.map
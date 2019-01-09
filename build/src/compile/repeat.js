import * as log from '../log';
import { BaseConcatModel } from './baseconcat';
import { buildModel } from './buildmodel';
import { parseRepeatLayoutSize } from './layoutsize/parse';
export class RepeatModel extends BaseConcatModel {
    constructor(spec, parent, parentGivenName, repeatValues, config) {
        super(spec, parent, parentGivenName, config, repeatValues, spec.resolve);
        this.type = 'repeat';
        if (spec.resolve && spec.resolve.axis && (spec.resolve.axis.x === 'shared' || spec.resolve.axis.y === 'shared')) {
            log.warn(log.message.REPEAT_CANNOT_SHARE_AXIS);
        }
        this.repeat = spec.repeat;
        this.children = this._initChildren(spec, this.repeat, repeatValues, config);
    }
    _initChildren(spec, repeat, repeater, config) {
        const children = [];
        const row = repeat.row || [repeater ? repeater.row : null];
        const column = repeat.column || [repeater ? repeater.column : null];
        // cross product
        for (const rowField of row) {
            for (const columnField of column) {
                const name = (rowField ? '_' + rowField : '') + (columnField ? '_' + columnField : '');
                const childRepeat = {
                    row: rowField,
                    column: columnField
                };
                children.push(buildModel(spec.spec, this, this.getName('child' + name), undefined, childRepeat, config, false));
            }
        }
        return children;
    }
    parseLayoutSize() {
        parseRepeatLayoutSize(this);
    }
    assembleDefaultLayout() {
        return {
            columns: this.repeat && this.repeat.column ? this.repeat.column.length : 1,
            bounds: 'full',
            align: 'all'
        };
    }
}
//# sourceMappingURL=repeat.js.map
import { isArray } from 'vega-util';
import * as log from '../log';
import { BaseConcatModel } from './baseconcat';
import { buildModel } from './buildmodel';
import { parseRepeatLayoutSize } from './layoutsize/parse';
export class RepeatModel extends BaseConcatModel {
    constructor(spec, parent, parentGivenName, repeatValues, config) {
        super(spec, 'repeat', parent, parentGivenName, config, repeatValues, spec.resolve);
        if (spec.resolve && spec.resolve.axis && (spec.resolve.axis.x === 'shared' || spec.resolve.axis.y === 'shared')) {
            log.warn(log.message.REPEAT_CANNOT_SHARE_AXIS);
        }
        this.repeat = spec.repeat;
        this.children = this._initChildren(spec, this.repeat, repeatValues, config);
    }
    _initChildren(spec, repeat, repeater, config) {
        const children = [];
        const row = (!isArray(repeat) && repeat.row) || [repeater ? repeater.row : null];
        const column = (!isArray(repeat) && repeat.column) || [repeater ? repeater.column : null];
        const repeatValues = (isArray(repeat) && repeat) || [repeater ? repeater.repeat : null];
        // cross product
        for (const repeatValue of repeatValues) {
            for (const rowValue of row) {
                for (const columnValue of column) {
                    const name = (repeatValue ? `__repeat_repeat_${repeatValue}` : '') +
                        (rowValue ? `__repeat_row_${rowValue}` : '') +
                        (columnValue ? `__repeat_column_${columnValue}` : '');
                    const childRepeat = {
                        repeat: repeatValue,
                        row: rowValue,
                        column: columnValue
                    };
                    children.push(buildModel(spec.spec, this, this.getName('child' + name), undefined, childRepeat, config));
                }
            }
        }
        return children;
    }
    parseLayoutSize() {
        parseRepeatLayoutSize(this);
    }
    assembleDefaultLayout() {
        const { repeat } = this;
        const columns = isArray(repeat) ? undefined : repeat.column ? repeat.column.length : 1;
        return Object.assign(Object.assign({}, (columns ? { columns } : {})), { bounds: 'full', align: 'all' });
    }
}
//# sourceMappingURL=repeat.js.map
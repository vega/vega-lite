import { isArray } from 'vega-util';
import { FACET_CHANNELS } from '../../channel';
import { title as fieldDefTitle } from '../../channeldef';
import { contains, getFirstDefined } from '../../util';
import { isSignalRef } from '../../vega.schema';
import { assembleAxis } from '../axis/assemble';
import { parseGuideResolve } from '../resolve';
import { getHeaderProperty } from './common';
export function getHeaderType(orient) {
    if (orient === 'top' || orient === 'left' || isSignalRef(orient)) {
        // we always use header for orient signal since we can't dynamically make header becomes footer
        return 'header';
    }
    return 'footer';
}
export function parseFacetHeaders(model) {
    for (const channel of FACET_CHANNELS) {
        parseFacetHeader(model, channel);
    }
    mergeChildAxis(model, 'x');
    mergeChildAxis(model, 'y');
}
function parseFacetHeader(model, channel) {
    const { facet, config, child, component } = model;
    if (model.channelHasField(channel)) {
        const fieldDef = facet[channel];
        const titleConfig = getHeaderProperty('title', null, config, channel);
        let title = fieldDefTitle(fieldDef, config, {
            allowDisabling: true,
            includeDefault: titleConfig === undefined || !!titleConfig
        });
        if (child.component.layoutHeaders[channel].title) {
            // TODO: better handle multiline titles
            title = isArray(title) ? title.join(', ') : title;
            // merge title with child to produce "Title / Subtitle / Sub-subtitle"
            title += ` / ${child.component.layoutHeaders[channel].title}`;
            child.component.layoutHeaders[channel].title = null;
        }
        const labelOrient = getHeaderProperty('labelOrient', fieldDef.header, config, channel);
        const labels = fieldDef.header !== null ? getFirstDefined(fieldDef.header?.labels, config.header.labels, true) : false;
        const headerType = contains(['bottom', 'right'], labelOrient) ? 'footer' : 'header';
        component.layoutHeaders[channel] = {
            title: fieldDef.header !== null ? title : null,
            facetFieldDef: fieldDef,
            [headerType]: channel === 'facet' ? [] : [makeHeaderComponent(model, channel, labels)]
        };
    }
}
function makeHeaderComponent(model, channel, labels) {
    const sizeType = channel === 'row' ? 'height' : 'width';
    return {
        labels,
        sizeSignal: model.child.component.layoutSize.get(sizeType) ? model.child.getSizeSignalRef(sizeType) : undefined,
        axes: []
    };
}
function mergeChildAxis(model, channel) {
    const { child } = model;
    if (child.component.axes[channel]) {
        const { layoutHeaders, resolve } = model.component;
        resolve.axis[channel] = parseGuideResolve(resolve, channel);
        if (resolve.axis[channel] === 'shared') {
            // For shared axis, move the axes to facet's header or footer
            const headerChannel = channel === 'x' ? 'column' : 'row';
            const layoutHeader = layoutHeaders[headerChannel];
            for (const axisComponent of child.component.axes[channel]) {
                const headerType = getHeaderType(axisComponent.get('orient'));
                layoutHeader[headerType] ?? (layoutHeader[headerType] = [makeHeaderComponent(model, headerChannel, false)]);
                // FIXME: assemble shouldn't be called here, but we do it this way so we only extract the main part of the axes
                const mainAxis = assembleAxis(axisComponent, 'main', model.config, { header: true });
                if (mainAxis) {
                    // LayoutHeader no longer keep track of property precedence, thus let's combine.
                    layoutHeader[headerType][0].axes.push(mainAxis);
                }
                axisComponent.mainExtracted = true;
            }
        }
        else {
            // Otherwise do nothing for independent axes
        }
    }
}
//# sourceMappingURL=parse.js.map
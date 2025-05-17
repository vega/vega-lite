import {isArray} from 'vega-util';
import {isConditionalAxisValue} from '../axis.js';
import {
  GEOPOSITION_CHANNELS,
  NONPOSITION_SCALE_CHANNELS,
  POSITION_SCALE_CHANNELS,
  SCALE_CHANNELS,
  supportLegend,
  X,
  Y,
} from '../channel.js';
import {getFieldDef, getFieldOrDatumDef, isFieldOrDatumDef, isTypedFieldDef} from '../channeldef.js';
import {isGraticuleGenerator} from '../data.js';
import * as vlEncoding from '../encoding.js';
import {initEncoding} from '../encoding.js';
import {replaceExprRef} from '../expr.js';
import {GEOSHAPE, isMarkDef} from '../mark.js';
import {isSelectionParameter} from '../selection.js';
import {isFrameMixins} from '../spec/base.js';
import {stack} from '../stack.js';
import {keys} from '../util.js';
import {assembleAxisSignals} from './axis/assemble.js';
import {parseUnitAxes} from './axis/parse.js';
import {signalOrValueRefWithCondition, signalRefOrValue} from './common.js';
import {parseData} from './data/parse.js';
import {assembleLayoutSignals} from './layoutsize/assemble.js';
import {initLayoutSize} from './layoutsize/init.js';
import {parseUnitLayoutSize} from './layoutsize/parse.js';
import {defaultFilled, initMarkdef} from './mark/init.js';
import {parseMarkGroups} from './mark/mark.js';
import {isLayerModel, ModelWithField} from './model.js';
import {
  assembleTopLevelSignals,
  assembleUnitSelectionData,
  assembleUnitSelectionMarks,
  assembleUnitSelectionSignals,
} from './selection/assemble.js';
import {parseUnitSelection} from './selection/parse.js';
import {CURR} from './selection/point.js';
/**
 * Internal model of Vega-Lite specification for the compiler.
 */
export class UnitModel extends ModelWithField {
  markDef;
  encoding;
  specifiedScales = {};
  stack;
  specifiedAxes = {};
  specifiedLegends = {};
  specifiedProjection = {};
  selection = [];
  children = [];
  constructor(spec, parent, parentGivenName, parentGivenSize = {}, config) {
    super(spec, 'unit', parent, parentGivenName, config, undefined, isFrameMixins(spec) ? spec.view : undefined);
    const markDef = isMarkDef(spec.mark) ? {...spec.mark} : {type: spec.mark};
    const mark = markDef.type;
    // Need to init filled before other mark properties because encoding depends on filled but other mark properties depend on types inside encoding
    if (markDef.filled === undefined) {
      markDef.filled = defaultFilled(markDef, config, {
        graticule: spec.data && isGraticuleGenerator(spec.data),
      });
    }
    const encoding = (this.encoding = initEncoding(spec.encoding || {}, mark, markDef.filled, config));
    this.markDef = initMarkdef(markDef, encoding, config);
    this.size = initLayoutSize({
      encoding,
      size: isFrameMixins(spec)
        ? {
            ...parentGivenSize,
            ...(spec.width ? {width: spec.width} : {}),
            ...(spec.height ? {height: spec.height} : {}),
          }
        : parentGivenSize,
    });
    // calculate stack properties
    this.stack = stack(this.markDef, encoding);
    this.specifiedScales = this.initScales(mark, encoding);
    this.specifiedAxes = this.initAxes(encoding);
    this.specifiedLegends = this.initLegends(encoding);
    this.specifiedProjection = spec.projection;
    // Selections will be initialized upon parse.
    this.selection = (spec.params ?? []).filter((p) => isSelectionParameter(p));
  }
  get hasProjection() {
    const {encoding} = this;
    const isGeoShapeMark = this.mark === GEOSHAPE;
    const hasGeoPosition = encoding && GEOPOSITION_CHANNELS.some((channel) => isFieldOrDatumDef(encoding[channel]));
    return isGeoShapeMark || hasGeoPosition;
  }
  /**
   * Return specified Vega-Lite scale domain for a particular channel
   * @param channel
   */
  scaleDomain(channel) {
    const scale = this.specifiedScales[channel];
    return scale ? scale.domain : undefined;
  }
  axis(channel) {
    return this.specifiedAxes[channel];
  }
  legend(channel) {
    return this.specifiedLegends[channel];
  }
  initScales(mark, encoding) {
    return SCALE_CHANNELS.reduce((scales, channel) => {
      const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]);
      if (fieldOrDatumDef) {
        scales[channel] = this.initScale(fieldOrDatumDef.scale ?? {});
      }
      return scales;
    }, {});
  }
  initScale(scale) {
    const {domain, range} = scale;
    // TODO: we could simplify this function if we had a recursive replace function
    const scaleInternal = replaceExprRef(scale);
    if (isArray(domain)) {
      scaleInternal.domain = domain.map(signalRefOrValue);
    }
    if (isArray(range)) {
      scaleInternal.range = range.map(signalRefOrValue);
    }
    return scaleInternal;
  }
  initAxes(encoding) {
    return POSITION_SCALE_CHANNELS.reduce((_axis, channel) => {
      // Position Axis
      // TODO: handle ConditionFieldDef
      const channelDef = encoding[channel];
      if (
        isFieldOrDatumDef(channelDef) ||
        (channel === X && isFieldOrDatumDef(encoding.x2)) ||
        (channel === Y && isFieldOrDatumDef(encoding.y2))
      ) {
        const axisSpec = isFieldOrDatumDef(channelDef) ? channelDef.axis : undefined;
        _axis[channel] = axisSpec
          ? this.initAxis({...axisSpec}) // convert truthy value to object
          : axisSpec;
      }
      return _axis;
    }, {});
  }
  initAxis(axis) {
    const props = keys(axis);
    const axisInternal = {};
    for (const prop of props) {
      const val = axis[prop];
      axisInternal[prop] = isConditionalAxisValue(val) ? signalOrValueRefWithCondition(val) : signalRefOrValue(val);
    }
    return axisInternal;
  }
  initLegends(encoding) {
    return NONPOSITION_SCALE_CHANNELS.reduce((_legend, channel) => {
      const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]);
      if (fieldOrDatumDef && supportLegend(channel)) {
        const legend = fieldOrDatumDef.legend;
        _legend[channel] = legend
          ? replaceExprRef(legend) // convert truthy value to object
          : legend;
      }
      return _legend;
    }, {});
  }
  parseData() {
    this.component.data = parseData(this);
  }
  parseLayoutSize() {
    parseUnitLayoutSize(this);
  }
  parseSelections() {
    this.component.selection = parseUnitSelection(this, this.selection);
  }
  parseMarkGroup() {
    this.component.mark = parseMarkGroups(this);
  }
  parseAxesAndHeaders() {
    this.component.axes = parseUnitAxes(this);
  }
  assembleSelectionTopLevelSignals(signals) {
    return assembleTopLevelSignals(this, signals);
  }
  assembleSignals() {
    return [...assembleAxisSignals(this), ...assembleUnitSelectionSignals(this, [])];
  }
  assembleSelectionData(data) {
    return assembleUnitSelectionData(this, data);
  }
  assembleLayout() {
    return null;
  }
  assembleLayoutSignals() {
    return assembleLayoutSignals(this);
  }
  /**
   * Corrects the data references in marks after assemble.
   */
  correctDataNames = (mark) => {
    // for normal data references
    if (mark.from?.data) {
      mark.from.data = this.lookupDataSource(mark.from.data);
      if ('time' in this.encoding) {
        mark.from.data = mark.from.data + CURR;
      }
    }
    // for access to facet data
    if (mark.from?.facet?.data) {
      mark.from.facet.data = this.lookupDataSource(mark.from.facet.data);
      // TOOD(jzong) uncomment this when it's time to implement facet animation
      // if ('time' in this.encoding) {
      //   mark.from.facet.data = mark.from.facet.data + CURR;
      // }
    }
    return mark;
  };
  assembleMarks() {
    let marks = this.component.mark ?? [];
    // If this unit is part of a layer, selections should augment
    // all in concert rather than each unit individually. This
    // ensures correct interleaving of clipping and brushed marks.
    if (!this.parent || !isLayerModel(this.parent)) {
      marks = assembleUnitSelectionMarks(this, marks);
    }
    return marks.map(this.correctDataNames);
  }
  assembleGroupStyle() {
    const {style} = this.view || {};
    if (style !== undefined) {
      return style;
    }
    if (this.encoding.x || this.encoding.y) {
      return 'cell';
    } else {
      return 'view';
    }
  }
  getMapping() {
    return this.encoding;
  }
  get mark() {
    return this.markDef.type;
  }
  channelHasField(channel) {
    return vlEncoding.channelHasField(this.encoding, channel);
  }
  fieldDef(channel) {
    const channelDef = this.encoding[channel];
    return getFieldDef(channelDef);
  }
  typedFieldDef(channel) {
    const fieldDef = this.fieldDef(channel);
    if (isTypedFieldDef(fieldDef)) {
      return fieldDef;
    }
    return null;
  }
}
//# sourceMappingURL=unit.js.map

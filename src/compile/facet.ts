import {AggregateOp} from 'vega';
import {Channel, COLUMN, ROW, ScaleChannel} from '../channel';
import {Config} from '../config';
import {reduce} from '../encoding';
import {FacetMapping} from '../facet';
import {FieldDef, normalize, title as fieldDefTitle, vgField} from '../fielddef';
import * as log from '../log';
import {hasDiscreteDomain} from '../scale';
import {NormalizedFacetSpec} from '../spec';
import {contains} from '../util';
import {isVgRangeStep, RowCol, VgAxis, VgData, VgLayout, VgMarkGroup, VgSignal} from '../vega.schema';
import {assembleAxis} from './axis/assemble';
import {buildModel} from './buildmodel';
import {assembleFacetData} from './data/assemble';
import {parseData} from './data/parse';
import {getHeaderType, HeaderChannel, HeaderComponent} from './layout/header';
import {parseChildrenLayoutSize} from './layoutsize/parse';
import {Model, ModelWithField} from './model';
import {RepeaterValue, replaceRepeaterInFacet} from './repeater';
import {parseGuideResolve} from './resolve';
import {assembleDomain, getFieldFromDomain} from './scale/domain';

export class FacetModel extends ModelWithField {
  public readonly type: 'facet' = 'facet';
  public readonly facet: FacetMapping<string>;

  public readonly child: Model;

  public readonly children: Model[];

  constructor(spec: NormalizedFacetSpec, parent: Model, parentGivenName: string, repeater: RepeaterValue, config: Config) {
    super(spec, parent, parentGivenName, config, repeater, spec.resolve);


    this.child = buildModel(spec.spec, this, this.getName('child'), undefined, repeater, config, false);
    this.children = [this.child];

    const facet: FacetMapping<string> = replaceRepeaterInFacet(spec.facet, repeater);

    this.facet = this.initFacet(facet);
  }

  private initFacet(facet: FacetMapping<string>): FacetMapping<string> {
    // clone to prevent side effect to the original spec
    return reduce(facet, function(normalizedFacet, fieldDef: FieldDef<string>, channel: Channel) {
      if (!contains([ROW, COLUMN], channel)) {
        // Drop unsupported channel
        log.warn(log.message.incompatibleChannel(channel, 'facet'));
        return normalizedFacet;
      }

      if (fieldDef.field === undefined) {
        log.warn(log.message.emptyFieldDef(fieldDef, channel));
        return normalizedFacet;
      }

      // Convert type to full, lowercase type, or augment the fieldDef with a default type if missing.
      normalizedFacet[channel] = normalize(fieldDef, channel);
      return normalizedFacet;
    }, {});
  }

  public channelHasField(channel: Channel): boolean {
    return !!this.facet[channel];
  }

  public fieldDef(channel: Channel): FieldDef<string> {
    return this.facet[channel];
  }

  public parseData() {
    this.component.data = parseData(this);
    this.child.parseData();
  }

  public parseLayoutSize() {
    parseChildrenLayoutSize(this);
  }

  public parseSelection() {
    // As a facet has a single child, the selection components are the same.
    // The child maintains its selections to assemble signals, which remain
    // within its unit.
    this.child.parseSelection();
    this.component.selection = this.child.component.selection;
  }

  public parseMarkGroup() {
    this.child.parseMarkGroup();
  }

  public parseAxisAndHeader() {
    this.child.parseAxisAndHeader();

    this.parseHeader('column');
    this.parseHeader('row');

    this.mergeChildAxis('x');
    this.mergeChildAxis('y');
  }

  private parseHeader(channel: HeaderChannel) {

    if (this.channelHasField(channel)) {
      const fieldDef = this.facet[channel];
      const header = fieldDef.header || {};
      let title = fieldDef.title !== undefined ? fieldDef.title :
        header.title !== undefined ? header.title : fieldDefTitle(fieldDef, this.config);

      if (this.child.component.layoutHeaders[channel].title) {
        // merge title with child to produce "Title / Subtitle / Sub-subtitle"
        title += ' / ' + this.child.component.layoutHeaders[channel].title;
        this.child.component.layoutHeaders[channel].title = null;
      }

      this.component.layoutHeaders[channel] = {
        title,
        facetFieldDef: fieldDef,
        // TODO: support adding label to footer as well
        header: [this.makeHeaderComponent(channel, true)]
      };
    }
  }

  private makeHeaderComponent(channel: HeaderChannel, labels: boolean): HeaderComponent {
    const sizeType = channel === 'row' ? 'height' : 'width';

    return {
      labels,
      sizeSignal: this.child.component.layoutSize.get(sizeType) ? this.child.getSizeSignalRef(sizeType) : undefined,
      axes: []
    };
  }

  private mergeChildAxis(channel: 'x' | 'y') {
    const {child} = this;
    if (child.component.axes[channel]) {
      const {layoutHeaders, resolve} = this.component;
      resolve.axis[channel] = parseGuideResolve(resolve, channel);

      if (resolve.axis[channel] === 'shared') {
        // For shared axis, move the axes to facet's header or footer
        const headerChannel = channel === 'x' ? 'column' : 'row';

        const layoutHeader = layoutHeaders[headerChannel];
        for (const axisComponent of child.component.axes[channel]) {
          const headerType = getHeaderType(axisComponent.get('orient'));
          layoutHeader[headerType] = layoutHeader[headerType] ||
          [this.makeHeaderComponent(headerChannel, false)];

          const mainAxis = assembleAxis(axisComponent, 'main', this.config, {header: true});
          // LayoutHeader no longer keep track of property precedence, thus let's combine.
          layoutHeader[headerType][0].axes.push(mainAxis);
          axisComponent.mainExtracted = true;
        }
      } else {
        // Otherwise do nothing for independent axes
      }
    }
  }

  public assembleSelectionTopLevelSignals(signals: any[]): VgSignal[] {
    return this.child.assembleSelectionTopLevelSignals(signals);
  }

  public assembleSelectionSignals(): VgSignal[] {
    this.child.assembleSelectionSignals();
    return [];
  }

  public assembleSelectionData(data: VgData[]): VgData[] {
    return this.child.assembleSelectionData(data);
  }

  private getLayoutBandMixins(headerType: 'header' | 'footer'): {
    headerBand?: RowCol<number>,
    footerBand?: RowCol<number>
  } {
    const bandMixins = {};

    const bandType = headerType === 'header' ? 'headerBand' : 'footerBand';

    for (const channel of ['row', 'column'] as ('row' | 'column')[]) {
      const layoutHeaderComponent = this.component.layoutHeaders[channel];
      const headerComponent = layoutHeaderComponent[headerType];
      if (headerComponent && headerComponent[0]) {
        const sizeType = channel === 'row' ? 'height' : 'width';

        if (!this.child.component.layoutSize.get(sizeType)) {
          // If facet child does not have size signal, then apply headerBand
          bandMixins[bandType] = bandMixins[bandType] || {};
          bandMixins[bandType][channel] = 0.5;
        }
      }
    }
    return bandMixins;
  }

  public assembleLayout(): VgLayout {
    const columns = this.channelHasField('column') ? this.columnDistinctSignal() : 1;

    // TODO: determine default align based on shared / independent scales

    return {
      padding: {row: 10, column: 10},
      ...this.getLayoutBandMixins('header'),
      ...this.getLayoutBandMixins('footer'),

      // TODO: support offset for rowHeader/rowFooter/rowTitle/columnHeader/columnFooter/columnTitle
      offset: 10,
      columns,
      bounds: 'full',
      align: 'all'
    };
  }

  public assembleLayoutSignals(): VgSignal[] {
    // FIXME(https://github.com/vega/vega-lite/issues/1193): this can be incorrect if we have independent scales.
    return this.child.assembleLayoutSignals();
  }

  private columnDistinctSignal() {
    if (this.parent && (this.parent instanceof FacetModel)) {
      // For nested facet, we will add columns to group mark instead
      // See discussion in https://github.com/vega/vega/issues/952
      // and https://github.com/vega/vega-view/releases/tag/v1.2.6
      return undefined;
    } else {
      // In facetNode.assemble(), the name is always this.getName('column') + '_layout'.
      const facetLayoutDataName = this.getName('column_domain');
      return {signal: `length(data('${facetLayoutDataName}'))`};
    }
  }

  public assembleGroup(signals: VgSignal[]) {
    if (this.parent && (this.parent instanceof FacetModel)) {
      // Provide number of columns for layout.
      // See discussion in https://github.com/vega/vega/issues/952
      // and https://github.com/vega/vega-view/releases/tag/v1.2.6
      return {
        ...(this.channelHasField('column') ? {
          encode: {
            update: {
              // TODO(https://github.com/vega/vega-lite/issues/2759):
              // Correct the signal for facet of concat of facet_column
              columns: {field: vgField(this.facet.column, {prefix: 'distinct'})}
            }
          }
        } : {}),
        ...super.assembleGroup(signals)
      };
    }
    return super.assembleGroup(signals);
  }

  /**
   * Aggregate cardinality for calculating size
   */
  private getCardinalityAggregateForChild() {
    const fields: string[] = [];
    const ops: AggregateOp[] = [];
    if (this.child instanceof FacetModel) {
      if (this.child.channelHasField('column')) {
        fields.push(vgField(this.child.facet.column));
        ops.push('distinct');
      }
    } else {
      for (const channel of ['x', 'y'] as ScaleChannel[]) {
        const childScaleComponent = this.child.component.scales[channel];
        if (childScaleComponent && !childScaleComponent.merged) {
          const type = childScaleComponent.get('type');
          const range = childScaleComponent.get('range');

          if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
            const domain = assembleDomain(this.child, channel);
            const field = getFieldFromDomain(domain);
            if (field) {
              fields.push(field);
              ops.push('distinct');
            } else {
              log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
            }
          }
        }
      }
    }
    return fields.length ? {fields, ops} : undefined;
  }

  public assembleMarks(): VgMarkGroup[] {
    const {child, facet} = this;
    const facetRoot = this.component.data.facetRoot;
    const data = assembleFacetData(facetRoot);

    // If we facet by two dimensions, we need to add a cross operator to the aggregation
    // so that we create all groups
    const hasRow = this.channelHasField(ROW);
    const hasColumn = this.channelHasField(COLUMN);
    const layoutSizeEncodeEntry = child.assembleLayoutSize();

    const aggregateMixins: any = {};
    if (hasRow && hasColumn) {
      aggregateMixins.aggregate = {cross: true};
    }
    const cardinalityAggregateForChild = this.getCardinalityAggregateForChild();
    if (cardinalityAggregateForChild) {
      aggregateMixins.aggregate = {
        ...aggregateMixins.aggregate,
        ...cardinalityAggregateForChild
      };
    }

    const title = child.assembleTitle();
    const style = child.assembleGroupStyle();

    const markGroup = {
      name: this.getName('cell'),
      type: 'group',
      ...(title? {title} : {}),
      ...(style? {style} : {}),
      from: {
        facet: {
          name: facetRoot.name,
          data: facetRoot.data,
          groupby: [].concat(
            hasRow ? [this.vgField(ROW)] : [],
            hasColumn ? [this.vgField(COLUMN)] : []
          ),
          ...aggregateMixins
        }
      },
      sort: {
        field: [].concat(
          hasRow ? [this.vgField(ROW, {expr: 'datum',})] : [],
          hasColumn ? [this.vgField(COLUMN, {expr: 'datum'})] : []
        ),
        order: [].concat(
          hasRow ? [ (facet.row.sort) || 'ascending'] : [],
          hasColumn ? [ (facet.column.sort) || 'ascending'] : []
        )
      },
      ...(data.length > 0 ? {data: data} : {}),
      ...(layoutSizeEncodeEntry ? {encode: {update: layoutSizeEncodeEntry}} : {}),
      ...child.assembleGroup()
    };

    return [markGroup];
  }

  protected getMapping() {
    return this.facet;
  }
}

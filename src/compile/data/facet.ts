import type {AggregateOp, SignalRef, Transforms as VgTransform} from 'vega';
import {isArray, stringValue} from 'vega-util';
import {isBinning} from '../../bin.js';
import {COLUMN, FacetChannel, FACET_CHANNELS, POSITION_SCALE_CHANNELS, ROW} from '../../channel.js';
import {vgField} from '../../channeldef.js';
import * as log from '../../log/index.js';
import {hasDiscreteDomain} from '../../scale.js';
import {DEFAULT_SORT_OP, EncodingSortField, isSortField} from '../../sort.js';
import type {EncodingFacetMapping, FacetFieldDef} from '../../spec/facet.js';
import {hash} from '../../util.js';
import {isVgRangeStep, VgData} from '../../vega.schema.js';
import type {FacetModel} from '../facet.js';
import {HEADER_CHANNELS, HEADER_TYPES} from '../header/component.js';
import {Model} from '../model.js';
import {assembleDomain, getFieldFromDomain} from '../scale/domain.js';
import {sortArrayIndexField} from './calculate.js';
import {DataFlowNode} from './dataflow.js';

interface ChildIndependentFieldsWithStep {
  x?: string;
  y?: string;
}

export function isCrossedFacetWithCustomSort(facet: Pick<EncodingFacetMapping<string, SignalRef>, 'row' | 'column'>) {
  const {row, column} = facet;
  return !!(row && column && (isCustomSortField(row) || isCustomSortField(column)));
}

function isCustomSortField(fieldDef?: FacetFieldDef<string, SignalRef>) {
  return !!fieldDef && (isSortField(fieldDef.sort) || isArray(fieldDef.sort));
}

export function facetLookupKeyFieldName(model: Model, channel: FacetChannel) {
  return model.getName(`${channel}_facet_key`);
}

export function facetLookupKeyExpr(fieldDef: FacetFieldDef<string, SignalRef>, datum: 'datum' | 'datum.datum') {
  const fields = [vgField(fieldDef, {expr: datum})];

  if (isBinning(fieldDef.bin)) {
    fields.push(vgField(fieldDef, {expr: datum, binSuffix: 'end'}));
  }

  return `join([${fields
    .map((field) => `isValid(${field}) ? length(toString(${field})) + ':' + toString(${field}) : '-1:'`)
    .join(', ')}], '|')`;
}

interface FacetChannelInfo {
  name: string;
  fields: string[];
  sortField?: EncodingSortField<string>;

  sortIndexField?: string;
}

/**
 * A node that helps us track what fields we are faceting by.
 */
export class FacetNode extends DataFlowNode {
  private readonly column: FacetChannelInfo;

  private readonly row: FacetChannelInfo;

  private readonly facet: FacetChannelInfo;

  private readonly childModel: Model;

  /**
   * @param model The facet model.
   * @param name The name that this facet source will have.
   * @param data The source data for this facet data.
   */
  public constructor(
    parent: DataFlowNode,
    public readonly model: FacetModel,
    public readonly name: string,
    public data: string,
  ) {
    super(parent);

    for (const channel of FACET_CHANNELS) {
      const fieldDef = model.facet[channel];
      if (fieldDef) {
        const {bin, sort} = fieldDef;
        this[channel] = {
          name: model.getName(`${channel}_domain`),
          fields: [vgField(fieldDef), ...(isBinning(bin) ? [vgField(fieldDef, {binSuffix: 'end'})] : [])],
          ...(isSortField(sort)
            ? {sortField: sort as EncodingSortField<string>}
            : isArray(sort)
              ? {sortIndexField: sortArrayIndexField(fieldDef, channel)}
              : {}),
        };
      }
    }
    this.childModel = model.child;
  }

  public hash() {
    let out = `Facet`;

    for (const channel of FACET_CHANNELS) {
      if (this[channel]) {
        out += ` ${channel.charAt(0)}:${hash(this[channel])}`;
      }
    }

    return out;
  }

  get fields() {
    const f: string[] = [];

    for (const channel of FACET_CHANNELS) {
      if (this[channel]?.fields) {
        f.push(...this[channel].fields);
      }
    }
    return f;
  }

  public dependentFields() {
    const depFields = new Set<string>(this.fields);

    for (const channel of FACET_CHANNELS) {
      if (this[channel]) {
        if (this[channel].sortField) {
          depFields.add(this[channel].sortField.field);
        }
        if (this[channel].sortIndexField) {
          depFields.add(this[channel].sortIndexField);
        }
      }
    }

    return depFields;
  }

  public producedFields() {
    return new Set<string>(); // facet does not produce any new fields
  }

  /**
   * The name to reference this source is its name.
   */
  public getSource() {
    return this.name;
  }

  private getChildIndependentFieldsWithStep() {
    const childIndependentFieldsWithStep: ChildIndependentFieldsWithStep = {};

    for (const channel of POSITION_SCALE_CHANNELS) {
      const childScaleComponent = this.childModel.component.scales[channel];
      if (childScaleComponent && !childScaleComponent.merged) {
        const type = childScaleComponent.get('type');
        const range = childScaleComponent.get('range');

        if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
          const domain = assembleDomain(this.childModel, channel);
          const field = getFieldFromDomain(domain);
          if (field) {
            childIndependentFieldsWithStep[channel] = field;
          } else {
            log.warn(log.message.unknownField(channel));
          }
        }
      }
    }

    return childIndependentFieldsWithStep;
  }

  private facetChannelHasCardinality(
    channel: 'row' | 'column' | 'facet',
    childIndependentFieldsWithStep: ChildIndependentFieldsWithStep,
  ): boolean {
    const childChannel = ({row: 'y', column: 'x', facet: undefined} as const)[channel];
    return !!(childChannel && childIndependentFieldsWithStep?.[childChannel]);
  }

  /**
   * The aggregate that computes a channel's custom sort metadata over the original data,
   * grouped by that channel only. Returns null when the channel has no custom sort.
   */
  private getFacetSortAggregate(
    channel: 'row' | 'column' | 'facet',
  ): {field: string; op: AggregateOp; as: string} | null {
    const info = this[channel];
    if (!info) {
      return null;
    }
    const {sortField, sortIndexField} = info;
    if (sortField) {
      const {op = DEFAULT_SORT_OP, field} = sortField;
      return {field, op, as: vgField(sortField, {forAs: true})};
    } else if (sortIndexField) {
      return {field: sortIndexField, op: 'max', as: sortIndexField};
    }
    return null;
  }

  /**
   * When the child has an independent discrete scale sized by range steps, the per-row/column
   * cardinalities come from the crossed dataset (grouped by row x column). That crossed dataset
   * does not carry the custom sort field, and re-aggregating its per-cell values would compute an
   * incorrect op-of-op (e.g. a median of per-cell medians). So when a channel needs both the
   * crossed cardinality and a custom sort, the sort metadata is computed in a separate
   * single-channel aggregate over the original data and joined back into the domain via a lookup
   * formula (the same indexof/pluck machinery #9818 uses for cell sorting).
   */
  private joinsFacetSortFromCrossedData(
    channel: 'row' | 'column' | 'facet',
    crossedDataName: string,
    childIndependentFieldsWithStep: ChildIndependentFieldsWithStep,
  ): boolean {
    return (
      !!crossedDataName &&
      !!this.getFacetSortAggregate(channel) &&
      this.facetChannelHasCardinality(channel, childIndependentFieldsWithStep)
    );
  }

  private facetSortDomainName(channel: 'row' | 'column' | 'facet') {
    return this.model.getName(`${channel}_domain_sort`);
  }

  /**
   * Expression that reads a channel's custom sort value out of the separate single-channel sort
   * aggregate, matching on the same facet key expression used by #9818's cell-sort lookup.
   */
  private facetSortLookupExpr(channel: 'row' | 'column' | 'facet', sortValueField: string): string {
    const fieldDef = this.model.facet[channel];
    const sortDataExpr = `data(${stringValue(this.facetSortDomainName(channel))})`;
    const keyField = facetLookupKeyFieldName(this.model, channel);
    const indexExpr = `indexof(pluck(${sortDataExpr}, ${stringValue(keyField)}), ${facetLookupKeyExpr(
      fieldDef,
      'datum',
    )})`;
    return `${indexExpr} >= 0 ? ${sortDataExpr}[${indexExpr}][${stringValue(sortValueField)}] : null`;
  }

  private assembleRowColumnHeaderData(
    channel: 'row' | 'column' | 'facet',
    crossedDataName: string,
    childIndependentFieldsWithStep: ChildIndependentFieldsWithStep,
  ): VgData {
    const childChannel = ({row: 'y', column: 'x', facet: undefined} as const)[channel];

    const fields: string[] = [];
    const ops: AggregateOp[] = [];
    const as: string[] = [];

    const hasCardinality = this.facetChannelHasCardinality(channel, childIndependentFieldsWithStep);

    if (hasCardinality) {
      if (crossedDataName) {
        // If there is a crossed data, calculate max
        fields.push(`distinct_${childIndependentFieldsWithStep[childChannel]}`);

        ops.push('max');
      } else {
        // If there is no crossed data, just calculate distinct
        fields.push(childIndependentFieldsWithStep[childChannel]);
        ops.push('distinct');
      }
      // Although it is technically a max, just name it distinct so it's easier to refer to it
      as.push(`distinct_${childIndependentFieldsWithStep[childChannel]}`);
    }

    const sortAggregate = this.getFacetSortAggregate(channel);
    const joinSortFromCrossed = this.joinsFacetSortFromCrossedData(
      channel,
      crossedDataName,
      childIndependentFieldsWithStep,
    );

    // Only inline the sort field when it can be computed correctly in this aggregate, i.e. when
    // we are not sourcing per-cell cardinality from the crossed dataset (which lacks the field).
    // Otherwise it is joined in below.
    if (sortAggregate && !joinSortFromCrossed) {
      fields.push(sortAggregate.field);
      ops.push(sortAggregate.op);
      as.push(sortAggregate.as);
    }

    const transform: VgTransform[] = [
      {
        type: 'aggregate',
        groupby: this[channel].fields,
        ...(fields.length
          ? {
              fields,
              ops,
              as,
            }
          : {}),
      },
    ];

    if (joinSortFromCrossed) {
      // The crossed dataset lacks the sort field, so join in the value computed by the separate
      // single-channel aggregate (see assembleFacetSortAggregateData). This mirrors #9818's
      // cell-sort lookup and avoids re-aggregating per-cell values (op-of-op).
      transform.push({
        type: 'formula',
        expr: this.facetSortLookupExpr(channel, sortAggregate.as),
        as: sortAggregate.as,
      });
    }

    return {
      name: this[channel].name,
      // Source from the crossed dataset when we need its per-cell cardinality; otherwise
      // (including when we only need custom sort metadata) source from the original data so the
      // sort field is available.
      source: crossedDataName && (hasCardinality || !sortAggregate) ? crossedDataName : this.data,
      transform,
    };
  }

  private assembleFacetSortAggregateData(
    channel: 'row' | 'column',
    crossedDataName: string,
    childIndependentFieldsWithStep: ChildIndependentFieldsWithStep,
  ): VgData | null {
    if (!this.joinsFacetSortFromCrossedData(channel, crossedDataName, childIndependentFieldsWithStep)) {
      return null;
    }

    const sortAggregate = this.getFacetSortAggregate(channel);

    return {
      name: this.facetSortDomainName(channel),
      source: this.data,
      transform: [
        {
          type: 'aggregate',
          groupby: this[channel].fields,
          fields: [sortAggregate.field],
          ops: [sortAggregate.op],
          as: [sortAggregate.as],
        },
        {
          type: 'formula',
          expr: facetLookupKeyExpr(this.model.facet[channel], 'datum'),
          as: facetLookupKeyFieldName(this.model, channel),
        },
      ],
    };
  }

  private assembleFacetHeaderData(childIndependentFieldsWithStep: ChildIndependentFieldsWithStep) {
    const {columns} = this.model.layout;
    const {layoutHeaders} = this.model.component;
    const data: VgData[] = [];

    const hasSharedAxis: {row?: true; column?: true} = {};
    for (const headerChannel of HEADER_CHANNELS) {
      for (const headerType of HEADER_TYPES) {
        const headers = layoutHeaders[headerChannel]?.[headerType] ?? [];
        for (const header of headers) {
          if (header.axes?.length > 0) {
            hasSharedAxis[headerChannel] = true;
            break;
          }
        }
      }

      if (hasSharedAxis[headerChannel]) {
        const cardinality = `length(data("${this.facet.name}"))`;

        const stop =
          headerChannel === 'row'
            ? columns
              ? {signal: `ceil(${cardinality} / ${columns})`}
              : 1
            : columns
              ? {signal: `min(${cardinality}, ${columns})`}
              : {signal: cardinality};

        data.push({
          name: `${this.facet.name}_${headerChannel}`,
          transform: [
            {
              type: 'sequence',
              start: 0,
              stop,
            },
          ],
        });
      }
    }

    const {row, column} = hasSharedAxis;

    if (row || column) {
      data.unshift(this.assembleRowColumnHeaderData('facet', null, childIndependentFieldsWithStep));
    }

    return data;
  }

  private assembleFacetLookupDomainData(channel: 'row' | 'column'): VgData | null {
    const facetChannel = this[channel];

    if (!facetChannel || (!facetChannel.sortField && !facetChannel.sortIndexField)) {
      return null;
    }

    return {
      name: this.model.getName(`${channel}_lookup_domain`),
      source: facetChannel.name,
      transform: [
        {
          type: 'formula',
          expr: facetLookupKeyExpr(this.model.facet[channel], 'datum'),
          as: facetLookupKeyFieldName(this.model, channel),
        },
      ],
    };
  }

  private assembleFacetSortLookupData(): VgData[] {
    return ([ROW, COLUMN] as const)
      .map((channel) => this.assembleFacetLookupDomainData(channel))
      .filter((lookupData): lookupData is VgData => lookupData !== null);
  }

  public assemble() {
    const data: VgData[] = [];
    let crossedDataName = null;
    const childIndependentFieldsWithStep = this.getChildIndependentFieldsWithStep();

    const {column, row, facet} = this;

    if (column && row && (childIndependentFieldsWithStep.x || childIndependentFieldsWithStep.y)) {
      // Need to create a cross dataset to correctly calculate cardinality
      crossedDataName = `cross_${this.column.name}_${this.row.name}`;

      const fields: string[] = [].concat(
        childIndependentFieldsWithStep.x ?? [],
        childIndependentFieldsWithStep.y ?? [],
      );
      const ops = fields.map((): AggregateOp => 'distinct');

      data.push({
        name: crossedDataName,
        source: this.data,
        transform: [
          {
            type: 'aggregate',
            groupby: this.fields,
            fields,
            ops,
          },
        ],
      });
    }

    for (const channel of [COLUMN, ROW] as const) {
      if (this[channel]) {
        const sortAggregateData = this.assembleFacetSortAggregateData(
          channel,
          crossedDataName,
          childIndependentFieldsWithStep,
        );
        if (sortAggregateData) {
          data.push(sortAggregateData);
        }
        data.push(this.assembleRowColumnHeaderData(channel, crossedDataName, childIndependentFieldsWithStep));
      }
    }

    if (isCrossedFacetWithCustomSort(this.model.facet)) {
      data.push(...this.assembleFacetSortLookupData());
    }

    if (facet) {
      const facetData = this.assembleFacetHeaderData(childIndependentFieldsWithStep);
      if (facetData) {
        data.push(...facetData);
      }
    }

    return data;
  }
}

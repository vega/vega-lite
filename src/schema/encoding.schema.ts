import {detailChannelDefs, textChannelDef, FieldDef} from './fielddef.schema';
import {positionChannelDef, PositionChannelDef} from './fielddef.schema';
import {facetChannelDef, FacetChannelDef} from './fielddef.schema';
import {channelDefWithLegend, shapeChannelDef, ChannelDefWithLegend} from './fielddef.schema';
import {orderChannelDefs, OrderChannelDef} from './fielddef.schema';

export interface Encoding {
  x?: PositionChannelDef;
  y?: PositionChannelDef;
  row?: FacetChannelDef;
  column?: FacetChannelDef;
  color?: ChannelDefWithLegend;
  size?: ChannelDefWithLegend;
  shape?: ChannelDefWithLegend; // TODO: maybe distinguish ordinal-only
  detail?: FieldDef | FieldDef[];
  text?: FieldDef;
  label?: FieldDef;

  path?: OrderChannelDef | OrderChannelDef[];
  order?: OrderChannelDef | OrderChannelDef[];
}

export const encoding = {
  type: 'object',
  properties: {
    x: positionChannelDef,
    y: positionChannelDef,
    row: facetChannelDef,
    column: facetChannelDef,
    size: channelDefWithLegend,
    color: channelDefWithLegend,
    shape: shapeChannelDef,
    text: textChannelDef,
    detail: detailChannelDefs,
    label: textChannelDef,
    path: orderChannelDefs,
    order: orderChannelDefs
  }
};

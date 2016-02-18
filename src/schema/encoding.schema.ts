import {FieldDef} from './fielddef.schema';
import {PositionChannelDef} from './fielddef.schema';
import {FacetChannelDef} from './fielddef.schema';
import {ChannelDefWithLegend} from './fielddef.schema';
import {OrderChannelDef} from './fielddef.schema';

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

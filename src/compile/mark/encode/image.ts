import { UnitModel } from "../../unit";

// encode the image url
export function imageUrl(model: UnitModel) {
  const { markDef } = model;
  // if the mark definition contains the property of url as the image url to be shown
  if(markDef["url"] != undefined){
    return {url:{"value":markDef["url"]}};
  }else{
    return {};
  }
}

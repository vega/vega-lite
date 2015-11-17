import Encoding from '../Encoding';
import * as vlEncDef from '../encdef';
import {Enctype} from '../consts';

export default function(encoding: Encoding, stats) {
  return {
    opacity: estimateOpacity(encoding, stats),
  };
};

function estimateOpacity(encoding,stats) {
  if (!stats) {
    return 1;
  }

  var numPoints = 0;

  if (encoding.isAggregate()) { // aggregate plot
    numPoints = 1;

    //  get number of points in each "cell"
    //  by calculating product of cardinality
    //  for each non faceting and non-ordinal X / Y fields
    //  note that ordinal x,y are not include since we can
    //  consider that ordinal x are subdividing the cell into subcells anyway
    encoding.forEach(function(fieldDef, encType) {

      if (encType !== Enctype.ROW && encType !== Enctype.COL &&
          !((encType === Enctype.X || encType === Enctype.Y) &&
          vlEncDef.isOrdinalScale(fieldDef))
        ) {
        numPoints *= encoding.cardinality(encType, stats);
      }
    });

  } else { // raw plot

    // TODO: error handling
    if (!stats['*'])
      return 1;

    numPoints = stats['*'].max;  // count

    // small multiples divide number of points
    var numMultiples = 1;
    if (encoding.has(Enctype.ROW)) {
      numMultiples *= encoding.cardinality(Enctype.ROW, stats);
    }
    if (encoding.has(Enctype.COL)) {
      numMultiples *= encoding.cardinality(Enctype.COL, stats);
    }
    numPoints /= numMultiples;
  }

  var opacity = 0;
  if (numPoints <= 25) {
    opacity = 1;
  } else if (numPoints < 200) {
    opacity = 0.8;
  } else if (numPoints < 1000 || encoding.is('tick')) {
    opacity = 0.7;
  } else {
    opacity = 0.3;
  }

  return opacity;
}

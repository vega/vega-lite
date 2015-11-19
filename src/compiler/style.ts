import {Model} from './Model';
import * as vlFieldDef from '../fielddef';
import {ROW, COL, X, Y, Channel} from '../channel';

export default function(model: Model, stats) {
  return {
    opacity: estimateOpacity(model, stats),
  };
};

function estimateOpacity(model: Model, stats) {
  if (!stats) {
    return 1;
  }

  var numPoints = 0;

  if (model.isAggregate()) { // aggregate plot
    numPoints = 1;

    //  get number of points in each "cell"
    //  by calculating product of cardinality
    //  for each non faceting and non-ordinal X / Y fields
    //  note that ordinal x,y are not include since we can
    //  consider that ordinal x are subdividing the cell into subcells anyway
    model.forEach(function(fieldDef, channel: Channel) {

      if (channel !== ROW && channel !== COL &&
          !((channel === X || channel === Y) &&
          vlFieldDef.isOrdinalScale(fieldDef))
        ) {
        numPoints *= model.cardinality(channel, stats);
      }
    });

  } else { // raw plot

    // TODO: error handling
    if (!stats['*'])
      return 1;

    numPoints = stats['*'].max;  // count

    // small multiples divide number of points
    var numMultiples = 1;
    if (model.has(ROW)) {
      numMultiples *= model.cardinality(ROW, stats);
    }
    if (model.has(COL)) {
      numMultiples *= model.cardinality(COL, stats);
    }
    numPoints /= numMultiples;
  }

  var opacity = 0;
  if (numPoints <= 25) {
    opacity = 1;
  } else if (numPoints < 200) {
    opacity = 0.8;
  } else if (numPoints < 1000 || model.is('tick')) {
    opacity = 0.7;
  } else {
    opacity = 0.3;
  }

  return opacity;
}

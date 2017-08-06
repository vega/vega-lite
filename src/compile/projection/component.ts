import {X, Y} from '../../channel';
import {Config} from '../../config';
import {MAIN} from '../../data';
import {Encoding} from '../../encoding';
import {Field} from '../../fielddef';
import {GEOSHAPE, Mark} from '../../mark';
import {Projection, PROJECTION_PROPERTIES, ProjectionType} from '../../projection';
import {duplicate} from '../../util';
import {isVgSignalRef, VgProjection, VgSignal, VgSignalRef} from '../../vega.schema';
import {ModelWithField} from '../model';
import {Explicit, Split} from '../split';
import {UnitModel} from '../unit';


export class ProjectionComponent extends Split<Partial<VgProjection>> {
  public merged = false;

  constructor(name: string, specifiedProjection: Projection, private dimensions: string[], private data: VgSignalRef | string) {
    super(
      {...specifiedProjection},  // all explicit properties of projection
      {name}  // name as initial implicit property
    );
  }

  get isEmpty(): boolean {
    return JSON.stringify(this.explicit) === JSON.stringify({});
  }

  get size(): VgSignalRef {
    return {
      signal: `'[${this.dimensions.toString()}]'`
    };
  }

  public fit(model: ModelWithField): VgSignalRef {
    if (isVgSignalRef(this.data)) {
      return this.data;
    } else {
      const finalDataName = model.lookupDataSource(this.data);
      return {
        signal: `data('${finalDataName}')`
      } as VgSignalRef;
    }
  }
}

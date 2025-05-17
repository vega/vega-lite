import {Split} from '../split.js';
export class ProjectionComponent extends Split {
  specifiedProjection;
  size;
  data;
  merged = false;
  constructor(name, specifiedProjection, size, data) {
    super(
      {...specifiedProjection}, // all explicit properties of projection
      {name},
    );
    this.specifiedProjection = specifiedProjection;
    this.size = size;
    this.data = data;
  }
  /**
   * Whether the projection parameters should fit provided data.
   */
  get isFit() {
    return !!this.data;
  }
}
//# sourceMappingURL=component.js.map

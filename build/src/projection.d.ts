import { VgProjectionType } from './vega.schema';
export declare type ProjectionType = VgProjectionType;
export interface Projection {
    /**
     * The cartographic projection to use. This value is case-insensitive, for example `"albers"` and `"Albers"` indicate the same projection type. You can find all valid projection types [in the documentation](https://vega.github.io/vega-lite/docs/projection.html#projection-types).
     *
     * __Default value:__ `mercator`
     */
    type?: ProjectionType;
    /**
     * Sets the projection’s clipping circle radius to the specified angle in degrees. If `null`, switches to [antimeridian](http://bl.ocks.org/mbostock/3788999) cutting rather than small-circle clipping.
     */
    clipAngle?: number;
    /**
     * Sets the projection’s viewport clip extent to the specified bounds in pixels. The extent bounds are specified as an array `[[x0, y0], [x1, y1]]`, where `x0` is the left-side of the viewport, `y0` is the top, `x1` is the right and `y1` is the bottom. If `null`, no viewport clipping is performed.
     */
    clipExtent?: number[][];
    /**
     * Sets the projection’s center to the specified center, a two-element array of longitude and latitude in degrees.
     *
     * __Default value:__ `[0, 0]`
     */
    center?: number[];
    /**
     * Sets the projection’s three-axis rotation to the specified angles, which must be a two- or three-element array of numbers [`lambda`, `phi`, `gamma`] specifying the rotation angles in degrees about each spherical axis. (These correspond to yaw, pitch and roll.)
     *
     * __Default value:__ `[0, 0, 0]`
     */
    rotate?: number[];
    /**
     * Sets the threshold for the projection’s [adaptive resampling](http://bl.ocks.org/mbostock/3795544) to the specified value in pixels. This value corresponds to the [Douglas–Peucker distance](http://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm). If precision is not specified, returns the projection’s current resampling precision which defaults to `√0.5 ≅ 0.70710…`.
     */
    precision?: string;
    coefficient?: number;
    distance?: number;
    fraction?: number;
    lobes?: number;
    parallel?: number;
    radius?: number;
    ratio?: number;
    spacing?: number;
    tilt?: number;
}
/**
 * Any property of Projection can be in config
 */
export declare type ProjectionConfig = Projection;
export declare const PROJECTION_PROPERTIES: (keyof Projection)[];

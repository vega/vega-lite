import * as tslib_1 from "tslib";
import { duplicate } from '../../util';
import { Split } from '../split';
function isFalseOrNull(v) {
    return v === false || v === null;
}
var AxisComponent = /** @class */ (function (_super) {
    tslib_1.__extends(AxisComponent, _super);
    function AxisComponent(explicit, implicit, mainExtracted) {
        if (explicit === void 0) { explicit = {}; }
        if (implicit === void 0) { implicit = {}; }
        if (mainExtracted === void 0) { mainExtracted = false; }
        var _this = _super.call(this) || this;
        _this.explicit = explicit;
        _this.implicit = implicit;
        _this.mainExtracted = mainExtracted;
        return _this;
    }
    AxisComponent.prototype.clone = function () {
        return new AxisComponent(duplicate(this.explicit), duplicate(this.implicit), this.mainExtracted);
    };
    AxisComponent.prototype.hasAxisPart = function (part) {
        // FIXME(https://github.com/vega/vega-lite/issues/2552) this method can be wrong if users use a Vega theme.
        if (part === 'axis') { // always has the axis container part
            return true;
        }
        if (part === 'grid' || part === 'title') {
            return !!this.get(part);
        }
        // Other parts are enabled by default, so they should not be false or null.
        return !isFalseOrNull(this.get(part));
    };
    return AxisComponent;
}(Split));
export { AxisComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvYXhpcy9jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBQyxTQUFTLEVBQU8sTUFBTSxZQUFZLENBQUM7QUFFM0MsT0FBTyxFQUFDLEtBQUssRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUcvQix1QkFBdUIsQ0FBaUI7SUFDdEMsT0FBTyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUM7QUFDbkMsQ0FBQztBQU9EO0lBQW1DLHlDQUF5QjtJQUMxRCx1QkFDa0IsUUFBMEMsRUFDMUMsUUFBMEMsRUFDbkQsYUFBcUI7UUFGWix5QkFBQSxFQUFBLGFBQTBDO1FBQzFDLHlCQUFBLEVBQUEsYUFBMEM7UUFDbkQsOEJBQUEsRUFBQSxxQkFBcUI7UUFIOUIsWUFLRSxpQkFBTyxTQUNSO1FBTGlCLGNBQVEsR0FBUixRQUFRLENBQWtDO1FBQzFDLGNBQVEsR0FBUixRQUFRLENBQWtDO1FBQ25ELG1CQUFhLEdBQWIsYUFBYSxDQUFROztJQUc5QixDQUFDO0lBRU0sNkJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxhQUFhLENBQ3RCLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQ3hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FDN0MsQ0FBQztJQUNKLENBQUM7SUFFTSxtQ0FBVyxHQUFsQixVQUFtQixJQUFjO1FBQy9CLDJHQUEyRztRQUUzRyxJQUFJLElBQUksS0FBSyxNQUFNLEVBQUUsRUFBRSxxQ0FBcUM7WUFDMUQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksSUFBSSxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO1lBQ3ZDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekI7UUFDRCwyRUFBMkU7UUFDM0UsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTdCRCxDQUFtQyxLQUFLLEdBNkJ2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXhpcywgQXhpc1BhcnR9IGZyb20gJy4uLy4uL2F4aXMnO1xuaW1wb3J0IHtGaWVsZERlZkJhc2V9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7ZHVwbGljYXRlLCBPbWl0fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdBeGlzfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1NwbGl0fSBmcm9tICcuLi9zcGxpdCc7XG5cblxuZnVuY3Rpb24gaXNGYWxzZU9yTnVsbCh2OiBib29sZWFuIHwgbnVsbCkge1xuICByZXR1cm4gdiA9PT0gZmFsc2UgfHwgdiA9PT0gbnVsbDtcbn1cblxuZXhwb3J0IHR5cGUgQXhpc0NvbXBvbmVudFByb3BzID0gT21pdDxWZ0F4aXMsICd0aXRsZSc+ICYge1xuXG4gIHRpdGxlOiBzdHJpbmcgfCBGaWVsZERlZkJhc2U8c3RyaW5nPltdO1xufTtcblxuZXhwb3J0IGNsYXNzIEF4aXNDb21wb25lbnQgZXh0ZW5kcyBTcGxpdDxBeGlzQ29tcG9uZW50UHJvcHM+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IGV4cGxpY2l0OiBQYXJ0aWFsPEF4aXNDb21wb25lbnRQcm9wcz4gPSB7fSxcbiAgICBwdWJsaWMgcmVhZG9ubHkgaW1wbGljaXQ6IFBhcnRpYWw8QXhpc0NvbXBvbmVudFByb3BzPiA9IHt9LFxuICAgIHB1YmxpYyBtYWluRXh0cmFjdGVkID0gZmFsc2VcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEF4aXNDb21wb25lbnQoXG4gICAgICBkdXBsaWNhdGUodGhpcy5leHBsaWNpdCksXG4gICAgICBkdXBsaWNhdGUodGhpcy5pbXBsaWNpdCksIHRoaXMubWFpbkV4dHJhY3RlZFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgaGFzQXhpc1BhcnQocGFydDogQXhpc1BhcnQpIHtcbiAgICAvLyBGSVhNRShodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzI1NTIpIHRoaXMgbWV0aG9kIGNhbiBiZSB3cm9uZyBpZiB1c2VycyB1c2UgYSBWZWdhIHRoZW1lLlxuXG4gICAgaWYgKHBhcnQgPT09ICdheGlzJykgeyAvLyBhbHdheXMgaGFzIHRoZSBheGlzIGNvbnRhaW5lciBwYXJ0XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAocGFydCA9PT0gJ2dyaWQnIHx8IHBhcnQgPT09ICd0aXRsZScpIHtcbiAgICAgIHJldHVybiAhIXRoaXMuZ2V0KHBhcnQpO1xuICAgIH1cbiAgICAvLyBPdGhlciBwYXJ0cyBhcmUgZW5hYmxlZCBieSBkZWZhdWx0LCBzbyB0aGV5IHNob3VsZCBub3QgYmUgZmFsc2Ugb3IgbnVsbC5cbiAgICByZXR1cm4gIWlzRmFsc2VPck51bGwodGhpcy5nZXQocGFydCkpO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXhpc0NvbXBvbmVudEluZGV4IHtcbiAgeD86IEF4aXNDb21wb25lbnRbXTtcbiAgeT86IEF4aXNDb21wb25lbnRbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBeGlzSW5kZXgge1xuICB4PzogQXhpcztcbiAgeT86IEF4aXM7XG59XG4iXX0=
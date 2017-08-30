import { Model } from '../model';
import { UnitModel } from '../unit';
export declare function parseMarkDef(model: Model): void;
export declare function parseMarkGroup(model: UnitModel): any[];
export declare function getPathSort(model: UnitModel): {
    field: string;
    order?: "ascending" | "descending";
} | {
    field: string[];
    order?: ("ascending" | "descending")[];
} | {
    field: string;
    order: string;
};

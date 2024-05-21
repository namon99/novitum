import {CONST} from "./const";
import * as mathjs from "mathjs";


// return years
export function deltaYearsFromJ2000(time: number): mathjs.Unit {
    return mathjs.unit(time - CONST.EPOCH_J2000, "sec");
}

// export class Point {
//     constructor(x: number, y: number, z: number) {
//     }
// }
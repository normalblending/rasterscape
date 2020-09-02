import {PatternState} from "../store/patterns/pattern/types";
import * as Bezier from "bezier-js";
import {ERepeatingType} from "../store/patterns/repeating/types";
import {getColorByCoordinate} from "./canvas/helpers/imageData";
import {coordHelper, coordHelper2, coordHelper4, coordHelper5} from "../components/Area/canvasPosition.servise";

const canvasItemId = (i, j) => `${i}-${j}`;

export const getRepeatingCoords = (x: number, y: number, pattern: PatternState, withColor?: boolean) => {

    if (!pattern.config.repeating || !pattern.repeating) {
        return [{
            x,
            y,
            id: canvasItemId(0, 0),
            color: withColor ? getColorByCoordinate(pattern.current.imageData, x, y) : null
        }];
    }

    const {params} = pattern.repeating;

    if (params.type === ERepeatingType.Grid) {
        const {gridParams: {x: xn, y: yn, bezierPoints, xOut, yOut, flat}} = params;
        const {current: {width, height, imageData}, rotation} = pattern;

        const xd = width / xn;
        const yd = height / yn;


        const array = [];

        if (flat) {
            // x = x % xd;
            // y = y % yd;
            for (let i = -xOut; i < xn + xOut; i++) {

                for (let j = -yOut; j < yn + yOut; j++) {


                    const xi = x + xd * i;
                    const yj = y + yd * j;
                    array.push({
                        x: xi,
                        y: yj,
                        id: canvasItemId(i, j),
                        outer: i < 0 || i >= xn || j < 0 || j >= yn,
                        color: withColor ? getColorByCoordinate(imageData, xi, yj) : null
                    });
                }
            }
        } else {


            const curve = new Bezier(bezierPoints);

            // for (let i = xn + xOut - 1; i >= -xOut; i--) {
            for (let i = -xOut; i < xn + xOut; i++) {
                const tx = (x + xd * i) / width;
                const ai = curve.get(tx);


                // for (let j = yn + yOut - 1; j >= -yOut; j--) {
                for (let j = -yOut; j < yn + yOut; j++) {

                    const ty = (y + yd * j) / height;
                    const aj = curve.get(ty);

                    const xij = width * ai.x / 100;
                    const yij = height * aj.y / 100;


                    array.push({
                        x: xij,
                        y: yij,
                        id: canvasItemId(i, j),
                        outer: i < 0 || i >= xn || j < 0 || j >= yn,
                        color: withColor ? getColorByCoordinate(imageData, xij, yij) : null
                    });
                }
            }
        }

        return array;


    }

    return [{x, y}];
};

export function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {x: nx, y: ny};
}
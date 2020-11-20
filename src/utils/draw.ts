import {PatternState} from "../store/patterns/pattern/types";
import * as Bezier from "bezier-js";
import {ERepeatingType} from "../store/patterns/repeating/types";
import {getColorByCoordinate} from "./canvas/helpers/imageData";
import {EToolType} from "../store/tool/types";

const canvasItemId = (i, j) => `${i}-${j}`;

export const getRepeatingCoords = (x: number, y: number, pattern: PatternState, withColor?: boolean, tool?: EToolType) => {

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
        const {current: {imageData}, rotation} = pattern;

        const {width, height} = imageData;

        const xd = width / xn;
        const yd = height / yn;


        const array = [];

        if (flat) {

            let mxOut = xOut;
            let myOut = yOut;

            if (tool !== EToolType.Line) {

                x = (x + xd) % xd;
                y = (y + yd) % yd;
                mxOut = Math.max(xOut, 2);
                myOut = Math.max(yOut, 2);
            }
            for (let i = -mxOut; i < xn + mxOut; i++) {

                for (let j = -myOut; j < yn + myOut; j++) {


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
            let i, j;
            for (let inorm = 0; inorm < xn + 2 * xOut; inorm++) {
                i = inorm - xOut;
                const tx = (x + xd * i) / width;
                const ai = curve.get(tx);


                // for (let j = yn + yOut - 1; j >= -yOut; j--) {
                for (let jnorm = 0; jnorm < yn + 2 * yOut; jnorm++) {
                    j = jnorm - yOut;

                    const ty = (y + yd * j) / height;
                    const aj = curve.get(ty);

                    const xij = width * ai.x / 100;
                    const yij = height * aj.y / 100;


                    array.push({
                        x: xij,
                        y: yij,
                        id: canvasItemId(inorm, jnorm),
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
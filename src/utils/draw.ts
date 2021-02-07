import {PatternState} from "../store/patterns/pattern/types";
import * as Bezier from "bezier-js";
import {ERepeatingType} from "../store/patterns/repeating/types";
import {EToolType} from "../store/tool/types";

const canvasItemId = (i, j) => `${i}-${j}`;

export type RepeatingCoordinatesItem = {
    x: number
    y: number
    id?: string
    outer?: boolean
};

export const getRepeatingCoords = (x: number, y: number, pattern: PatternState, withColor?: boolean, tool?: EToolType): RepeatingCoordinatesItem[] => {

    if (!pattern.config.repeating || !pattern.repeating) {
        return [{
            x,
            y,
            id: canvasItemId(0, 0),
        }];
    }

    const {params} = pattern.repeating;

    if (params.type === ERepeatingType.Grid) {
        const {gridParams: {xd: xn, yd: yn, bezierPoints, xn0, yn0, xn1, yn1, flat}} = params;
        const {current: {imageData}, rotation} = pattern;

        const {width, height} = imageData;

        const xd = width / xn;
        const yd = height / yn;


        const array = [];

        if (flat) {
            // x = x % xd;
            // y = y % yd;

            let mxOut = xn0;
            let myOut = yn0;

            if (tool !== EToolType.Line) {

                x = (x + xd) % xd;
                y = (y + yd) % yd;

                mxOut = Math.max(xn0, 2);
                myOut = Math.max(yn0, 2);
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
                    });
                }
            }
        } else {
            // x = x % xd;
            // y = y % yd;

            const curve = new Bezier(bezierPoints);

            let i, j;
            for (let inorm = 0; inorm < 1 + xn0 + xn1; inorm++) {
                i = inorm - xn0;

                const xnorm = (x + xd * i) / width;
                const ai = curve.get(xnorm);

                for (let jnorm = 0; jnorm < 1 + yn0 + yn1; jnorm++) {
                    j = jnorm - yn0;

                    const ynorm = (y + yd * j) / height;
                    const aj = curve.get(ynorm);


                    const xij = width * ai.x / 100;
                    const yij = height * aj.y / 100;

                    array.push({
                        x: xij,
                        y: yij,
                        id: canvasItemId(inorm, jnorm),
                        outer: i < 0 || i >= xn || j < 0 || j >= yn,
                    });
                }
            }
        }

        return array;


    }

    return [{x, y, id: canvasItemId(0, 0)}];
};

export function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {x: nx, y: ny};
}
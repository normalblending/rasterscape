import {ERepeatingType, PatternState} from "../store/patterns/types";
import * as Bezier from "bezier-js";

export const getRepeatingCoords = (x, y, pattern: PatternState) => {
    if (!pattern.repeating) {
        return [{x, y}];
    }

    const {params} = pattern.repeating;

    if (params.type === ERepeatingType.Grid) {
        const {gridParams: {x: xn, y: yn, bezierPoints, xOut, yOut}} = params;
        const {current: {width, height}, rotation} = pattern;

        const xd = width / xn;
        const yd = height / yn;

        x = x % xd;
        y = y % yd;

        if (x < 0) {
            x +=xd;
        }

        if (y < 0) {
            y +=yd;
        }

        const array = [];

        const curve = new Bezier(bezierPoints);

        for (let i = -xOut; i < xn + xOut; i++) {
            const tx = (x + xd * i) / width;
            const ai = curve.get(tx);


            for (let j = -yOut; j < yn + yOut; j++) {

                const ty = (y + yd * j) / height;
                const aj = curve.get(ty);

                const xij = width * ai.x / 100;
                const yij = height * aj.y / 100;


                array.push({
                    x: xij,
                    y: yij,
                    outer: i < 0 || i >= xn || j < 0 || j >= yn
                });
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
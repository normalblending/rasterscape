import {ERepeatingType, PatternState} from "../store/patterns/types";
import * as Bezier from "bezier-js";

export const getRepeatingCoords = (x, y, pattern: PatternState) => {
    if (!pattern.repeating) {
        return [{x, y}];
    }

    const {params} = pattern.repeating;

    if (params.type === ERepeatingType.Grid) {
        const {gridParams: {x: xn, y: yn, bezierPoints, xOut, yOut}} = params;
        const {current: {width, height}} = pattern;

        const xd = width / xn;
        const yd = height / yn;

        x = x % xd;
        y = y % yd;

        const array = [];

        const curve = new Bezier(bezierPoints);

        for (let i = -xOut; i < xn + xOut; i++) {
            const tx = (x + xd * i) / width;
            const ai = curve.get(tx);


            for (let j = -yOut; j < yn + yOut; j++) {

                const ty = (y + yd * j) / height;
                const aj = curve.get(ty);

                array.push({
                    x: width * ai.x / 100,
                    y: height * aj.y / 100,
                    outer: i < 0 || i >= xn || j < 0 || j >= yn
                });
            }
        }

        return array;


    }

    return [{x, y}];
};
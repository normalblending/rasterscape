import {ERepeatingType, PatternState} from "../store/patterns/types";

export const getRepeatingCoords = (x, y, pattern: PatternState) => {
    if (!pattern.repeating) {
        return [{x, y}];
    }

    const {params} = pattern.repeating;

    if (params.type === ERepeatingType.Grid) {
        const {gridParams: {x: xn, y: yn}} = params;
        const {current: {width, height}} = pattern;

        const xd = width/xn;
        const yd = height/yn;

        x = x % xd;
        y = y % yd;

        const array = [];

        for (let i = -1; i < xn + 1; i++) {
            for (let j = -1; j < yn + 1; j++) {
                array.push({
                    x: x + xd * i,
                    y: y + yd * j,
                });
            }
        }

        return array;

    }

    return [{x, y}];
};
import {ERepeatingType, PatternState} from "../store/patterns/types";
import * as Bezier from "bezier-js";

export const getRepeatingCoords = (x, y, pattern: PatternState) => {
    if (!pattern.repeating) {
        return [{x, y}];
    }

    const {params} = pattern.repeating;

    if (params.type === ERepeatingType.Grid) {
        const {gridParams: {x: xn, y: yn, bezierPoints}} = params;
        const {current: {width, height}} = pattern;

        const xd = width / xn;
        const yd = height / yn;

        x = x % xd;
        y = y % yd;

        const array = [];

        const curve = new Bezier(bezierPoints);

        const from = curve.get(0);
        const to = curve.get(1);

        for (let i = 0; i < xn; i++) {
            const tx = (x + xd * i) / width;
            const ai = curve.get(tx);

            const tx2 = (x + xd * (i + 1)) / width;
            const ai2 = curve.get(tx2);

            console.log(curve.curvature(tx), i);

            for (let j = 0; j < yn; j++) {

                const ty = (y + yd * j) / height;
                const aj = curve.get(ty);

                const ty2 = (y + yd * (j + 1)) / height;
                const aj2 = curve.get(ty2);



                console.log(curve.curvature(ty), j);

                array.push({
                    x: width * ai.x / 100,
                    y: height * aj.y / 100,
                    scale: {
                        x: 1 - Math.abs((ai2.x - ai.x)/(to.x - from.x)),
                        y: 1 - Math.abs((aj2.y - aj.y)/(to.y - from.y)),
                    }
                });
            }
        }


        // const LUTx = curve.getLUT(xn + 1);
        // const LUTy = curve.getLUT(yn + 1);
        //
        // LUTx.forEach(pointX => LUTy.forEach(pointY => {
        //     array.push({
        //         x: width * pointX.x / 100,
        //         y: height * pointY.y / 100,
        //         scale: {
        //             x: 1,
        //             y: 1
        //         }
        //     });
        // }));


        console.log(array);

        return array;


    }

    return [{x, y}];
};
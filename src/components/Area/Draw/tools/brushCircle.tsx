import {drawMasked, drawWithRotation} from "../../../../utils/canvas/helpers/draw";
import {getRandomColor} from "../../../../utils/utils";
import {circle} from "../../../../utils/canvas/helpers/geometry";
import {Cursors} from "./cursors";
import {DrawToolProps} from "./types";
import {BrushParams} from "../../../../store/brush/types";
import {createCanvas, HelperCanvas} from "../../../../utils/canvas/helpers/base";
import {getRepeatingCoords} from "../../../../store/patterns/repeating/helpers";

export const brushCircle = function () {


    let helperCanvas1 = createCanvas(400, 400);
    let helperCanvas2 = createCanvas(400, 400);

    return (drawToolProps: DrawToolProps) => {
        const {
            targetPattern,
            toolParams,
            coordinates,
        } = drawToolProps;

        const pattern = targetPattern;
        const {size, opacity, compositeOperation} = toolParams as BrushParams;

        const circleBrush = (ev) => {
            const {ctx, e, rotation} = ev;

            if (!e) return;

            const angle = rotation ? rotation.angle : 0;

            const selectionMask = pattern.selection && pattern.selection.value.mask;


            coordinates.forEach(({x, y}) => {
                drawWithRotation(
                    -angle,
                    x, y,
                    ({context}) => {
                        context.fillStyle = getRandomColor();

                        circle(context, 0, 0, size / 2);
                    }
                )(helperCanvas1);
            });

            const resultCanvas: HelperCanvas = selectionMask
                ? drawMasked(
                    selectionMask,
                    ({context}) => {

                        context.drawImage(helperCanvas1.canvas, 0, 0);
                        helperCanvas1.clear();
                    }
                )(
                    helperCanvas2
                )
                : helperCanvas1;


            ctx.globalCompositeOperation = compositeOperation;
            ctx.globalAlpha = opacity;
            ctx.drawImage(resultCanvas.canvas, 0, 0);
            resultCanvas.clear();
        };
        return {
            draw: circleBrush,
            click: circleBrush,
            cursors: ({x, y}) => {
                return Cursors.circle(x, y, (toolParams as BrushParams).size)
            }
        }
    }
};
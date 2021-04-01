import {drawMasked, drawWithRotation} from "../../../../utils/canvas/helpers/draw";
import {getRandomColor} from "../../../../utils/utils";
import {Cursors} from "./cursors";
import {CanvasEvent} from "../../../_shared/Canvas";
import {DrawToolProps} from "./types";
import {createCanvas, HelperCanvas} from "../../../../utils/canvas/helpers/base";
import {BrushParams} from "../../../../store/brush/types";
import {getRepeatingCoords} from "../../../../store/patterns/repeating/helpers";

export const brushSquare = function () {

    let helperCanvas1 = createCanvas(400, 400);
    let helperCanvas2 = createCanvas(400, 400);

    return (drawToolProps: DrawToolProps) => {
        const {
            targetPattern,
            toolParams,
        } = drawToolProps;

        const pattern = targetPattern;
        const {size, opacity, compositeOperation} = toolParams as BrushParams;

        const squareBrush = (ev: CanvasEvent) => {
            const {ctx, e, canvas, rotation} = ev;

            if (!e) return;

            const angle = targetPattern.config.rotation && rotation?.rotateDrawAreaElement ? rotation.angle : 0;

            const selectionMask = pattern.selection && pattern.selection.value.mask;

            getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                drawWithRotation(
                    -angle,
                    x, y,
                    ({context}) => {
                        context.fillStyle = getRandomColor();
                        context.fillRect(-size / 2, -size / 2, size, size)
                    },
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
            draw: squareBrush,
            click: squareBrush,
            cursors: ({x, y, outer}) => {

                let width = Math.max((toolParams as BrushParams).size, 1);

                const rotation = (pattern.config.rotation && pattern.rotation.value.rotateDrawAreaElement) ? pattern.rotation.value : null;
                return Cursors.rect(x, y, width, width, {rotation});
            }
        }
    }
};
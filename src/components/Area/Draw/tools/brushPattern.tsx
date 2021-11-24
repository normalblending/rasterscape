import * as React from "react";

import {
    drawMasked,
    drawWithRotationAndOffset
} from "../../../../utils/canvas/helpers/draw";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {getRandomColor} from "../../../../utils/utils";
import {patternValues} from "../../../../store/patterns/values";
import {Cursors} from "./cursors";
import {createCanvas, HelperCanvas} from "../../../../utils/canvas/helpers/base";
import {DrawToolProps} from "./types";
import {BrushParams, BrushPatternParams} from "../../../../store/brush/types";

export const brushPattern = function () {

    let helperCanvas1 = createCanvas(400, 400);
    let helperCanvas2 = createCanvas(400, 400);

    return (drawToolProps: DrawToolProps) => {
        const {
            targetPattern,
            toolPattern,
            toolParams,
            coordinates,
        } = drawToolProps;

        const {size: patternSize, opacity, compositeOperation} = toolParams as BrushPatternParams;
        const brushPattern = toolPattern;
        const destinationPattern = targetPattern;

        if (destinationPattern.current.imageData.width !== helperCanvas1.canvas.width ||
            destinationPattern.current.imageData.height !== helperCanvas1.canvas.height) {
            helperCanvas1.canvas.width = destinationPattern.current.imageData.width;
            helperCanvas1.canvas.height = destinationPattern.current.imageData.height;
        }

        if (destinationPattern.current.imageData.width !== helperCanvas2.canvas.width ||
            destinationPattern.current.imageData.height !== helperCanvas2.canvas.height) {
            helperCanvas2.canvas.width = destinationPattern.current.imageData.width;
            helperCanvas2.canvas.height = destinationPattern.current.imageData.height;
        }

        const patternBrush = (ev) => {
            const {ctx, e, canvas} = ev;

            if (!e) return;


            ctx.fillStyle = getRandomColor();
            ctx.globalAlpha = opacity;
            ctx.globalCompositeOperation = compositeOperation;
            ctx.imageSmoothingEnabled = true;

            const brushRotation = brushPattern?.config?.rotation ? brushPattern?.rotation?.value : null;
            const destinationRotation = (
                destinationPattern?.config?.rotation &&
                destinationPattern?.rotation?.value?.rotateDrawAreaElement
            ) ? destinationPattern?.rotation?.value : null;

            const brushPatternImage = patternValues.values[brushPattern?.id]?.current;

            if (!brushPatternImage) return;

            const selectionMask = destinationPattern.selection && destinationPattern.selection.value.mask;

            // 1 patternSize - divide two
            const width = patternSize * brushPatternImage.width;
            const height = patternSize * brushPatternImage.height;

            coordinates.forEach(({x, y}) => {

                //
                const destAngle = destinationRotation ? destinationRotation.angle : 0;

                const brushAngle = brushRotation ? brushRotation.angle : 0;
                const brushCenter = brushRotation ? {
                    x: patternSize * brushRotation.offset.xc,
                    y: patternSize * brushRotation.offset.yc
                } : {x: 0, y: 0};
                const brushOffset = brushRotation ? {
                    x: patternSize * brushRotation.offset.xd,
                    y: patternSize * brushRotation.offset.yd
                } : {x: 0, y: 0};


                drawWithRotationAndOffset(
                    brushAngle,
                    destAngle,
                    brushCenter.x, -brushCenter.y,
                    brushOffset.x, -brushOffset.y,
                    x, y,
                    ({context, canvas}) => {
                        context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height);
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

            ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
            ctx.globalAlpha = 1;
        };
        return {
            draw: patternBrush,
            click: patternBrush,
            cursors: ({x, y, outer}) => {

                const brushPattern = toolPattern;
                const pattern = destinationPattern;
                const {size: patternSize} = toolParams as BrushPatternParams;

                const patternRotation = (
                    pattern?.config.rotation &&
                    pattern?.rotation?.value.rotateDrawAreaElement
                ) ? pattern?.rotation?.value : null;

                const brushRotation = brushPattern?.config.rotation ? brushPattern?.rotation?.value : null;
                const brushPatternImage = patternValues.values[brushPattern?.id]?.current;

                const width = patternSize * (brushPatternImage?.width);
                const height = patternSize * (brushPatternImage?.height);
                const xd = patternSize * (brushRotation?.offset?.xd || 0);
                const yd = patternSize * (brushRotation?.offset?.yd || 0);
                const xc = patternSize * (brushRotation?.offset?.xc || 0);
                const yc = patternSize * (brushRotation?.offset?.yc || 0);
                const patternAngle = patternRotation?.angle || 0;
                const brushAngle = brushRotation?.angle || 0;

                return (
                    <>
                        {Cursors.rect(x, y, width, height, {
                            transform: `
                            rotate(
                                ${-patternAngle} 
                                ${x} 
                                ${y}
                            )
                            translate(
                                ${xd}, 
                                ${-yd}
                            ) 
                            rotate(
                                ${brushAngle} 
                                ${x + xc} 
                                ${y - yc}
                            )
                        `
                        })}
                        {Cursors.cross(x, y, 20)}
                    </>
                );
            }
        }
    }
};
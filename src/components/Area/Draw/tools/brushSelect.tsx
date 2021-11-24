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
import {BrushParams, BrushSelectParams} from "../../../../store/brush/types";
import {coordHelper, coordHelper3, imageDebug} from "../../canvasPosition.servise";

export const brushSelect = function () {

    let helperCanvas1 = createCanvas(400, 400);
    let helperCanvas2 = createCanvas(400, 400);

    let offsetX = 0;
    let offsetY = 0;
    return (drawToolProps: DrawToolProps) => {
        const {
            targetPattern,
            // toolPattern,
            toolParams,
            coordinates,
        } = drawToolProps;

        const {size: patternSize, opacity, compositeOperation} = toolParams as BrushSelectParams;
        const brushPattern = targetPattern;
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


            ctx.globalAlpha = opacity;
            ctx.globalCompositeOperation = compositeOperation;
            ctx.imageSmoothingEnabled = true;

            const brushRotation = brushPattern?.config?.rotation ? brushPattern?.rotation?.value : null;
            const destinationRotation = (
                destinationPattern?.config?.rotation &&
                destinationPattern?.rotation?.value?.rotateDrawAreaElement
            ) ? destinationPattern?.rotation?.value : null;

            const brushPatternImage = patternValues.values[destinationPattern?.id]?.selected;

            // imageDebug.setImage(brushPatternImage);
            if (!brushPatternImage) return;

            // 1 patternSize - divide two
            const width = patternSize * brushPatternImage.width;
            const height = patternSize * brushPatternImage.height;


            offsetX = offsetX || (e.offsetX - destinationPattern.current.imageData.width / 2);
            offsetY = offsetY || (e.offsetY - destinationPattern.current.imageData.height / 2);

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
                    x - offsetX, y - offsetY,
                    ({context, canvas}) => {
                        context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height);
                    }
                )(helperCanvas1);


            });

            const resultCanvas: HelperCanvas = helperCanvas1;


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
            release: () => {
                offsetX = 0;
                offsetY = 0;
            },
            cursors: ({x, y, outer}) => {

                return (
                    <>
                        {Cursors.cross(x, y, 20)}
                    </>
                );
            }
        }
    }
};

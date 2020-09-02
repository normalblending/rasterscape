import * as React from "react";

import {getRepeatingCoords} from "../../../../utils/draw";
import {
    drawMaskedWithRotation, drawMaskedWithRotationAndOffset,
    drawWithRotation,
    drawWithRotationAndOffset
} from "../../../../utils/canvas/helpers/draw";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {getRandomColor} from "../../../../utils/utils";
import {patternValues} from "../../../../store/patterns/values";
import {CSSProperties} from "react";
import {Cursors} from "./cursors";
import {CanvasDrawProps} from "../index";

const cursorStyle: CSSProperties = {mixBlendMode: 'difference'};
export const brushPattern = function () {
    const patternBrush = (ev) => {
        const {ctx, e, canvas} = ev;

        if (!e) return;

        const {
            pattern: destinationPattern,
            brushPattern,

            brush,
        }: CanvasDrawProps = this.props;

        const {patternSize, opacity, compositeOperation} = brush.params;

        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
        ctx.imageSmoothingEnabled = true;

        const brushRotation = brushPattern.config.rotation ? brushPattern?.rotation?.value : null;
        const destinationRotation = destinationPattern.config.rotation ? destinationPattern?.rotation?.value : null;

        const brushPatternImage = patternValues.values[brushPattern?.id];

        if (brushPatternImage) {

            const dr = ({x, y}) => {

                // 1 patternSize - divide two
                const width = patternSize * brushPatternImage.width;
                const height = patternSize * brushPatternImage.height;


                //
                const destAngle = destinationRotation ? destinationRotation.angle : 0;

                const brushAngle = brushRotation ? brushRotation.angle : 0;
                const brushCenter = brushRotation ? {
                    x: brushRotation.offset.xc, y: brushRotation.offset.yc
                } : {x: 0, y: 0};
                const brushOffset = brushRotation ? {
                    x: brushRotation.offset.xd, y: brushRotation.offset.yd
                } : {x: 0, y: 0};


                const selectionMask = destinationPattern.selection && destinationPattern.selection.value.mask;

                if (selectionMask) {
                    const {canvas: image} = drawMaskedWithRotationAndOffset(
                        selectionMask,
                        brushAngle,
                        destAngle,
                        brushCenter.x, -brushCenter.y,
                        brushOffset.x, -brushOffset.y,
                        x, y,
                        ({context, canvas}) => {
                            context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height);
                        }
                    );

                    ctx.globalCompositeOperation = compositeOperation;
                    ctx.drawImage(image, 0, 0);
                } else {


                    drawWithRotationAndOffset(
                        brushAngle,
                        destAngle,
                        brushCenter.x, -brushCenter.y,
                        brushOffset.x, -brushOffset.y,
                        x, y,
                        ({context, canvas}) => {
                            context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height);
                        }
                    )({context: ctx, canvas})
                }

            };

            getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern).forEach(dr);
        }
        ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
        ctx.globalAlpha = 1;
    };
    return {
        draw: patternBrush,
        click: patternBrush,
        cursors: ({x, y, outer}) => {

            const {brushPattern, pattern}: CanvasDrawProps = this.props;
            const {patternSize} = this.props.brush.params;

            const patternRotation = pattern?.config.rotation ? pattern?.rotation?.value : null;

            const brushRotation = brushPattern?.config.rotation ? brushPattern?.rotation?.value : null;
            const brushPatternImage = patternValues.values[brushPattern?.id];

            const width = patternSize * (brushPatternImage?.width);
            const height = patternSize * (brushPatternImage?.height);

            return Cursors.rect(x, y, width, height, {
                transform: `
                    translate(
                        ${brushRotation?.offset?.xd || 0}, 
                        ${-brushRotation?.offset?.yd || 0}
                    ) rotate(
                        ${-(patternRotation?.angle || 0) + (brushRotation?.angle || 0)} 
                        ${x + (brushRotation?.offset?.xc || 0)} 
                        ${y - (brushRotation?.offset?.yc || 0)}
                    )
                `
            });
        }
    }
};
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

export const brushPattern = function () {
    const patternBrush = (ev) => {
        const {ctx, e, canvas} = ev;

        if (!e) return;

        const {
            pattern: destinationPattern,
            brushPattern,

            brush,
        } = this.props;

        const {patternSize, opacity, compositeOperation} = brush.params;

        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
        ctx.imageSmoothingEnabled = true;

        const brushRotation = brushPattern?.rotation?.value;
        const destinationRotation = destinationPattern?.rotation?.value;

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
                        brushCenter.x, - brushCenter.y,
                        brushOffset.x, - brushOffset.y,
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
                        brushCenter.x, - brushCenter.y,
                        brushOffset.x, - brushOffset.y,
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


            const {brushPattern, pattern} = this.props;
            const {patternSize} = this.props.brush.params;

            const patternRotation = pattern?.rotation?.value;

            const brushRotation = brushPattern?.rotation?.value;
            const brushPatternImage = patternValues.values[brushPattern?.id];

            const width = patternSize * (brushPatternImage?.width);
            const height = patternSize * (brushPatternImage?.height);

            const {rotation} = this.props;
            return x - width / 2 ? (
                <rect
                    transform={rotation && brushRotation
                        ? `translate(${brushRotation.offset.xd}, ${-brushRotation.offset.yd}) rotate(${-rotation.angle + brushRotation.angle} ${x + brushRotation.offset.xc} ${y - brushRotation.offset.yc})`
                        : ""}
                    x={x - width / 2}
                    y={y - height / 2}
                    width={width}
                    height={height}
                    stroke={"black"} fill="purple"
                    fillOpacity="0" strokeOpacity={outer ? "0.3" : "0.7"}/>
            ) : null;
        }
    }
};
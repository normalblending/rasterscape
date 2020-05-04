import * as React from "react";

import {getRepeatingCoords} from "../../../../utils/draw";
import {drawMaskedWithRotation, drawWithRotation} from "../../../../utils/canvas/helpers/draw";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {getRandomColor} from "../../../../utils/utils";

export const brushPattern = function () {
    const patternBrush = (ev) => {
        const {ctx, e, canvas} = ev;
        const {pattern: destinationPattern, brushPattern} = this.props;
        const {patternSize, opacity, compositeOperation} = this.props.brush.params;

        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
        ctx.imageSmoothingEnabled = true;

        const brushRotation = brushPattern && brushPattern.rotation && brushPattern.rotation.value;
        const destinationRotation = destinationPattern && destinationPattern.rotation && destinationPattern.rotation.value;

        const brushPatternImage = brushPattern && brushPattern.resultImage;

        if (brushPatternImage) {


            const dr = ({x, y}) => {

                const width = patternSize * brushPatternImage.width;
                const height = patternSize * brushPatternImage.height;


                const selectionMask = destinationPattern.selection && destinationPattern.selection.value.mask;

                if (selectionMask) {
                    const {canvas: image} = drawMaskedWithRotation(
                        selectionMask,
                        -destinationRotation.angle + brushRotation.angle,
                        x + brushRotation.offset.x, y + brushRotation.offset.y,
                        ({context}) => {
                            context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height)
                        }
                    );

                    ctx.globalCompositeOperation = compositeOperation;
                    ctx.drawImage(image, 0, 0);
                } else {
                    const destAngle = destinationRotation ? destinationRotation.angle : 0;
                    const brushAngle = brushRotation ? brushRotation.angle : 0;
                    const brushOffset = brushRotation ? {
                        x: brushRotation.offset.x, y: brushRotation.offset.y
                    } : {x: 0, y: 0};

                    drawWithRotation(-destAngle + brushAngle,
                        x + brushOffset.x, y + brushOffset.y,
                        ({context}) => {
                            context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height)
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


            const {brushPattern} = this.props;
            const {patternSize} = this.props.brush.params;


            const brushRotation = brushPattern && brushPattern.rotation && brushPattern.rotation.value;
            const brushPatternImage = brushPattern && brushPattern.resultImage;

            const width = patternSize * (brushPatternImage && brushPatternImage.width);
            const height = patternSize * (brushPatternImage && brushPatternImage.height);

            const {rotation} = this.props;
            return x - width / 2 ? (
                <rect
                    transform={rotation && brushRotation ? `rotate(${-rotation.angle + brushRotation.angle} ${x} ${y})` : ""}
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
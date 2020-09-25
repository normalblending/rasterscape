import * as React from "react";

import {getRepeatingCoords} from "../../../../../utils/draw";
import {
    drawMaskedWithRotation, drawMaskedWithRotationAndOffset,
    drawWithRotation,
    drawWithRotationAndOffset
} from "../../../../../utils/canvas/helpers/draw";
import {ECompositeOperation} from "../../../../../store/compositeOperations";
import {getRandomColor} from "../../../../../utils/utils";
import {patternValues} from "../../../../../store/patterns/values";
import {createCanvas} from "../../../../../utils/canvas/helpers/base";
import {Cursors} from "../cursors";

function angleBetween(point1, point2) {
    return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}
const canvasItemId = (i, j) => `${i}-${j}`;

export const linePattern = function () {
    let draw: boolean = false;
    let canvases = {};
    let prevPoints = {};

    const patternLine = (ev) => {
        const {ctx, e, canvas} = ev;

        if (!e) return;

        const {
            pattern: destinationPattern,
            linePattern,
            line,
        } = this.props;

        const {patternSize, opacity, compositeOperation} = line.params;

        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
        ctx.imageSmoothingEnabled = true;

        const brushRotation = linePattern?.rotation?.value;
        const destinationRotation = destinationPattern?.rotation?.value;

        const linePatternImage = patternValues.values[linePattern?.id];

        if (!linePatternImage) return

        if (!draw) {
            getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern).forEach(({x, y, id}) => {
                const index = id;
                canvases[index] = createCanvas(destinationPattern.current.imageData.width, destinationPattern.current.imageData.height).canvas;
                prevPoints[index] = {x, y};
            });
            draw = true;
        } else {
            if (patternSize < 0.01) return;

            getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern).forEach(({x, y, id}) => {
                const index = id;
                const prevPoint = prevPoints[index];
                prevPoints[index] = {x, y};

                // 1 patternSize - divide two
                const width = patternSize * linePatternImage.width;
                const height = patternSize * linePatternImage.height;


                //
                const destAngle = (destinationRotation ? destinationRotation.angle : 0)
                    + (angleBetween(prevPoint, {x, y}) / Math.PI * 180)

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
                            context.drawImage(linePatternImage, -width / 2, -height / 2, width, height);
                        },
                        canvases[index]
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
                            context.drawImage(linePatternImage, -width / 2, -height / 2, width, height);
                        },
                    )({context: ctx, canvas})
                }

            });
        }
        // getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern).forEach(dr);

        ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
        ctx.globalAlpha = 1;
    };
    return {
        draw: patternLine,
        // click: patternLine,
        release: e => {
            draw = false;
            canvases = [];
            // e.ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
            // e.ctx.globalAlpha = 1;
            // e.ctx.closePath();
            // coordHelper2.writeln('release');
        },
        cursors: ({x, y, outer}) => {


            const {linePattern, pattern} = this.props;
            const {patternSize} = this.props.line.params;

            const patternRotation = pattern?.rotation?.value;

            const lineRotation = linePattern?.rotation?.value;
            const linePatternImage = patternValues.values[linePattern?.id];

            const width = patternSize * (linePatternImage?.width);
            const height = patternSize * (linePatternImage?.height);

            const {rotation} = this.props;
            return x - width / 2 ? (
                <>
                    {Cursors.cross(x, y, 10, rotation)}
                <rect
                    transform={lineRotation
                        ? `translate(${lineRotation.offset.xd}, ${-lineRotation.offset.yd}) rotate(${-(rotation?.angle || 0) + lineRotation.angle} ${x + lineRotation.offset.xc} ${y - lineRotation.offset.yc})`
                        : ""}
                    x={x - width / 2}
                    y={y - height / 2}
                    width={width}
                    height={height}
                    stroke={"black"} fill="purple"
                    fillOpacity="0" strokeOpacity={outer ? "0.3" : "0.7"}/>
                </>
            ) : null;
        }
    }
};
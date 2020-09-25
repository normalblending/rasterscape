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
import {createCanvas} from "../../../../utils/canvas/helpers/base";
import {CSSProperties} from "react";
import {Cursors} from "./cursors";
import {CanvasDrawProps} from "../index";
import {EToolType} from "../../../../store/tool/types";

function distanceBetween(point1, point2) {
    if (!point1 || !point2) return 0;

    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function angleBetween(point1, point2) {
    if (!point1 || !point2) return 0;

    return Math.atan2(point2?.x - point1?.x, point2?.y - point1?.y);
}

const cursorStyle: CSSProperties = {mixBlendMode: 'difference'};

const canvasItemId = (i, j) => `${i}-${j}`;

export const lineTrailingPattern = function () {
    let draw: boolean = false;
    let canvases = {};
    let prevPoints = {};
    let prevAngle = null;

    const patternLine = (ev) => {
        const {ctx, e, canvas} = ev;

        if (!e) return;

        const {
            pattern: destinationPattern,
            linePattern,
            line,
        }: CanvasDrawProps = this.props;

        const {patternSize, opacity, compositeOperation, patternDirection} = line.params;

        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
        ctx.imageSmoothingEnabled = true;

        const brushRotation = linePattern?.config?.rotation ? linePattern?.rotation?.value : null;
        const destinationRotation = destinationPattern?.config?.rotation ? destinationPattern?.rotation?.value : null;

        const linePatternImage = patternValues.values[linePattern?.id];

        if (!linePatternImage) return

        if (!draw) {
            getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern, false, EToolType.Line).forEach(({x, y, id}) => {
                const index = id;
                canvases[index] = createCanvas(destinationPattern.current.imageData.width, destinationPattern.current.imageData.height).canvas;
                prevPoints[index] = {x, y};
            });
            draw = true;
        } else {
            if (patternSize < 0.01) return;

            const repeatingCoords = getRepeatingCoords(e.offsetX, e.offsetY, destinationPattern, false, EToolType.Line);

            Object.keys(prevPoints)
                .filter(pointId => repeatingCoords.findIndex(({id}) => pointId === id) === -1)
                .forEach(pointId => {
                    prevPoints[pointId] = null
                });

            repeatingCoords.forEach(({x, y, id}) => {
                const index = id;

                const prevPoint = prevPoints[index];
                prevPoints[index] = {x, y};

                if (!prevPoint) return;


                // 1 patternSize - divide two
                const width = patternSize * linePatternImage.width;
                const height = patternSize * linePatternImage.height;


                //
                const destAngle = (destinationRotation?.angle || 0)
                    + (patternDirection ? (angleBetween(prevPoint, {x, y}) / Math.PI * 180) : 0)

                const brushAngle = brushRotation?.angle || 0;
                const brushCenter = brushRotation ? {
                    x: patternSize * brushRotation.offset.xc,
                    y: patternSize * brushRotation.offset.yc
                } : {x: 0, y: 0};
                const brushOffset = brushRotation ? {
                    x: patternSize * brushRotation.offset.xd,
                    y: patternSize * brushRotation.offset.yd
                } : {x: 0, y: 0};


                const selectionMask = destinationPattern.selection && destinationPattern.selection.value.mask;

                var cp = {x, y};
                var pp = prevPoint;

                var dist = distanceBetween(pp, cp);
                var angle = angleBetween(pp, cp);//dist > 1000 ? angleBetween(pp, cp) : (prevAngle | angleBetween(pp, cp));

                // prevAngle = angle;


                for (let i = 0; i < dist || i === 0; i += 5) {
                    x = pp.x + (Math.sin(angle) * i);
                    y = pp.y + (Math.cos(angle) * i);

                    if (selectionMask) {

                        // var cp = {x: 0, y: 0};
                        // var pp = {x: x - prevPoint.x, y: y - prevPoint.y};

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


            const {linePattern, pattern}: CanvasDrawProps = this.props;
            const {patternSize} = this.props.line.params;

            const patternRotation = pattern?.config?.rotation ? pattern?.rotation?.value : null;

            const lineRotation = linePattern?.config?.rotation ? linePattern?.rotation?.value : null;
            const linePatternImage = patternValues.values[linePattern?.id];

            const width = patternSize * (linePatternImage?.width);
            const height = patternSize * (linePatternImage?.height);
            const xd = patternSize * (lineRotation?.offset?.xd || 0);
            const yd = patternSize * (lineRotation?.offset?.yd || 0);
            const xc = patternSize * (lineRotation?.offset?.xc || 0);
            const yc = patternSize * (lineRotation?.offset?.yc || 0);
            const patternAngle = patternRotation?.angle || 0;
            const lineAngle = lineRotation?.angle || 0;

            return (
                <>
                    {Cursors.cross(x, y, 10, patternRotation)}
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
                                ${lineAngle} 
                                ${x + xc} 
                                ${y - yc}
                            )
                        `
                    })}
                </>
            );
        }
    }
};
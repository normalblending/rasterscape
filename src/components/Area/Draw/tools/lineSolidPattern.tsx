import * as React from "react";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {createCanvas} from "../../../../utils/canvas/helpers/base";
import {drawMasked} from "../../../../utils/canvas/helpers/draw";
import {getRepeatingCoords} from "../../../../utils/draw";
import {patternValues} from "../../../../store/patterns/values";
import {CSSProperties} from "react";
import {Cursors} from "./cursors";
import {PatternState} from "../../../../store/patterns/pattern/types";
import {CanvasDrawProps} from "../index";
import {EToolType} from "../../../../store/tool/types";

const getPatternStrokeStyle = (ctx, x, y, patternSize, linePattern: PatternState, linePatternImage, patternMouseCentered: boolean) => {
    const patternStrokeStyle = ctx.createPattern(linePatternImage, "repeat");
    const matrix = new DOMMatrix();

    const rotation = linePattern.config.rotation ? linePattern.rotation : null;

    patternStrokeStyle.setTransform(
        matrix
            .translateSelf(
                patternMouseCentered ? (x - linePattern.current.imageData.width / 2) : 0,
                patternMouseCentered ? (y - linePattern.current.imageData.height / 2) : 0,
            )
            .translateSelf(
                rotation?.value?.offset?.xd || 0,
                -rotation?.value?.offset?.yd || 0,
            )
            .translateSelf(
                linePattern.current.imageData.width / 2 + (rotation?.value?.offset?.xc || 0),
                linePattern.current.imageData.height / 2 - (rotation?.value?.offset?.yc || 0),
            )
            .rotateSelf(rotation?.value?.angle || 0)
            .scaleSelf(patternSize)
            .translateSelf(
                -linePattern.current.imageData.width / 2 - (rotation?.value?.offset?.xc || 0),
                -linePattern.current.imageData.height / 2 + (rotation?.value?.offset?.yc || 0),
            )
    );
    return patternStrokeStyle;
};

export const lineSolidPattern = function () {
    let draw: boolean = false;
    let canvases = {};
    let patternStrokeStyle = null;
    return {
        draw: (ev) => {
            const {ctx, e} = ev;
            const {pattern, linePattern} = this.props;
            const {size, patternSize, opacity, compositeOperation, cap, join, patternMouseCentered} = this.props.line.params;

            const {width, height} = pattern.current.imageData;

            if (!e) return;

            const linePatternImage = patternValues.values[linePattern?.id];

            if (!linePatternImage || !linePattern) return;


            const selectionMask = pattern.selection && pattern.selection.value.mask;
            if (selectionMask) {
                if (!draw) {
                    getRepeatingCoords(e.offsetX, e.offsetY, pattern, false, EToolType.Line).forEach(({x, y, id: index}) => {
                        canvases[index] = createCanvas(selectionMask.width, selectionMask.height).canvas;

                        drawMasked(
                            selectionMask,
                            ({context, canvas}) => {

                                context.lineJoin = join;
                                context.lineCap = cap;

                                context.beginPath();
                                context.moveTo(x, y);
                            },
                            canvases[index]
                        );

                    });

                    draw = true;

                } else {
                    getRepeatingCoords(e.offsetX, e.offsetY, pattern, false, EToolType.Line).forEach(({x, y, id: index}) => {

                        canvases[index].getContext('2d').clearRect(0, 0, width, height);

                        const {canvas: image} = drawMasked(
                            selectionMask,
                            ({context, canvas}) => {
                                context.lineWidth = size;
                                context.strokeStyle = getPatternStrokeStyle(ctx, x, y, patternSize, linePattern, linePatternImage, patternMouseCentered);

                                context.lineTo(x, y);
                                context.stroke();
                            },
                            canvases[index]
                        )

                        ctx.globalCompositeOperation = compositeOperation;
                        ctx.globalAlpha = opacity;
                        // document.getElementById('v1').innerHTML = '';
                        // document.getElementById('v1').appendChild(image);
                        ctx.drawImage(image, 0, 0);
                    });
                }
            } else {
                if (!draw) {
                    getRepeatingCoords(e.offsetX, e.offsetY, pattern, false, EToolType.Line).forEach(({x, y, id: index}) => {
                        canvases[index] = createCanvas(width, height).canvas;

                        const context = canvases[index]?.getContext('2d');

                        if (!context) return;

                        context.lineWidth = size;

                        context.lineJoin = join;
                        context.lineCap = cap;
                        context.globalAlpha = opacity;

                        context.beginPath();
                        context.moveTo(x, y);
                    });
                    draw = true;

                } else {
                    getRepeatingCoords(e.offsetX, e.offsetY, pattern, false, EToolType.Line).forEach(({x, y, id: index}) => {

                        const context = canvases[index]?.getContext('2d');

                        if (!context) return;

                        context.clearRect(0, 0, width, height);

                        context.lineWidth = size;
                        // if (random === ELineRandomType.OnFrame) {
                        //     context.strokeStyle = getRandomColor();
                        // }

                        context.strokeStyle = getPatternStrokeStyle(ctx, x, y, patternSize, linePattern, linePatternImage, patternMouseCentered);

                        context.lineTo(x, y);
                        context.stroke();

                        const image = canvases[index];

                        ctx.globalCompositeOperation = compositeOperation;
                        ctx.globalAlpha = opacity;
                        ctx.drawImage(image, 0, 0);
                    });
                }
            }
        },
        release: e => {
            draw = false;
            canvases = [];
            patternStrokeStyle = null;
            e.ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
            e.ctx.globalAlpha = 1;
            // e.ctx.closePath();
            // coordHelper2.writeln('release');
        },
        cursors: ({x, y, outer}) => {


            let size = Math.max(this.props.line.params.size, 10);

            const {pattern}: CanvasDrawProps = this.props;
            const rotation = pattern.config.rotation ? pattern.rotation?.value : null;

            return Cursors.cross(x, y, size, rotation);
        }
    }
};
/*
const matrixV1 = matrix
    .translateSelf(
        linePattern.rotation?.value?.offset?.xd || 0,
        -linePattern.rotation?.value?.offset?.yd || 0,
    )
    .translateSelf(
        linePattern.current.imageData.width/ 2 + (linePattern.rotation?.value?.offset?.xc || 0),
        linePattern.current.imageData.height/2 - (linePattern.rotation?.value?.offset?.yc || 0),
    )
    .rotateSelf(linePattern.rotation?.value?.angle || 0)
    .translateSelf(
        -linePattern.current.imageData.width/ 2 -(linePattern.rotation?.value?.offset?.xc || 0),
        -linePattern.current.imageData.height/2 + (linePattern.rotation?.value?.offset?.yc || 0),
    )
    .scale(patternSize)


 */
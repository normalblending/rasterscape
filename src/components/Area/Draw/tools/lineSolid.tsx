import * as React from "react";
import {CSSProperties} from "react";
import {getRandomColor} from "../../../../utils/utils";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {ELineRandomType} from "../../../../store/line/types";
import {createCanvas} from "../../../../utils/canvas/helpers/base";
import {drawMasked} from "../../../../utils/canvas/helpers/draw";
import {getRepeatingCoords} from "../../../../utils/draw";
import {coordHelper4} from "../../canvasPosition.servise";
import {Cursors} from "./cursors";
import {EToolType} from "../../../../store/tool/types";

const cursorStyle: CSSProperties = {mixBlendMode: 'difference'};

export const lineSolid = function () {
    let draw: boolean = false;
    let canvases = {};
    let prevPoints = {};

    return {
        draw: (ev) => {
            const {ctx, e} = ev;
            const {pattern} = this.props;
            const {size, opacity, compositeOperation, cap, join, random} = this.props.line.params;

            const {width, height} = pattern.current.imageData;

            if (!e) return;


            const selectionMask = pattern.selection && pattern.selection.value.mask;
            if (selectionMask) {
                if (!draw) {
                    getRepeatingCoords(e.offsetX, e.offsetY, pattern, false, EToolType.Line).forEach(({x, y, id: index}) => {
                        canvases[index] = createCanvas(selectionMask.width, selectionMask.height).canvas;
                        prevPoints[index] = {x, y};

                        drawMasked(
                            selectionMask,
                            ({context, canvas}) => {
                                context.strokeStyle = getRandomColor();
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
                    getRepeatingCoords(e.offsetX, e.offsetY, pattern, false, EToolType.Line).forEach(({x, y, id: index} ) => {

                        canvases[index].getContext('2d').clearRect(0,0, width, height);

                        const {canvas: image} = drawMasked(
                            selectionMask,
                            ({context, canvas}) => {
                                // context.clearRect(0,0, width, height);
                                context.lineWidth = size;

                                if (random === ELineRandomType.OnFrame) {
                                    context.strokeStyle = getRandomColor();

                                }
                                context.lineTo(x, y);
                                context.stroke();
                            },
                            canvases[index]
                        )

                        ctx.globalCompositeOperation = compositeOperation;
                        ctx.globalAlpha = opacity;
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

                        context.strokeStyle = getRandomColor();

                        context.beginPath();
                        context.moveTo(x, y);
                    });
                    draw = true;

                } else {

                    getRepeatingCoords(e.offsetX, e.offsetY, pattern, false, EToolType.Line).forEach(({x, y, id: index}) => {

                        const context = canvases[index]?.getContext('2d');

                        if (!context) return;

                        context.clearRect(0,0, width, height);

                        context.lineWidth = size;
                        if (random === ELineRandomType.OnFrame) {
                            context.strokeStyle = getRandomColor();
                        }
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
            e.ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
            e.ctx.globalAlpha = 1;
            // e.ctx.closePath();
            // coordHelper2.writeln('release');
        },
        cursors: ({x, y, outer}, index) => {

            let size = Math.max(this.props.line.params.size, 10);

            const {rotation} = this.props;
            return Cursors.cross(x, y, size, rotation, index);
        }
    }
};
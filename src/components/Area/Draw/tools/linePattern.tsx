import * as React from "react";
import {getRandomColor} from "../../../../utils/utils";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {ELineRandomType} from "../../../../store/line/types";
import {imageDataToCanvas} from "../../../../utils/canvas/helpers/imageData";

function getPattern(imageData: ImageData, ctx) {
    const patternCanvas = imageDataToCanvas(imageData);

    return ctx.createPattern(patternCanvas, 'repeat');
}

export const linePattern = function () {
    let draw: boolean = false;
    let contextPattern = null;
    return {
        draw: (ev) => {
            const {ctx, e} = ev;
            const {size, opacity, compositeOperation, cap, join, random} = this.props.line.params;

            if (!this.props.linePattern?.current?.imageData) return;

            if (!draw) {
                const {linePattern} = this.props;
                ctx.strokeStyle = Math.random() > .5
                    ? getPattern(linePattern.current.imageData, ctx)
                    : getRandomColor();

                ctx.globalCompositeOperation = compositeOperation;
                ctx.globalAlpha = opacity;
                ctx.lineWidth = size;

                ctx.lineJoin = join;
                ctx.lineCap = cap;
                ctx.beginPath();
                ctx.moveTo(e.offsetX, e.offsetY);
                // coordHelper2.writeln('down');
                draw = true;
            } else {
                if (random === ELineRandomType.OnFrame) {
                    const {linePattern} = this.props;
                    ctx.strokeStyle = Math.random() > .5
                        ? getPattern(linePattern.current.imageData, ctx)
                        : getRandomColor();
                }

                ctx.lineWidth = size;
                ctx.globalAlpha = opacity;
                ctx.lineTo(e.offsetX, e.offsetY);
                // ctx.strokeStyle = getRandomColor();
                ctx.stroke();
                // coordHelper2.writeln('draw');
            }


        },
        release: e => {
            draw = false;
            e.ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
            e.ctx.globalAlpha = 1;
            // e.ctx.closePath();
            // coordHelper2.writeln('release');
        }
    }
};
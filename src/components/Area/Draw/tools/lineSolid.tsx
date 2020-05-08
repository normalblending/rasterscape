import * as React from "react";
import {getRandomColor} from "../../../../utils/utils";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {ELineRandomType} from "../../../../store/line/types";

export const lineSolid = function () {
    let draw: boolean = false;
    return {
        draw: (ev) => {
            const {ctx, e} = ev;
            const {size, opacity, compositeOperation, cap, join, random} = this.props.line.params;

            if (!draw) {
                ctx.globalCompositeOperation = compositeOperation;
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = getRandomColor();
                ctx.lineWidth = size;

                ctx.lineJoin = join;
                ctx.lineCap = cap;
                ctx.beginPath();
                ctx.moveTo(e.offsetX, e.offsetY);
                // coordHelper2.writeln('down');
                draw = true;
            } else {
                if (random === ELineRandomType.OnFrame) {
                    ctx.strokeStyle = getRandomColor();
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
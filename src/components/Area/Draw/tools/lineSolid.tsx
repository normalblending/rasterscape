import * as React from "react";
import {getRandomColor} from "../../../../utils/utils";
import {coordHelper2} from "../../canvasPosition.servise";
import {ELineCompositeOperation} from "../../../../store/line/types";

export const lineSolid = function () {
    let draw: boolean = false;
    return {
        draw: (ev) => {
            const {ctx, e} = ev;
            const {size, opacity, compositeOperation} = this.props.line.params;

            if (!draw) {
                ctx.globalCompositeOperation = compositeOperation;
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = getRandomColor();
                ctx.lineWidth = size;

                ctx.lineJoin = ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(e.offsetX, e.offsetY);
                coordHelper2.writeln('down');
                draw = true;
            } else {
                ctx.lineWidth = size;
                ctx.globalAlpha = opacity;
                ctx.lineTo(e.offsetX, e.offsetY);
                // ctx.strokeStyle = getRandomColor();
                ctx.stroke();
                coordHelper2.writeln('draw');
            }


        },
        release: e => {
            draw = false;
            e.ctx.globalCompositeOperation = ELineCompositeOperation.SourceOver;
            e.ctx.globalAlpha = 1;
            // e.ctx.closePath();
            coordHelper2.writeln('release');
        }
    }
};
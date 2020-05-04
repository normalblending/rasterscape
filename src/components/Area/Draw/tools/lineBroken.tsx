import * as React from "react";
import {getRandomColor} from "../../../../utils/utils";
import {ELineCompositeOperation} from "../../../../store/line/types";

export const lineBroken = function () {
    return {
        click: (ev) => {
            const {ctx, e} = ev;
            const {size, opacity, compositeOperation} = this.props.line.params;


            ctx.beginPath();
            ctx.globalCompositeOperation = compositeOperation;
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = getRandomColor();//"green";
            ctx.lineWidth = size;

            // ctx.moveTo(e.offsetX, e.offsetY);

        },
        draw: (ev) => {
            const {ctx, e, pre} = ev;
            const {size, opacity} = this.props.line.params;

            if (!pre) return;
            ctx.lineWidth = size;
            ctx.globalAlpha = opacity;

            console.log(pre === e, ev);
            ctx.moveTo(pre.offsetX, pre.offsetY);

            ctx.lineTo(e.offsetX, e.offsetY);

            ctx.stroke();
        },
        release: e => {

            e.ctx.globalCompositeOperation = ELineCompositeOperation.SourceOver;
            e.ctx.globalAlpha = 1;
            e.ctx.closePath();
        }
    }
};
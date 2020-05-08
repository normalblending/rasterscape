import * as React from "react";
import {getRandomColor} from "../../../../utils/utils";
import {ECompositeOperation} from "../../../../store/compositeOperations";

export const lineBrokenTransparent = function () {
    return {
        click: (ev) => {
            const {ctx, e} = ev;
            const {size, opacity, compositeOperation} = this.props.line.params;

            ctx.globalCompositeOperation = compositeOperation;

            ctx.globalAlpha = opacity;
            ctx.strokeStyle = getRandomColor();//"green";
            ctx.lineWidth = size;

            // ctx.moveTo(e.offsetX, e.offsetY);

        },
        draw: (ev) => {
            const {ctx, e, pre} = ev;
            const {size, opacity} = this.props.line.params;

            ctx.lineWidth = size;
            ctx.globalAlpha = opacity;
            if (!pre) return;//"green";

            ctx.beginPath();
            ctx.moveTo(pre.offsetX, pre.offsetY);

            ctx.lineTo(e.offsetX, e.offsetY);

            ctx.stroke();
            ctx.closePath();
        },
        release: e => {

            e.ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
            e.ctx.globalAlpha = 1;
        }
    }
};
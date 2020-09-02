import * as React from "react";
import {getRandomColor} from "../../../../../utils/utils";
import {ECompositeOperation} from "../../../../../store/compositeOperations";
import {ELineRandomType} from "../../../../../store/line/types";

export const lineBrokenTransparent = function () {

    let draw: boolean = false;
    return {
        draw: (ev) => {
            const {ctx, e, pre} = ev;
            const {size, opacity, compositeOperation, cap, join, random} = this.props.line.params;

            if (!e) return;

            if (!draw) {
                ctx.globalCompositeOperation = compositeOperation;
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = getRandomColor();
                ctx.lineWidth = size;

                ctx.lineJoin = join;
                ctx.lineCap = cap;
                // ctx.beginPath();
                // ctx.moveTo(e.offsetX, e.offsetY);
                // coordHelper2.writeln('down');
                draw = true;
            } else if (pre) {
                if (random === ELineRandomType.OnFrame) {
                    ctx.strokeStyle = getRandomColor();
                }

                ctx.lineWidth = size;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.moveTo(pre.offsetX, pre.offsetY);
                ctx.lineTo(e.offsetX, e.offsetY);
                // ctx.strokeStyle = getRandomColor();
                ctx.stroke();
                ctx.closePath();
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
    /*
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
    }*/
};
import * as React from "react";

import {getRepeatingCoords} from "../../../../utils/draw";
import {drawMaskedWithRotation, drawWithRotation} from "../../../../utils/canvas/helpers/draw";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {getRandomColor} from "../../../../utils/utils";
import {CSSProperties} from "react";
import {Cursors} from "./cursors";

const cursorStyle: CSSProperties = {mixBlendMode: 'difference'};
export const brushSquare = function () {
    const squareBrush = (ev) => {
        const {ctx, e, canvas, rotation} = ev;

        if (!e) return;

        const {pattern} = this.props;
        const {size, opacity, compositeOperation} = this.props.brush.params;

        ctx.fillStyle = getRandomColor();
        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = compositeOperation;
        const angle = rotation ? rotation.angle : 0;

        const selectionMask = pattern.selection && pattern.selection.value.mask;
        if (selectionMask) {

            getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {

                const {canvas: image} = drawMaskedWithRotation(
                    selectionMask,
                    -angle,
                    x, y,
                    ({context}) => {

                        context.fillStyle = ctx.fillStyle;
                        context.fillRect(-size / 2, -size / 2, size, size)
                    }
                );

                ctx.globalCompositeOperation = compositeOperation;
                ctx.drawImage(image, 0, 0);
            });


        } else {
            getRepeatingCoords(e.offsetX, e.offsetY, pattern).forEach(({x, y}) => {
                drawWithRotation(
                    -angle,
                    x, y,
                    ({context}) => {
                        context.fillRect(-size / 2, -size / 2, size, size)
                    },
                )({context: ctx, canvas});
            });
        }


        ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
        ctx.globalAlpha = 1;
    };
    return {
        draw: squareBrush,
        click: squareBrush,
        cursors: ({x, y, outer}) => {

            let width = Math.max(this.props.brush.params.size, 1);

            const {rotation} = this.props;
            return Cursors.rect(x, y, width, width, {rotation});
        }
    }
};
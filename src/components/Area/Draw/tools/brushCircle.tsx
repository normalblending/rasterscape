import * as React from "react";

import {getRepeatingCoords} from "../../../../utils/draw";
import {drawMaskedWithRotation, drawWithRotation} from "../../../../utils/canvas/helpers/draw";
import {ECompositeOperation} from "../../../../store/compositeOperations";
import {getRandomColor} from "../../../../utils/utils";
import {circle} from "../../../../utils/canvas/helpers/geometry";

export const brushCircle = function () {
    const circleBrush = (ev) => {
        const {ctx, e, canvas, rotation} = ev;
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
                        circle(context, 0, 0, size / 2);
                    },
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
                        circle(context, 0, 0, size / 2);
                    }
                )({context: ctx, canvas});
            });
        }

        ctx.globalCompositeOperation = ECompositeOperation.SourceOver;
        ctx.globalAlpha = 1;
    };
    return {
        draw: circleBrush,
        click: circleBrush,
        cursors: ({x, y, outer}) => {

            return (
                <circle
                    cx={x}
                    cy={y}
                    r={this.props.brush.params.size / 2}
                    stroke={"black"} fill="purple"
                    fillOpacity="0" strokeOpacity={outer ? "0.3" : "0.7"}/>
            )
        }
    }
};
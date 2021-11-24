import {getRandomColor} from "../../../../utils/utils";
import {ELineRandomType, LineParams} from "../../../../store/line/types";
import {createCanvas, HelperCanvas} from "../../../../utils/canvas/helpers/base";
import {drawMasked} from "../../../../utils/canvas/helpers/draw";
import {Cursors} from "./cursors";
import {EToolType} from "../../../../store/tool/types";
import {CanvasEvent} from "../../../_shared/Canvas";
import {DrawToolProps} from "./types";
import {getRepeatingCoords} from "../../../../store/patterns/repeating/helpers";
import {coordHelper4} from "../../canvasPosition.servise";

export const lineSolid = () => {

    let draw: boolean = false;
    let canvases: Record<string, HelperCanvas> = {};
    let prevPoints: Record<string, {x: number, y: number}> = {};

    let helperCanvas1 = createCanvas(400, 400);
    let helperCanvas2 = createCanvas(400, 400);

    return (drawToolProps: DrawToolProps) => {
        const {
            targetPattern,
            toolParams,
            coordinates,
        } = drawToolProps;

        const {size, opacity, compositeOperation, cap, join, random} = toolParams as LineParams;
        const pattern = targetPattern;

        if (!pattern) return;

        const {width, height} = pattern.current.imageData;

        return {
            draw: (ev: CanvasEvent) => {
                const {ctx, e} = ev;

                if (!e) return;

                const newPrevPoints = {};

                const selectionMask = pattern.selection && pattern.selection.value.mask;

                if (!draw) {

                    draw = true;

                    if (helperCanvas1.canvas.height !== height || helperCanvas1.canvas.width !== width
                        || helperCanvas2.canvas.height !== height || helperCanvas2.canvas.width !== width) {

                        helperCanvas1.canvas.height = height;
                        helperCanvas1.canvas.width = width;

                        helperCanvas2.canvas.height = height;
                        helperCanvas2.canvas.width = width;
                    }

                    coordinates
                        .forEach(({x, y, id: index}) => {
                            canvases[index] = createCanvas(width, height);
                            newPrevPoints[index] = {x, y};

                            const context = canvases[index].context;

                            if (!context) return;

                            context.strokeStyle = getRandomColor();

                            context.beginPath();
                            context.moveTo(x, y);

                        });
                } else {

                    coordinates
                        .forEach(({x, y, id: index}) => {

                            if (!canvases[index]) {
                                canvases[index] = createCanvas(width, height);
                                canvases[index].context.strokeStyle = getRandomColor();
                            }

                            const context = canvases[index].context;
                            canvases[index].clear();

                            newPrevPoints[index] = {x, y};

                            context.lineWidth = size;
                            context.lineJoin = join;
                            context.lineCap = cap;
                            context.globalAlpha = size ? opacity : 0; // нулеввой размер почему то не устанавливается

                            if (random === ELineRandomType.OnFrame) {
                                context.strokeStyle = getRandomColor();
                            }


                            if (prevPoints[index]) {
                                // if (Math.abs(prevPoints[index].x - x) > 20
                                // || Math.abs(prevPoints[index].y - y) > 20) {
                                //
                                //     context.moveTo(x, y);
                                // } else {
                                //     context.lineTo(x, y);
                                // }
                                context.lineTo(x, y);
                            } else {
                                // context.closePath();
                                context.moveTo(x, y);
                            }

                            context.stroke();

                            helperCanvas1.context.drawImage(canvases[index].canvas, 0, 0);

                        });

                    const resultCanvas: HelperCanvas = selectionMask
                        ? drawMasked(
                            selectionMask,
                            ({context}) => {

                                context.drawImage(helperCanvas1.canvas, 0, 0);
                                helperCanvas1.clear();
                            }
                        )(helperCanvas2)
                        : helperCanvas1;

                    ctx.globalCompositeOperation = compositeOperation;
                    ctx.globalAlpha = opacity;
                    ctx.drawImage(resultCanvas.canvas, 0, 0);
                    resultCanvas.clear();

                }
                prevPoints = newPrevPoints;
            },
            release: () => {
                draw = false;
                canvases = {};
            },
            cursors: ({x, y, outer}, index) => {

                const size = Math.max((toolParams as LineParams).size, 10);

                const rotation = (pattern.config.rotation && pattern.rotation.value.rotateDrawAreaElement) ? pattern.rotation.value : null;

                return Cursors.cross(x, y, size, rotation, index);
            }
        }
    }
};

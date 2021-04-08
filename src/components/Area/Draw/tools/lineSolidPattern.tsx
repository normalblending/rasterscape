import {ECompositeOperation} from "../../../../store/compositeOperations";
import {createCanvas, HelperCanvas} from "../../../../utils/canvas/helpers/base";
import {drawMasked} from "../../../../utils/canvas/helpers/draw";
import {patternValues} from "../../../../store/patterns/values";
import {Cursors} from "./cursors";
import {PatternState} from "../../../../store/patterns/pattern/types";
import {EToolType} from "../../../../store/tool/types";
import {DrawToolProps} from "./types";
import {LineParams} from "../../../../store/line/types";
import {getRepeatingCoords} from "../../../../store/patterns/repeating/helpers";

const getPatternStrokeStyle = (ctx, x, y, patternSize, linePattern: PatternState, linePatternImage, patternMouseCentered: boolean) => {
    const patternStrokeStyle = ctx.createPattern(linePatternImage, "repeat");
    const matrix = new DOMMatrix();

    const rotation = linePattern.config.rotation ? linePattern.rotation : null;

    patternStrokeStyle.setTransform(
        matrix
            .translateSelf(
                patternMouseCentered ? (x - linePattern.current.imageData.width / 2) : 0,
                patternMouseCentered ? (y - linePattern.current.imageData.height / 2) : 0,
            )
            .translateSelf(
                rotation?.value?.offset?.xd || 0,
                -rotation?.value?.offset?.yd || 0,
            )
            .translateSelf(
                linePattern.current.imageData.width / 2 + (rotation?.value?.offset?.xc || 0),
                linePattern.current.imageData.height / 2 - (rotation?.value?.offset?.yc || 0),
            )
            .rotateSelf(rotation?.value?.angle || 0)
            .scaleSelf(patternSize)
            .translateSelf(
                -linePattern.current.imageData.width / 2 - (rotation?.value?.offset?.xc || 0),
                -linePattern.current.imageData.height / 2 + (rotation?.value?.offset?.yc || 0),
            )
    );
    return patternStrokeStyle;
};

export const lineSolidPattern = function () {
    let draw: boolean = false;
    let canvases: Record<string, HelperCanvas> = {};
    let prevPoints = {};

    let helperCanvas1 = createCanvas(400, 400);
    let helperCanvas2 = createCanvas(400, 400);

    return (drawToolProps: DrawToolProps) => {
        const {
            targetPattern,
            toolPattern,
            toolParams,
            coordinates
        } = drawToolProps;

        const pattern = targetPattern;
        const linePattern = toolPattern;
        const {size, patternSize, opacity, compositeOperation, cap, join, patternMouseCentered} = toolParams as LineParams;

        const {width, height} = pattern.current.imageData;

        return {
            draw: (ev) => {
                const {ctx, e} = ev;

                if (!e) return;

                const newPrevPoints = {};

                const linePatternImage = patternValues.values[linePattern?.id];

                if (!linePatternImage || !linePattern) return;

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


                            const context = canvases[index].context;

                            if (!context) return;

                            context.beginPath();
                            context.moveTo(x, y);

                        });
                } else {

                    coordinates
                        .forEach(({x, y, id: index}) => {

                            const context = canvases[index].context;
                            canvases[index].clear();

                            newPrevPoints[index] = {x, y};

                            context.lineWidth = size;
                            context.lineJoin = join;
                            context.lineCap = cap;
                            context.globalAlpha = opacity;

                            context.strokeStyle = getPatternStrokeStyle(ctx, x, y, patternSize, linePattern, linePatternImage, patternMouseCentered);


                            if (prevPoints[index]) {
                                context.lineTo(x, y);
                            } else {
                                context.closePath();
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
                        )(
                            helperCanvas2
                        )
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
            cursors: ({x, y, outer}) => {

                let size = Math.max((toolParams as LineParams).size, 10);

                const rotation = (pattern.config.rotation && pattern.rotation.value.rotateDrawAreaElement) ? pattern.rotation.value : null;

                return Cursors.cross(x, y, size, rotation);
            }
        }
    }
};
import * as React from "react";
import {drawMasked, drawWithRotationAndOffset} from "../../../../../../utils/canvas/helpers/draw";
import {ECompositeOperation} from "../../../../../../store/compositeOperations";
import {getRandomColor} from "../../../../../../utils/utils";
import {createCanvas, HelperCanvas} from "../../../../../../utils/canvas/helpers/base";
import {CanvasServiceEvent, ToolHandlers, ToolService} from "../types";
import {patternsService} from "../../../../../../store";
import {PatternService} from "../../../PatternService";
import {EBrushType} from "../../../../../brush/types";

export class BrushPattern implements ToolService {
    patternService: PatternService;

    helperCanvas1: HelperCanvas;
    helperCanvas2: HelperCanvas;

    handlers: ToolHandlers = {};

    constructor(patternService: PatternService, _width: number, _height: number) {
        this.patternService = patternService;

        const width = _width || this.patternService.canvasService.canvas?.width || 50;
        const height = _height || this.patternService.canvasService.canvas?.height || 50;

        this.helperCanvas1 = createCanvas(width, height);
        this.helperCanvas2 = createCanvas(width, height);

        this.handlers = {
            onDraw: this.patternBrush,
            onClick: this.patternBrush,
            // cursors: ({x, y, outer}) => {
            //
            //     const brushPattern = toolPattern;
            //     const pattern = destinationPattern;
            //     const {size: patternSize} = toolParams as BrushPatternParams;
            //
            //     const patternRotation = (
            //         pattern?.config.rotation &&
            //         pattern?.rotation?.value.rotateDrawAreaElement
            //     ) ? pattern?.rotation?.value : null;
            //
            //     const brushRotation = brushPattern?.config.rotation ? brushPattern?.rotation?.value : null;
            //     // const brushPatternImage = patternsService.pattern[brushPattern?.id]?.current;
            //
            //     const width = patternSize * (brushPattern?.width);
            //     const height = patternSize * (brushPattern?.height);
            //     const xd = patternSize * (brushRotation?.offset?.xd || 0);
            //     const yd = patternSize * (brushRotation?.offset?.yd || 0);
            //     const xc = patternSize * (brushRotation?.offset?.xc || 0);
            //     const yc = patternSize * (brushRotation?.offset?.yc || 0);
            //     const patternAngle = patternRotation?.angle || 0;
            //     const brushAngle = brushRotation?.angle || 0;
            //
            //     return (
            //         <>
            //             {Cursors.rect(x, y, width, height, {
            //                 transform: `
            //                 rotate(
            //                     ${-patternAngle}
            //                     ${x}
            //                     ${y}
            //                 )
            //                 translate(
            //                     ${xd},
            //                     ${-yd}
            //                 )
            //                 rotate(
            //                     ${brushAngle}
            //                     ${x + xc}
            //                     ${y - yc}
            //                 )
            //             `
            //             })}
            //             {Cursors.cross(x, y, 20)}
            //         </>
            //     );
            // }
        };
    }

    setSize = (width: number, height: number) => {
        this.helperCanvas1.canvas.width = width;
        this.helperCanvas2.canvas.width = width;
        this.helperCanvas1.canvas.height = height;
        this.helperCanvas2.canvas.height = height;
    };

    patternBrush = (brushEvent: CanvasServiceEvent) => {

        const {context, events} = brushEvent;

        if (!events[0]) return;

        const state = this.patternService.storeService.getState();

        const targetPattern = state.patterns[this.patternService.patternId];
        const {
            size: patternSize,
            opacity,
            compositeOperation,
            patternId: toolPatternId
        } = state.brush.params.paramsByType[EBrushType.Pattern];
        const toolPattern = state.patterns[toolPatternId];
        const coordinates = state.position.coordinates;




        context.fillStyle = getRandomColor();
        context.globalAlpha = opacity;
        context.globalCompositeOperation = compositeOperation;
        context.imageSmoothingEnabled = true;

        const brushRotation = toolPattern?.config?.rotation ? toolPattern?.rotation?.value : null;
        const destinationRotation = (
            targetPattern?.config?.rotation &&
            targetPattern?.rotation?.value?.rotateDrawAreaElement
        ) ? targetPattern?.rotation?.value : null;

        const brushPatternImage = patternsService.pattern[toolPatternId]?.valuesService.masked;

        if (!brushPatternImage) return;

        const selectionMask = this.patternService.selectionService.mask;

        // 1 patternSize - divide two
        const width = patternSize * brushPatternImage.width;
        const height = patternSize * brushPatternImage.height;

        coordinates[0].forEach(({x, y}) => {

            //
            const destAngle = destinationRotation ? destinationRotation.angle : 0;

            const brushAngle = brushRotation ? brushRotation.angle : 0;
            const brushCenter = brushRotation ? {
                x: patternSize * brushRotation.offset.xc,
                y: patternSize * brushRotation.offset.yc
            } : {x: 0, y: 0};
            const brushOffset = brushRotation ? {
                x: patternSize * brushRotation.offset.xd,
                y: patternSize * brushRotation.offset.yd
            } : {x: 0, y: 0};


            drawWithRotationAndOffset(
                brushAngle,
                destAngle,
                brushCenter.x, -brushCenter.y,
                brushOffset.x, -brushOffset.y,
                x, y,
                ({context, canvas}) => {
                    context.drawImage(brushPatternImage, -width / 2, -height / 2, width, height);
                }
            )(this.helperCanvas1);


        });

        const resultCanvas: HelperCanvas = selectionMask
            ? drawMasked(
                selectionMask,
                ({context}) => {

                    context.drawImage(this.helperCanvas1.canvas, 0, 0);
                    this.helperCanvas1.clear();
                }
            )(
                this.helperCanvas2
            )
            : this.helperCanvas1;


        context.globalCompositeOperation = compositeOperation;
        context.globalAlpha = opacity;
        context.drawImage(resultCanvas.canvas, 0, 0);
        resultCanvas.clear();

        context.globalCompositeOperation = ECompositeOperation.SourceOver;
        context.globalAlpha = 1;
    };
}

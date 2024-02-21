import {getMaskFromSegments} from "../../selection/helpers";
import {PatternCanvasService} from "./PatternCanvasService";
import {Segments} from "../../selection/types";
import {PatternService} from "../PatternService";

export class PatternSelectionService {

    patternService: PatternService;

    isSelected?: boolean = false;

    mask?: ImageData;
    bBox?: SVGRect;

    constructor(patternService: PatternService) {
        this.patternService = patternService;
    }

    update = (segments: Segments, bBox?: SVGRect): PatternService => {
        if (segments.length) {
            this.mask = getMaskFromSegments(
                this.patternService.canvasService.canvas.width,
                this.patternService.canvasService.canvas.height,
                segments
            );
            this.bBox = bBox;

        } else {

            this.mask = null;
            this.bBox = null;
        }

        return this.patternService;
    };
}

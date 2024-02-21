import {createMaskedImageFromImageData, imageDataToCanvas} from "../../../../utils/canvas/helpers/imageData";
import {PatternService} from "../PatternService";
import {coordHelper2, imageDataDebug} from "../../../../components/Area/canvasPosition.servise";

export class PatternValuesService {
    patternService: PatternService;

    masked?: HTMLCanvasElement;
    selected?: HTMLCanvasElement;

    constructor(patternService: PatternService) {
        this.patternService = patternService;
    }

    update = (): PatternService => {
        this.updateMasked();
        this.updateSelected();

        return this.patternService;
    };

    updateMasked = (): PatternService => {
        if (this.patternService.maskService.isMaskEnabled) {
            this.masked = createMaskedImageFromImageData(
                this.patternService.canvasService.getImageData(),
                this.patternService.maskService.getImageData(),
                this.patternService.maskService.isMaskInverted
            );
        } else {
            this.masked = imageDataToCanvas(this.patternService.canvasService.getImageData());
        }

        return this.patternService;
    };

    updateSelected = (): PatternService => {
        this.selected = this.patternService.selectionService.mask
            ? createMaskedImageFromImageData(
                this.patternService.canvasService.getImageData(),
                this.patternService.selectionService.mask
            )
            : null;

        return this.patternService;
    };

    clearSelected = () => {
        this.selected = null;
    };

}


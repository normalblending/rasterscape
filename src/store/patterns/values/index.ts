import {createMaskedImageFromImageData} from "../../../utils/canvas/helpers/imageData";
import {Segments} from "../selection/types";
import {getMaskFromSegments} from "../selection/helpers";
import {imageDataDebug, imageDebug} from "../../../components/Area/canvasPosition.servise";
import {createCanvas} from "../../../utils/canvas/helpers/base";

export interface PatternItemValues {
    current?: HTMLCanvasElement;
    selected?: HTMLCanvasElement;
}
export const patternValues = new (class PatternValues {
    values: {
        [id: string]: PatternItemValues
    } = {};

    setValue = (id: string, imageData: ImageData, mask: ImageData, inverse: boolean) => {
        this.values[id] = {
            current: createMaskedImageFromImageData(imageData, mask, inverse),
            selected: this.values[id]?.selected,
        };
        return true;
    }

    setSelectedValue = (id: string, imageData?: ImageData, mask?: ImageData, bBox?: SVGRect) => {
        // let {canvas, context} = createCanvas(imageData.width, imageData.height).;
        const selected = (imageData && mask) ? createMaskedImageFromImageData(imageData, mask) : undefined;

        this.values[id] = {
            selected,
            current: this.values[id]?.current,
        };

        imageDebug.setImage(selected || null)
        return true;
    }
})();

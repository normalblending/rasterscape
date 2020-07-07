import {getMaskedImage} from "../../../utils/canvas/helpers/imageData";

export const patternValues = new (class PatternValues {
    values: {
        [id: string]: any
    } = {};

    setValue = (id, image, mask) => {
        this.values[id] = getMaskedImage(image, mask);
        return true;
    }
})();
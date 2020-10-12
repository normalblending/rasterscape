import {getMaskedImage} from "../../../utils/canvas/helpers/imageData";
import {coordHelper} from "../../../components/Area/canvasPosition.servise";

export const patternValues = new (class PatternValues {
    values: {
        [id: string]: any
    } = {};

    setValue = (id, image, mask, inverse) => {

        coordHelper.setText('inverse ' + inverse)
        this.values[id] = getMaskedImage(image, mask, inverse);
        return true;
    }
})();
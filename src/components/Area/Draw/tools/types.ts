import {PatternState} from "../../../../store/patterns/pattern/types";
import {BrushParams} from "../../../../store/brush/types";
import {LineParams} from "../../../../store/line/types";
import {DrawToolParams} from "../../../../store/tool/types";
import {RepeatingCoordinatesItem} from "../../../../store/patterns/repeating/helpers";


export type DrawToolProps = {
    targetPattern: PatternState
    toolPattern?: PatternState
    toolParams: DrawToolParams
    coordinates: RepeatingCoordinatesItem[]
};
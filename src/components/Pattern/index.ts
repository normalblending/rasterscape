import {EPatternType} from "../../store/patterns/types";
import {SimplePatternWindow} from "./SimplePatternWindow";

export const PatternComponentByType = {
    [EPatternType.Simple]: SimplePatternWindow
};
import {PatternService} from "./PatternService";
import {Store} from "redux";
import {AppState} from "../../index";
import {EToolType} from "../../tool/types";
import {EBrushType} from "../../brush/types";
import {ELineType} from "../../line/types";
import {coordHelper4, coordHelper5} from "../../../components/Area/canvasPosition.servise";

export class PatternsService {
    store: Store<AppState>;
    pattern: {
        [patternId: string]: PatternService
    } = {};

    constructor(store: Store<AppState>) {
        this.store = store;
    }

    addPattern = (patternId: string): PatternService => {
        this.pattern[patternId] = new PatternService(patternId, this.store);
        return this.pattern[patternId];
    };

    deletePattern = (patternId: string) => {
        const {[patternId]: shouldStop, ...activePatterns} = this.pattern;

        shouldStop?.stop();
        this.pattern = activePatterns;
    };

    bindTool = (tool: EToolType, toolType: EBrushType | ELineType) => {
        coordHelper4.setText('set bind tool');
        Object.values(this.pattern).forEach(pattern => pattern.patternToolService.bindTool(tool, toolType));
    }
}


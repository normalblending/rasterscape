import {PatternCanvasService} from "./PatternCanvasService";
import {PatternService} from "../PatternService";

export class PatternMaskService extends PatternCanvasService{

    isMaskEnabled?: boolean;
    isMaskInverted?: boolean;

    constructor(patternService: PatternService) {
        super(patternService);
    }

    setEnabled = (isMaskEnabled: boolean): PatternService => {
        this.isMaskEnabled = isMaskEnabled;
        return this.patternService;
    };

    setInverted = (isMaskInverted: boolean): PatternService => {
        this.isMaskInverted = isMaskInverted;
        return this.patternService;
    };
}

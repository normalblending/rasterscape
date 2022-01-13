import {PatternService} from "../../PatternService";


export interface CanvasServiceEvent {
    events: (MouseEvent | null)[]
    context: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
}

export type ToolHandlers = {
    onClick?: (e: CanvasServiceEvent) => void,
    onDown?: (e: CanvasServiceEvent) => void,
    onDraw?: (e: CanvasServiceEvent) => void,
    onRelease?: (e: CanvasServiceEvent) => void,
    // cursors: ({x, y, outer}, index) => void
};

export interface ToolService {
    patternService: PatternService
    handlers: ToolHandlers
    setSize?: (width: number, height: number) => void
}



// export type DrawToolProps = {
//     targetPattern: PatternState
//     toolPattern?: PatternState
//     toolParams: DrawToolParams
//     coordinates: RepeatingCoordinatesItem[]
//
// };

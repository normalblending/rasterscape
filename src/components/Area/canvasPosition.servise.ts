export interface CanvasPosition {
    x: number
    y: number
    patternId: string
}

export const position = {
    x: 0,
    y: 0,
    patternId: null
};

export const setPosition = (x: number, y: number, patternId: string) => {
    position.x = x;
    position.y = y;
    position.patternId = patternId;
};
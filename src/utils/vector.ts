export type Vector = {
    x: number,
    y: number,
};

export const createVector = (x, y): Vector => ({x, y});
export const vectorAdd = (v1: Vector, v2: Vector) => {
    return createVector(
        v1?.x + v2?.x,
        v1?.y + v2?.y,
    )
};
export const vectorMul = (v1: Vector, c: number) => {
    return createVector(
        v1?.x * c,
        v1?.y * c,
    )
};

export const rect = () =>
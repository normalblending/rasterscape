import * as React from "react";

export interface Vector {
    x: number,
    y: number,
}

export const createVector = (x, y): Vector => ({x, y});
export const vectorAdd = (v1: Vector, v2: Vector | number) => {
    return typeof v2 === 'object' ? createVector(
        v1?.x + (v2 as Vector)?.x,
        v1?.y + (v2 as Vector)?.y,
    ) : createVector(
        v1?.x + (v2 as number),
        v1?.y + (v2 as number),
    )
};
export const vectorMul = (v1: Vector, c: number) => {
    return createVector(
        v1?.x * c,
        v1?.y * c,
    )
};
export const vectorLength = (v: Vector) => {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
};



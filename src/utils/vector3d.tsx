import * as React from "react";

export interface Vector3D {
    x: number,
    y: number,
    z: number,
}

export const createVector3D = (x, y, z): Vector3D => ({x, y, z});
export const vectors3DAdd = (...vs: (Vector3D | number)[]) => {
    return vs.reduce<Vector3D>((res, v) => {
        return typeof v === 'object' ? createVector3D(
            (res as Vector3D)?.x + (v as Vector3D)?.x,
            (res as Vector3D)?.y + (v as Vector3D)?.y,
            (res as Vector3D)?.z + (v as Vector3D)?.z,
        ) : createVector3D(
            (res as Vector3D)?.x + (v as number),
            (res as Vector3D)?.y + (v as number),
            (res as Vector3D)?.z + (v as number),
        )
    }, createVector3D(0,0, 0))
};
export const vector3DMul = (v1: Vector3D, c: number) => {
    return createVector3D(
        v1?.x * c,
        v1?.y * c,
        v1?.z * c,
    )
};
// export const vector3DLength = (v: Vector3D) => {
//     return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));??
// };



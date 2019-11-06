import {pointsDistance} from "./canvas";

export enum ESegType {
    M = "M",
    L = "L",
    Z = "Z",
}

export enum EPathModeType {
    M = "M",
    L = "L",
    Z = "Z",
    Rect = "Rect",
    Slice = "Slice",
}

export interface Segment {
    type: ESegType
    values?: number[]
}

export const RECT_LENGTH = 5;

export const Path = {
    [EPathModeType.M]: (path: Segment[], [x, y]: number[]): Segment[] =>
        [...path, {type: ESegType.M, values: [x, y]}],
    [EPathModeType.L]: (path: Segment[], [x, y]: number[]): Segment[] =>
        [...path, {type: ESegType.L, values: [x, y]}],
    [EPathModeType.Z]: (path: Segment[]): Segment[] =>
        [...path, {type: ESegType.Z}],
    [EPathModeType.Rect]: (path: Segment[], [x1, y1, x2, y2]: number[], n = 0): Segment[] => {
        let {sliceStart, sliceEnd} = findSliceBounds(path, n);
        return [
            ...path.slice(0, sliceStart),
            {type: ESegType.M, values: [x1, y1]},
            {type: ESegType.L, values: [x2, y1]},
            {type: ESegType.L, values: [x2, y2]},
            {type: ESegType.L, values: [x1, y2]},
            {type: ESegType.Z},
            ...path.slice(sliceEnd + 1)
        ]
    },
    [EPathModeType.Slice]: (path: Segment[], slice: Segment[], n = 0): Segment[] => {
        let {sliceStart, sliceEnd} = findSliceBounds(path, n);
        return [
            ...path.slice(0, sliceStart),
            ...slice,
            ...path.slice(sliceEnd + 1)
        ]
    }
};

export const findSliceBounds = (path, n) => {
    let sliceStart, sliceEnd;
    let m = 0;
    for (let i = 0; i < path.length; i++) {
        if (path[i].type === ESegType.M) {
            if (m === n) {
                sliceStart = i;
                for (let j = i; j < path.length; j++) {
                    if (path[j].type === ESegType.Z) {
                        sliceEnd = j;
                        break;
                    }
                }
                break;
            }
            m++;
        }
    }

    return {
        sliceStart: typeof sliceStart === "undefined" ? path.length : sliceStart,
        sliceEnd: typeof sliceEnd === "undefined" ? path.length : sliceEnd,
    }
};

export const getLastSlice = (path: Segment[]) => {
    let i;
    for (i = path.length - 1; i >= 0; i--) {
        if (path[i].type === ESegType.M) {
            break;
        }
    }

    return path.slice(i);
};

export interface NearestSegmentData {
    index: number,
    segment: Segment,
    distance: number
    startInSlice?: number,
    sliceStart?: number
    sliceEnd?: number
    sliceN?: number
    slice?: Segment[]
}

export const getNearestSegment = (path: Segment[], x: number, y: number): NearestSegmentData => {
    if (!path || !path.length)
        return;

    const nearest: NearestSegmentData = path.slice(1).reduce((res: NearestSegmentData, segment, index) => {
        index++;

        if (!segment.values)
            return res;

        const distance = pointsDistance(x, y, segment.values[0], segment.values[1]);

        return distance < res.distance ? {
            distance, segment,
            index
        } : res;
    }, {
        sliceStart: 0,
        sliceEnd: 0,
        startInSlice: 0,
        index: 0,
        segment: path[0],
        distance: pointsDistance(x, y, path[0].values[0], path[0].values[1])
    });

    let sliceStart, sliceEnd;
    nearest.sliceN = -1;
    for (let i = 0; i < path.length; i++) {

        if (path[i].type === ESegType.M && i <= nearest.index) {
            sliceStart = i;
            nearest.sliceN += 1;
        }
        if (path[i].type === ESegType.Z && i > nearest.index && !sliceEnd) {
            sliceEnd = i;
        }
    }

    nearest.sliceStart = sliceStart;
    nearest.sliceEnd = sliceEnd;
    nearest.startInSlice = sliceStart ? nearest.index % sliceStart : nearest.index;

    nearest.slice = path.slice(nearest.sliceStart, nearest.sliceEnd + 1);


    return nearest;
};

export const pathDataToString = (pathData): string => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    (path as any).setPathData(pathData);

    return path.getAttribute("d");
};

export const stringToPathData = (string: string) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");


    path.setAttribute("d", string);

    return (path as any).getPathData();
};
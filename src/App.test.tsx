import {EPathModeType, ESegType, findSliceBounds, getLastSlice, getNearestSegment, Path} from "./utils/path";
import {pointsDistance} from "./utils/geometry";

describe('path module', () => {


    describe('getLastSlice', () => {
        it("one", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(getLastSlice(path)).toEqual(path);
        });
        it("two", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(getLastSlice(path)).toEqual([
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ]);
        });
    });


    describe('findSliceBounds', () => {
        it("one", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(findSliceBounds(path, 0)).toEqual({
                sliceStart: 0,
                sliceEnd: 4
            });
        });
        it("two", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(findSliceBounds(path, 1)).toEqual({
                sliceStart: 5,
                sliceEnd: 9
            });
        });
        it("three", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(findSliceBounds(path, 1)).toEqual({
                sliceStart: 5,
                sliceEnd: 9
            });
        });
        it("last", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(findSliceBounds(path, 4)).toEqual({
                sliceStart: 17,
                sliceEnd: 17
            });
        });
    });

    describe('rect', () => {
        it("push in empty", () => {
            const path = [];
            expect(Path[EPathModeType.Rect](path, [10, 10, 100, 100])).toEqual([
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.Z},
            ]);
        });

        it("replace first in 1 length", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(Path[EPathModeType.Rect](path, [10, 10, 100, 100])).toEqual([
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.Z},
            ]);
        });

        it("push second", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(Path[EPathModeType.Rect](path, [10, 10, 100, 100], 1)).toEqual([
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.Z},
            ]);
        });

        it("replace first in 2 length", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(Path[EPathModeType.Rect](path, [10, 10, 100, 100], 0)).toEqual([
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
            ]);
        });

        it("replace second in 2 length", () => {
            const path = [
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z}
            ];
            expect(Path[EPathModeType.Rect](path, [10, 10, 100, 100], 1)).toEqual([
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.Z},
            ]);
        });
    });

    describe('getNearestSegment', () => {


        it("one slice", () => {
            const path = [
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.Z},
            ];
            expect(getNearestSegment(path, 1, 1)).toEqual({
                slice: [
                    {type: ESegType.M, values: [10, 10]},
                    {type: ESegType.L, values: [10, 100]},
                    {type: ESegType.L, values: [100, 100]},
                    {type: ESegType.L, values: [100, 10]},
                    {type: ESegType.Z}
                ],
                sliceN: 0,
                sliceStart: 0,
                sliceEnd: 4,
                startInSlice: 0,
                index: 0,
                segment: path[0],
                distance: pointsDistance(1, 1, path[0].values[0], path[0].values[1])
            });
        });

        it("two slice", () => {
            const path = [
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.Z},
            ];
            expect(getNearestSegment(path, 21, 201)).toEqual({
                slice: [
                    {type: ESegType.M, values: [20, 20]},
                    {type: ESegType.L, values: [20, 200]},
                    {type: ESegType.L, values: [200, 200]},
                    {type: ESegType.L, values: [200, 20]},
                    {type: ESegType.L, values: [200, 20]},
                    {type: ESegType.Z}
                ],
                sliceN: 1,
                sliceStart: 5,
                sliceEnd: 10,
                startInSlice: 1,
                index: 6,
                segment: path[6],
                distance: pointsDistance(21, 201, path[6].values[0], path[6].values[1])
            });
        });

        it("three slice", () => {
            const path = [
                {type: ESegType.M, values: [10, 10]},
                {type: ESegType.L, values: [10, 100]},
                {type: ESegType.L, values: [100, 100]},
                {type: ESegType.L, values: [100, 10]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.L, values: [300, 20]},
                {type: ESegType.Z},
                {type: ESegType.M, values: [20, 20]},
                {type: ESegType.L, values: [20, 200]},
                {type: ESegType.L, values: [200, 200]},
                {type: ESegType.L, values: [200, 20]},
                {type: ESegType.L, values: [300, 20]},
                {type: ESegType.Z},
            ];
            expect(getNearestSegment(path, 200, 20)).toEqual({
                slice: [
                    {type: ESegType.M, values: [20, 20]},
                    {type: ESegType.L, values: [20, 200]},
                    {type: ESegType.L, values: [200, 200]},
                    {type: ESegType.L, values: [200, 20]},
                    {type: ESegType.L, values: [300, 20]},
                    {type: ESegType.Z}
                ],
                sliceN: 1,
                sliceStart: 5,
                sliceEnd: 10,
                startInSlice: 3,
                index: 8,
                segment: path[8],
                distance: pointsDistance(200, 20, path[8].values[0], path[8].values[1])
            });
        });
    });
});


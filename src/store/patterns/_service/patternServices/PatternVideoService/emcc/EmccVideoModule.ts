import createModule from "./build/videoModule.mjs";
import {
    coordHelper,
    coordHelper4,
    coordHelper5,
    imageDataDebug
} from "../../../../../../components/Area/canvasPosition.servise";



export class EmccVideoModule {

    Module;

    newFrameImageDataBufferPointer: number = null;
    newFrameImageDataBufferLength: number = 0;

    valuesArrayBufferPointer: number = null;
    valuesArrayBufferLength: number = 0;

    initStack: (width: number, height: number, depth: number, pushSide: number, edgeMode: number) => void
    setDepth: (depth: number) => void

    allocateArray32: (length: number) => number;
    setArray32: (array: Int32Array, pointer: number) => number;
    arrayToPointer32: (array: Int32Array) => number;


    allocateArrayU8: (length: number) => number;
    setArrayU8: (array: Uint8ClampedArray, pointer: number) => number;
    arrayToPointerU8: (array: Uint8ClampedArray) => number;
    pointerToArrayU8: (pointer: number, length: number) => Uint8ClampedArray;

    freePointer: (pointer: number) => void;

    defaultCutFunction: (
        imageData: Uint8ClampedArray | null,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        cutOffset: number,
    ) => Uint8ClampedArray

    paraboloidCutFunction: (
        imageData: Uint8ClampedArray | null,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        cutOffset: number,
        kx: number,
        ky: number,
        kz: number,
        dz: number
    ) => Uint8ClampedArray
    sis2CutFunction: (
        imageData: Uint8ClampedArray | null,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        cutOffset: number,
        cosA: number,
        h: number,
        xN: number,
        yN: number,
        xD: number,
        yD: number,
        XA: number,
        xdd: number,
        ydd: number
    ) => Uint8ClampedArray
    arrayXCutFunction: (
        imageData: Uint8ClampedArray | null,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        cutOffset: number,

        valuesArray: Int32Array,
        from: number,
        to: number,
        drawWidth: number,
        drawHeight: number
    ) => Uint8ClampedArray
    arrayYCutFunction: (
        imageData: Uint8ClampedArray | null,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        cutOffset: number,

        valuesArray: Int32Array,
        from: number,
        to: number,
        drawWidth: number,
        drawHeight: number
    ) => Uint8ClampedArray
    channelsCutFunction: (
        imageData: Uint8ClampedArray | null,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        cutOffset: number,

        depth1DataArray: Uint8ClampedArray,
        depth1width: number,
        depth1height: number,
        depth1zed: number,
        depth1zd: number,
        depth1component: number,

        depth2DataArray: Uint8ClampedArray,
        depth2width: number,
        depth2height: number,
        depth2zed: number,
        depth2zd: number,
        depth2component: number,

        depth3DataArray: Uint8ClampedArray,
        depth3width: number,
        depth3height: number,
        depth3zed: number,
        depth3zd: number,
        depth3component: number,

        depth4DataArray: Uint8ClampedArray,
        depth4width: number,
        depth4height: number,
        depth4zed: number,
        depth4zd: number,
        depth4component: number,
    ) => Uint8ClampedArray

    async instantiate(): Promise<EmccVideoModule> {
        this.Module = await createModule();
        this.initStack = this.Module.cwrap("initStack", "void", ["number", "number", "number", "number", "number"]);
        this.setDepth = this.Module.cwrap("setDepth", "void", ["number"]);

        this.allocateArray32 = (length: number): number => {
            return this.Module._malloc(length * Int32Array.BYTES_PER_ELEMENT)
        };
        this.setArray32 = (array: Int32Array, pointer: number) => {
            this.Module.HEAP32.set(array, pointer / Int32Array.BYTES_PER_ELEMENT);
            return pointer;
        };
        this.arrayToPointer32 = (array: Int32Array) => {
            const ptr = this.allocateArray32(array.length);
            this.setArray32(array, ptr);
            return ptr
        };

        this.allocateArrayU8 = (length: number): number => {
            return this.Module._malloc(length * Uint8ClampedArray.BYTES_PER_ELEMENT)
        };
        this.setArrayU8 = (array: Uint8ClampedArray, pointer: number) => {
            this.Module.HEAPU8.set(array, pointer / Uint8ClampedArray.BYTES_PER_ELEMENT);
            return pointer;
        };
        this.arrayToPointerU8 = (array: Uint8ClampedArray) => {
            const pointer = this.allocateArrayU8(array.length)
            this.setArrayU8(array, pointer);
            return pointer
        };
        this.pointerToArrayU8 = (pointer: number, length: number) => {
            const array = new Uint8ClampedArray(length)
            const pos = pointer / Uint8ClampedArray.BYTES_PER_ELEMENT;
            array.set(this.Module.HEAPU8.subarray(pos, pos + length))
            return array;
        };

        this.freePointer = (pointer: number) => {
            this.Module._free(pointer);
        };

        this.defaultCutFunction = this.wrapDefault(this.Module);
        this.paraboloidCutFunction = this.wrapParaboloid(this.Module);
        this.sis2CutFunction = this.wrapSis2(this.Module);
        this.arrayXCutFunction = this.wrapArrayX(this.Module);
        this.arrayYCutFunction = this.wrapArrayY(this.Module);
        this.channelsCutFunction = this.wrapChannels(this.Module);

        return this;
    }

    init (width: number, height: number, depth: number, pushSide: number, edgeMode: number): EmccVideoModule {
        this.initStack(width, height, depth, pushSide, edgeMode);

        this.valuesArrayBufferLength = 1000;
        this.valuesArrayBufferPointer = this.allocateArray32(this.valuesArrayBufferLength);

        this.newFrameImageDataBufferLength = width * height * 4;
        this.newFrameImageDataBufferPointer = this.allocateArrayU8(this.newFrameImageDataBufferLength);

        return this;
    }
    free() {
        this.freePointer(this.newFrameImageDataBufferPointer);
        this.freePointer(this.valuesArrayBufferPointer);
    }


    wrapDefault(Module) {
        return (
            imageData: Uint8ClampedArray | null,
            width: number,
            height: number,
            direction: number,
            mirror: number,
            cutOffset: number,
        ): Uint8ClampedArray => {
            const newFramePointer = imageData ? this.setArrayU8(imageData, this.newFrameImageDataBufferPointer) : null;

            const resultPointer = Module.ccall(
                "defaultCutFunction",
                "number",
                ["number", "number", "number", "number", "number", "number"],
                [newFramePointer, width, height, direction, mirror, cutOffset]
            );

            return this.pointerToArrayU8(resultPointer, this.newFrameImageDataBufferLength);
        };
    }

    wrapParaboloid(Module) {
        return (
            imageData: Uint8ClampedArray | null,
            width: number,
            height: number,
            direction: number,
            mirror: number,
            cutOffset: number,
            kx: number,
            ky: number,
            kz: number,
            dz: number
        ): Uint8ClampedArray => {
            const newFramePointer = imageData ? this.setArrayU8(imageData, this.newFrameImageDataBufferPointer) : null;

            const resultPointer = Module.ccall(
                "paraboloidCutFunction",
                "number",
                ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
                [newFramePointer, width, height, direction, mirror, cutOffset, kx, ky, kz, dz]
            );

            return this.pointerToArrayU8(resultPointer, this.newFrameImageDataBufferLength);
        };
    }
    wrapSis2(Module) {
        return (
            imageData: Uint8ClampedArray | null,
            width: number,
            height: number,
            direction: number,
            mirror: number,
            cutOffset: number,
            cosA: number,
            h: number,
            xN: number,
            yN: number,
            xD: number,
            yD: number,
            XA: number,
            xdd: number,
            ydd: number
        ): Uint8ClampedArray => {
            const newFramePointer = imageData ? this.setArrayU8(imageData, this.newFrameImageDataBufferPointer) : null;

            const resultPointer = Module.ccall(
                "sis2CutFunction",
                "number",
                ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
                [newFramePointer, width, height, direction, mirror, cutOffset, cosA, h, xN, yN, xD, yD, XA, xdd, ydd]
            );

            return this.pointerToArrayU8(resultPointer, this.newFrameImageDataBufferLength);
        };
    }
    wrapArrayX(Module) {
        return (
            imageData: Uint8ClampedArray | null,
            width: number,
            height: number,
            direction: number,
            mirror: number,
            cutOffset: number,

            valuesArray: Int32Array,
            from: number,
            to: number,
            drawWidth: number,
            drawHeight: number
        ): Uint8ClampedArray => {

            this.setArray32(valuesArray, this.valuesArrayBufferPointer);

            const newFramePointer = imageData ? this.setArrayU8(imageData, this.newFrameImageDataBufferPointer) : null;

            // make the call
            const resultPointer = Module.ccall(
                "arrayXCutFunction",
                "number",
                ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
                [newFramePointer, width, height, direction, mirror, cutOffset, this.valuesArrayBufferPointer, from, to, drawWidth, drawHeight]
            );

            return this.pointerToArrayU8(resultPointer, this.newFrameImageDataBufferLength);
        };
    }
    wrapArrayY(Module) {
        return (
            imageData: Uint8ClampedArray | null,
            width: number,
            height: number,
            direction: number,
            mirror: number,
            cutOffset: number,

            valuesArray: Int32Array,
            from: number,
            to: number,
            drawWidth: number,
            drawHeight: number
        ): Uint8ClampedArray => {
            this.setArray32(valuesArray, this.valuesArrayBufferPointer);

            const newFramePointer = imageData ? this.setArrayU8(imageData, this.newFrameImageDataBufferPointer) : null;

            const resultPointer = Module.ccall(
                "arrayYCutFunction",
                "number",
                ["number", "number", "number", "number", "number", "number", "number", "number", "number", "number", "number"],
                [newFramePointer, width, height, direction, mirror, cutOffset, this.valuesArrayBufferPointer, from, to, drawWidth, drawHeight]
            );

            return this.pointerToArrayU8(resultPointer, this.newFrameImageDataBufferLength);
        };
    }
    wrapChannels(Module) {
        return (
            imageData: Uint8ClampedArray | null,
            width: number,
            height: number,
            direction: number,
            mirror: number,
            cutOffset: number,

            depth1DataArray: Uint8ClampedArray,
            depth1width: number,
            depth1height: number,
            depth1zed: number,
            depth1zd: number,
            depth1component: number,

            depth2DataArray: Uint8ClampedArray,
            depth2width: number,
            depth2height: number,
            depth2zed: number,
            depth2zd: number,
            depth2component: number,

            depth3DataArray: Uint8ClampedArray,
            depth3width: number,
            depth3height: number,
            depth3zed: number,
            depth3zd: number,
            depth3component: number,

            depth4DataArray: Uint8ClampedArray,
            depth4width: number,
            depth4height: number,
            depth4zed: number,
            depth4zd: number,
            depth4component: number,
        ): Uint8ClampedArray => {

            const depth1DataArrayPointer = depth1DataArray && this.arrayToPointerU8(depth1DataArray);
            const depth2DataArrayPointer = depth2DataArray && this.arrayToPointerU8(depth2DataArray);
            const depth3DataArrayPointer = depth3DataArray && this.arrayToPointerU8(depth3DataArray);
            const depth4DataArrayPointer = depth4DataArray && this.arrayToPointerU8(depth4DataArray);

            const newFramePointer = imageData ? this.setArrayU8(imageData, this.newFrameImageDataBufferPointer) : null;

            const resultPointer = Module.ccall(
                "channelCutFunction",
                "number",
                [
                    "number", "number", "number", "number", "number", "number",
                    "number", "number", "number", "number", "number", "number",
                    "number", "number", "number", "number", "number", "number",
                    "number", "number", "number", "number", "number", "number",
                    "number", "number", "number", "number", "number", "number",
                ],
                [
                    newFramePointer,
                    width, height,
                    direction, mirror, cutOffset,

                    depth1DataArrayPointer,
                    depth1width,
                    depth1height,
                    depth1zed,
                    depth1zd,
                    depth1component,

                    depth2DataArrayPointer,
                    depth2width,
                    depth2height,
                    depth2zed,
                    depth2zd,
                    depth2component,

                    depth3DataArrayPointer,
                    depth3width,
                    depth3height,
                    depth3zed,
                    depth3zd,
                    depth3component,

                    depth4DataArrayPointer,
                    depth4width,
                    depth4height,
                    depth4zed,
                    depth4zd,
                    depth4component,
                ]
            );

            depth1DataArrayPointer && this.freePointer(depth1DataArrayPointer);
            depth2DataArrayPointer && this.freePointer(depth2DataArrayPointer);
            depth3DataArrayPointer && this.freePointer(depth3DataArrayPointer);
            depth4DataArrayPointer && this.freePointer(depth4DataArrayPointer);

            return this.pointerToArrayU8(resultPointer, this.newFrameImageDataBufferLength);
        };
    }
}

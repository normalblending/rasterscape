import createModule from "./build/matrixMultiply.mjs";
import {
    coordHelper,
    coordHelper4,
    coordHelper5,
    imageDataDebug
} from "../../../../../../components/Area/canvasPosition.servise";
import {randomInteger} from "../helpers";

export class EmccVideoModule {

    Module;

    newFrameImageDataBufferPointer: number = null;
    newFrameImageDataBufferLength: number = 0;

    initStack: (width: number, height: number, depth: number, pushSide: number, edgeMode: number) => void
    cutFunction = () => {

    };

    paraboloidCutFunction: (
        imageData: Uint8ClampedArray,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        kx: number,
        ky: number,
        kz: number,
        dz: number
    ) => Uint8ClampedArray

    async instantiate(): Promise<EmccVideoModule> {
        this.Module = await createModule();
        this.initStack = this.Module.cwrap("initStack", "void", ["number", "number", "number", "number", "number"]);
        this.paraboloidCutFunction = this.wrapParaboloid(this.Module)

        return this;
    }

    init (width: number, height: number, depth: number, pushSide: number, edgeMode: number): EmccVideoModule {
        this.initStack(width, height, depth, pushSide, edgeMode);

        this.newFrameImageDataBufferLength = width * height * 4;
        this.newFrameImageDataBufferPointer = this.Module._malloc(
            this.newFrameImageDataBufferLength * Uint8ClampedArray.BYTES_PER_ELEMENT
        );
        return this;
    }
    free() {
        this.Module._free(this.newFrameImageDataBufferPointer);
    }


    wrapParaboloid(Module) {
        return (
            imageData: Uint8ClampedArray,
            width: number,
            height: number,
            direction: number,
            mirror: number,
            kx: number,
            ky: number,
            kz: number,
            dz: number
        ): Uint8ClampedArray => {
            // multiplies two square matrices (as 2-D arrays) of the same size and returns the result

            const length = imageData.length;
            // console.log(length);

            // set up input arrays with the input data
            // const imageDataBuffer = Module._malloc(
            //     length * imageData.BYTES_PER_ELEMENT
            // );
            Module.HEAPU8.set(imageData, this.newFrameImageDataBufferPointer);

            // allocate memory for the result array
            // const resultBuffer = Module._malloc(
            //     length * imageData.BYTES_PER_ELEMENT
            // );


            // coordHelper.setText(22222, imageDataBuffer);
            // make the call
            const resultPointer = Module.ccall(
                "paraboloidCutFunction",
                "number",
                ["number", "number", "number", "number", "number", "number", "number", "number", "number"],
                [this.newFrameImageDataBufferPointer, width, height, direction, mirror, kx, ky, kz, dz]
            );


            // get the data from the returned pointer into an flat array
            const resultArray: Uint8ClampedArray = new Uint8ClampedArray(length);
            for (let i = 0; i < length; i++) {
                resultArray[i] = Module.HEAPU8[resultPointer / Uint8ClampedArray.BYTES_PER_ELEMENT + i];
            }

            // console.log(resultArray);
            // coordHelper4.setText(randomInteger(0,10), '-111-', resultPointer);

            // imageDataDebug.setImageData(new ImageData(resultArray, width, height));


            // Module._free(imageDataBuffer);
            // Module._free(resultBuffer);
            return resultArray;
        };
    }
}

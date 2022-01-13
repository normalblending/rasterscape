import loader, {ASUtil} from "@assemblyscript/loader";
import * as ASVideoModule from "./build/types";
import asVideoModule from "./build/index.wasm";

export class AsVideoModule {

    exports: ASUtil & typeof ASVideoModule;

    async instantiate() {
        const {exports} = await loader.instantiate<typeof ASVideoModule>(
            asVideoModule,
            {
                env: {
                    memory: new WebAssembly.Memory({initial: 10}),
                    abort: () => {
                    }
                }
            }
        );

        this.exports = exports;
    }


    // exports.paraboloidCutFunction()
    //

    // exports.setArrayParam(__newString('sis'), __newString('a'), __newArray(Int32Array_ID, [1, 2, 3]));
    // console.log('sis.a', __getArray(exports.getArrayParam(__newString('sis'), __newString('a'))));
    // exports.setArrayParam(__newString('sas'), __newString('a'), __newArray(Int32Array_ID, [6, 6, 6]));
    // console.log('sas.a', __getArray(exports.getArrayParam(__newString('sas'), __newString('a'))));
    // exports.setArrayParam(__newString('sas'), __newString('b'), __newArray(Int32Array_ID, [66, 66, 66]));
    // console.log('sas.b', __getArray(exports.getArrayParam(__newString('sas'), __newString('b'))));
    // console.log('sas.a', __getArray(exports.getArrayParam(__newString('sas'), __newString('a'))));

    init(width: number, height: number, depth: number, pushSide: number, edgeMode: number) {
        this.exports.init(width, height, depth, pushSide, edgeMode);
    }

    paraboloidCutFunction(
        imageData: Uint8ClampedArray,
        width: number,
        height: number,
        direction: number,
        mirror: number,
        kx: number,
        ky: number,
        kz: number,
        dz: number
    ): Uint8ClampedArray {
        const {paraboloidCutFunction, __newArray, __getArray} = this.exports
        const resultPtr = paraboloidCutFunction(
            __newArray(this.exports.Uint8ClampedArray_ID, imageData),
            width,
            height,
            direction,
            mirror,
            kx,
            ky,
            kz,
            dz
        );
        return new Uint8ClampedArray(__getArray(resultPtr));
    }
}

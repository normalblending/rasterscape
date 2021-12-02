import React, {useCallback} from "react";
import './styles.css';
import asModule from './as/build/index.wasm';
import * as ASModule from "./as/build/types";
import loader from "@assemblyscript/loader";
import {Int32Array_ID} from "./as/index.as";

export interface Day9Props {

}

const runWasm = async (canvasElement: HTMLCanvasElement) => {

    const {exports} = await loader.instantiate<typeof ASModule>(
        asModule,
        {
            env: {
                memory: new WebAssembly.Memory({initial: 1}),
                abort: () => {
                }
            }
        }
    );

    const {__newString, __newArray, __getArray, Int32Array_ID} = exports;

    exports.setArrayParam(__newString('sis'), __newString('a'), __newArray(Int32Array_ID, [1, 2, 3]));
    console.log('sis.a', __getArray(exports.getArrayParam(__newString('sis'), __newString('a'))));
    exports.setArrayParam(__newString('sas'), __newString('a'), __newArray(Int32Array_ID, [6, 6, 6]));
    console.log('sas.a', __getArray(exports.getArrayParam(__newString('sas'), __newString('a'))));
    exports.setArrayParam(__newString('sas'), __newString('b'), __newArray(Int32Array_ID, [66, 66, 66]));
    console.log('sas.b', __getArray(exports.getArrayParam(__newString('sas'), __newString('b'))));
    console.log('sas.a', __getArray(exports.getArrayParam(__newString('sas'), __newString('a'))));
};

// assembly script
export const Day9: React.FC<Day9Props> = (props) => {

    const canvasRef = useCallback((canvasElement: HTMLCanvasElement) => {
        runWasm(canvasElement);
    }, []);
    return (
        <div>
            <canvas
                width={20}
                height={20}
                style={{imageRendering: 'pixelated', width: '100px'}}
                ref={canvasRef}
            />
        </div>
    );
};

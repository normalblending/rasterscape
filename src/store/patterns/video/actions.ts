import {PatternAction} from "../pattern/types";
import {VideoParams} from "./types";
import {AppState} from "../../index";
import {Capture} from "./capture";
import {Formulas} from "./capture/formulas";
import {get, PixelsStack, set} from "./capture/pixels";
import * as P5 from 'p5';
import 'p5/lib/addons/p5.dom';
import {EdgeMode} from "./capture/types";
import {updateImage} from "../pattern/actions";

export enum EVideoAction {
    SET_VIDEO_PARAMS = 'pattern/video/set-video-param'

}

export interface SetVideoParamsAction extends PatternAction {
    value: VideoParams
}

// const capture = new Capture({
//     canvasElId: "v1",
//     videoElId: "v2",
//     w: 100,
//     h: 100,
//     f: Formulas(100, 100)['xx'].f({
//         array: (Array.from(Array(100))).map((o, i) => i)
//     }),
//     onNewFrame: (f) => {
//         // console.log(f);
//     }
// });
// capture.stop();

let c;
export const startVideoCapture = (id: string) => (dispatch, getState: () => AppState) => {
    console.log("start start start start start start start start ");

    c = capture((pixels) => {
        dispatch(updateImage(id, new ImageData(pixels, 320)));
        console.log(pixels);
    });


};
export const stopVideoCapture = (id) => (dispatch, getState: () => AppState) => {
    console.log("stop stop stop stop stop stop stop stop stop stop stop ")

    c.noLoop();
    console.log(c);
    c.remove();
};

export const setVideoParams = (id: string, value: VideoParams) => (dispatch, getState: () => AppState) => {
    const isOn = getState().patterns[id].video.params.on;
    if (!isOn && value.on) {
        dispatch(startVideoCapture(id));
    }
    if (isOn && !value.on) {
        dispatch(stopVideoCapture(id));
    }
    dispatch({
        type: EVideoAction.SET_VIDEO_PARAMS,
        id,
        value
    })
};


function capture(onNewFrame) {
    const w = 320,
        h = 240;

    const stack = new PixelsStack(w);

    const a = (Array.from(Array(w))).map((o, i) => i * h / w);

    const f = (x, y?, length?) => x;

    const getFrameN = (x, y, length) => {
        let frameN = Math.round(f(x, y, length));
        if (frameN >= length) frameN = length - 1;
        return frameN;
    };


    const getPixel = (pixelsStack, x, y, frameN) =>
        get(pixelsStack[x], w, 4, frameN, y);

    return new P5(sketch => {

        let canvas;
        let capture;
        sketch.setup = () => {
            sketch.pixelDensity(1);
            canvas = sketch.createCanvas(w, h);
            canvas.parent("v1");

            capture = sketch.createCapture({
                video: {
                    mandatory: {
                        minWidth: w,
                        minHeight: h
                    },
                    optional: [{
                        maxFrameRate: 30
                    }]
                },
                audio: false
            }, (s, b) => {
                console.log(s, b);
            });
            capture.parent("v2");
            capture.size(w, h);

            sketch.frameRate(30);
        };


        sketch.draw = () => {

            // let time = performance.now();

            sketch.loadPixels();

            capture.loadPixels();

            stack.push(capture.pixels);


            let pixelsStack = stack.array;

            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    const frameN = getFrameN(x, y, pixelsStack.length);
                    set(
                        sketch.pixels,
                        w,
                        4, x, y,
                        getPixel(pixelsStack, x, y, frameN)
                    )
                }
            }


            // pixelsStack = null;

            // console.log(performance.now() - time);

            sketch.updatePixels();
            onNewFrame(sketch.pixels);
        }
    });
}
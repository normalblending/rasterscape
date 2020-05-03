import {get, PixelsStack, set, StackType} from "./capture/pixels";
import * as P5 from 'p5';
import {patternReducers} from "../pattern/reducers";
import {VideoParams} from "./types";

export interface ICaptures {
    [patternId: string]: any
}

export enum EdgeMode {
    NO = 'no',
    TOP = 'top',
    BOT = 'bot',
    ALL = 'all',
}

export enum SlitMode {
    SIDE = 'side',
    FRONT = 'front',
}

const GetPixel = {
    [SlitMode.SIDE]: (pixelsStack, w, x, y, frameN) =>
        get(pixelsStack[x], w, 4, frameN, y),
    [SlitMode.FRONT]: (pixelsStack, w, x, y, frameN) =>
        get(pixelsStack[frameN], w, 4, x, y)
};


const GetFrameN = {
    [EdgeMode.NO]: (z, length) => Math.round(z),
    [EdgeMode.TOP]: (z, length) => {
        let frameN = Math.round(z);
        if (frameN >= length) frameN = length - 1;
        return frameN;
    },
    [EdgeMode.BOT]: (z, length) => {
        let frameN = Math.round(z);
        if (frameN < 0) frameN = 0;
        return frameN;
    },
    [EdgeMode.ALL]: (z, length) => {
        let frameN = Math.round(z);
        if (frameN >= length) frameN = length - 1;
        if (frameN < 0) frameN = 0;
        return frameN;
    },
};

export class CaptureService {

    captures: ICaptures = {};

    createCapture(
        patternId,
        onNewFrame,
        cutFunction,
        edgeMode: () => EdgeMode,
        slitMode: () => SlitMode,
        stackType: () => StackType,
    ) {
        const w = 320,
            h = 320;

        const stack = new PixelsStack(w);

        let getFrameN, getPixel;
        const update = () => {
             getFrameN = GetFrameN[edgeMode()];
             getPixel = GetPixel[slitMode()];
             stack.setType(stackType())
        };
        update();


        let canvas;
        let capture;

        const sketch = new P5(sketch => {

            sketch.setup = () => {
                sketch.pixelDensity(1);
                canvas = sketch.createCanvas(w, h);
                // canvas.parent("v1");
                canvas.hide();
                capture = sketch.createCapture({
                    video: {
                        mandatory: {
                            minWidth: w,
                            minHeight: h
                        },
                        optional: [{
                            maxFrameRate: 25
                        }]
                    },
                    audio: false
                }, (s, b) => {
                    this.captures[patternId].stream = s;
                });
                // capture.parent("v2");
                capture.size(w, h);
                capture.hide();

                sketch.frameRate(20);
            };


            sketch.draw = () => {

                // let time = performance.now();

                sketch.loadPixels();

                capture.loadPixels();

                stack.push(capture.pixels);


                let pixelsStack = stack.array;

                for (let x = 0; x < w; x++) {
                    for (let y = 0; y < h; y++) {
                        const z = Math.round(cutFunction(x, y, pixelsStack.length));
                        const frameN = getFrameN(z, pixelsStack.length);
                        set(
                            sketch.pixels,
                            w,
                            4, x, y,
                            getPixel(pixelsStack, w, x, y, frameN)
                        )
                    }
                }


                // pixelsStack = null;

                // console.log(performance.now() - time);

                sketch.updatePixels();
                onNewFrame(sketch.pixels);
            }
        });

        this.captures[patternId] = {
            sketch,
            canvas,
            capture,
            update
        };

        return this.captures[patternId];
    }

    pause = (patternId) => {
        this.captures[patternId].sketch.noLoop();
    };

    play = (patternId) => {
        this.captures[patternId].sketch.loop();
    };

    start = (patternId, onNewFrame, cf, em, sm, st) => {

        if (this.captures[patternId]) {
            this.stop(patternId);
        }

        this.captures[patternId] = this.createCapture(patternId, onNewFrame, cf, em, sm, st);

        return this.captures[patternId];
    };

    stop = (patternId: string) => {

        const {[patternId]: stopped, ...others} = this.captures;

        if (stopped) {
            stopped.sketch.noLoop();
            stopped.sketch.remove();
            stopped.stream.getTracks()[0].stop();

            this.captures = others;
        }
    };

    updateParams = (patternId: string) => {
        this.captures[patternId]?.update();
    };

}

export const Captures = new CaptureService();
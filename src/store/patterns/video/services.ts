import {get, PixelsStack, set} from "./capture/pixels";
import * as P5 from 'p5';

export interface ICaptures {
    [patternId: string]: any
}

export class CaptureService {

    captures: ICaptures = {};

    createCapture(patternId, onNewFrame, changeFunction) {
        const w = 320,
            h = 240;

        const stack = new PixelsStack(w);

        const a = (Array.from(Array(w))).map((o, i) => i * h / w);

        const f = (x, y?, length?) => x;

        const getFrameN = (x, y, length) => {

            // return getChangeFunction(x, y, length)


            let frameN = Math.round(changeFunction(x, y, length));
            if (frameN >= length) frameN = length - 1;
            return frameN;
        };


        const getPixel = (pixelsStack, x, y, frameN) =>
            get(pixelsStack[x], w, 4, frameN, y);

        let canvas;
        let capture;

        const sketch = new P5(sketch => {

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
                    // stream(s);
                    this.captures[patternId].stream = s;
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

        this.captures[patternId] = {
            sketch,
            canvas,
            capture
        };

        return this.captures[patternId];
    }

    pause = (patternId) => {
        this.captures[patternId].sketch.noLoop();
    };

    play = (patternId) => {
        this.captures[patternId].sketch.loop();
    };

    start = (patternId, onNewFrame, cf) => {

        if (this.captures[patternId]) {
            this.stop(patternId);
        }

        this.captures[patternId] = this.createCapture(patternId, onNewFrame, cf);

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

}

export const Captures = new CaptureService();
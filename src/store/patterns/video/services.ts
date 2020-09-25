import {get, PixelsStack, set, StackType} from "./capture/pixels";
import * as P5 from 'p5';
import {patternReducers} from "../pattern/reducers";
import {VideoParams} from "./types";
import {coordHelper2, coordHelper3, coordHelper4} from "../../../components/Area/canvasPosition.servise";

export interface ICaptures {
    [patternId: string]: Capture
}

export enum EdgeMode {
    NO = 'no',
    TOP = 'top',
    BOT = 'bot',
    ALL = 'all',
}

export enum SlitMode {
    FRONT = 'front',
    BACK = 'back',
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
}

const GetFrameN = {
    [EdgeMode.NO]: (z, length) => {
        return Math.round(z);
    },
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

export interface CaptureOptions {
    width?: number,
    height?: number,
    depth?: number,
    patternId
    onNewFrame: (pixels, width, height) => any
    cutFunction: (x, y) => any
    edgeMode: EdgeMode,
    slitMode: SlitMode,
    stackType: StackType,
    onStream?: (stream, patternId?) => void
}

export class Capture {

    on: boolean;
    isPause: boolean;

    width = 320
    height = 320
    depth = 320

    stack: PixelsStack
    edgeMode: EdgeMode = EdgeMode.ALL
    slitMode: SlitMode = SlitMode.FRONT

    sketch: P5
    canvas
    capture
    stream

    onNewFrame
    cutFunction

    constructor(options: CaptureOptions) {
        const {
            width,
            height,
            depth,
            patternId,
            onNewFrame,
            cutFunction,
            edgeMode,
            slitMode,
            stackType,
            onStream
        } = options;

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.stack = new PixelsStack(this.depth, stackType);
        this.edgeMode = edgeMode;
        this.slitMode = slitMode;

        this.onNewFrame = onNewFrame;
        this.cutFunction = cutFunction;

        new P5(sketch => {
            this.sketch = sketch;
            let frames = 0;
            const FRAMES_UPDATE = 50;
            sketch.setup = () => {
                sketch.pixelDensity(1);
                this.canvas = sketch.createCanvas(this.width, this.height);

                this.capture = sketch.createCapture({
                    video: {
                        mandatory: {
                            minWidth: this.width,
                            minHeight: this.height
                        },
                        optional: [{
                            maxFrameRate: 25
                        }]
                    },
                    audio: false
                }, (stream) => {
                    onStream(stream, patternId)
                });

                this.capture.size(this.width, this.height);

                this.capture.parent("v2"); //
                this.canvas.parent("v1"); //
                // this.canvas.hide();
                // this.capture.hide();

                sketch.frameRate(20);
            };

            sketch.draw = () => {

                // let time = performance.now();

                sketch.loadPixels();

                this.capture.loadPixels();
                // this.canvas.scale(-1.0, 1.0);

                this.stack.push(this.capture.pixels, this.width, this.height);

                coordHelper2.setText(this.width, this.height);
                coordHelper3.setText(sketch.pixels.length);

                // let pixelsStack = this.stack.getArray();

                let coords: [number, number, number];
                for (let x = 0; x < this.width; x++) {
                    for (let y = 0; y < this.height; y++) {
                        const z = cutFunction(x, y);
                        switch (this.slitMode) {
                            case SlitMode.FRONT:
                                coords = [x, y, z]
                                break;
                            case SlitMode.BACK:
                                coords = [x, y, 1 - z]
                                break;
                            case SlitMode.LEFT:
                                coords = [
                                    Math.round(z * this.width),
                                    y,
                                    x / this.width
                                ]
                                break;
                            case SlitMode.RIGHT:
                                coords = [
                                    Math.round(z * this.width),
                                    y,
                                    (this.width - x) / this.width
                                ]
                                break;
                            case SlitMode.TOP:
                                coords = [
                                    x,
                                    Math.round(z * (this.height - 1)),
                                    y / (this.height - 1)
                                ]
                                break;
                            case SlitMode.BOTTOM:
                                coords = [
                                    x,
                                    Math.round(z * (this.height - 1)),
                                    ((this.height - 1) - y) / (this.height - 1)
                                ]
                                break;
                            default:
                                coords = [x, y, z]
                                break;
                        }
                        set(
                            sketch.pixels,
                            this.width,
                            4, x, y,
                            this.stack.getPixel(...coords)
                        )
                    }
                }


                // pixelsStack = null;

                // console.log(performance.now() - time);

                sketch.updatePixels(0, 0, this.width, this.height);
                frames = (frames + 1) % FRAMES_UPDATE;
                onNewFrame(sketch.pixels, this.width, this.height);
            }
        });

        this.on = true;
        this.isPause = false;
    }

    stop = () => {
        this.sketch?.noLoop();
        this.sketch?.remove();
        this.stream?.getTracks()[0].stop();

        this.on = false;
        this.isPause = false;
    };

    pause = () => {
        this.sketch.noLoop();

        this.on = true;
        this.isPause = true;
    };

    play = () => {
        this.sketch.loop();

        this.on = true;
        this.isPause = false;
    };

    updateImage = () => {
        // this.sketch.loadPixels();

        // this.capture.loadPixels();
        // this.canvas.scale(-1.0, 1.0);

        // this.stack.push(this.capture.pixels, this.width, this.height);

        // coordHelper2.setText(this.width, this.height);
        // coordHelper3.setText(this.sketch.pixels.length);

        // let pixelsStack = this.stack.getArray();

        let coords: [number, number, number];
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const z = this.cutFunction(x, y);
                switch (this.slitMode) {
                    case SlitMode.FRONT:
                        coords = [x, y, z]
                        break;
                    case SlitMode.BACK:
                        coords = [x, y, 1 - z]
                        break;
                    case SlitMode.LEFT:
                        coords = [
                            Math.round(z * this.width),
                            y,
                            x / this.width
                        ]
                        break;
                    case SlitMode.RIGHT:
                        coords = [
                            Math.round(z * this.width),
                            y,
                            (this.width - x) / this.width
                        ]
                        break;
                    case SlitMode.TOP:
                        coords = [
                            x,
                            Math.round(z * (this.height - 1)),
                            y / (this.height - 1)
                        ]
                        break;
                    case SlitMode.BOTTOM:
                        coords = [
                            x,
                            Math.round(z * (this.height - 1)),
                            ((this.height - 1) - y) / (this.height - 1)
                        ]
                        break;
                    default:
                        coords = [x, y, z]
                        break;
                }
                set(
                    this.sketch.pixels,
                    this.width,
                    4, x, y,
                    this.stack.getPixel(...coords)
                )
            }
        }


        // pixelsStack = null;

        // console.log(performance.now() - time);

        this.sketch.updatePixels(0, 0, this.width, this.height);
        // frames = (frames + 1) % FRAMES_UPDATE;
        this.onNewFrame(this.sketch.pixels, this.width, this.height);
    };


    setSlitMode = (value: SlitMode) => {
        this.slitMode = value;

        if (this.on && this.isPause) {
            this.updateImage();
        }
    };

    setSize = (width?, height?) => {
        this.width = width || this.width;
        this.height = height || this.height;

        this.sketch.pixels = new Uint8ClampedArray(this.width * this.height * 4);

        this.capture.size(this.width, this.height);
        this.sketch.resizeCanvas(this.width, this.height);
        this.sketch.pixelDensity(1);
    }

    setWidth = (width) => {
        this.width = width || this.width;

        this.sketch.pixels = new Uint8ClampedArray(this.width * this.height * 4);

        this.capture.size(this.width, this.height);
        this.sketch.resizeCanvas(this.width, this.height);
        this.sketch.pixelDensity(1);
    };
    setHeight = (height) => {
        this.height = height || this.height;

        this.sketch.pixels = new Uint8ClampedArray(this.width * this.height * 4);

        this.capture.size(this.width, this.height);
        this.sketch.resizeCanvas(this.width, this.height);
        this.sketch.pixelDensity(1);

        this.setSize(this.width + 1, this.height);
        this.setSize(this.width - 1, this.height);
    };

    setDepth = (depth) => {
        this.stack.setSize(depth);
    }

}

export class CaptureService {

    public captures: ICaptures = {};

    pause = (patternId) => {
        this.captures[patternId].pause();
    };

    play = (patternId) => {
        this.captures[patternId].play();
    };

    start = (options: CaptureOptions) => {
        const {patternId} = options;

        if (this.captures[patternId]) {
            this.stop(patternId);
        }

        this.captures[patternId] = new Capture({
            ...options,
            onStream: (stream) => {
                if (this.captures[patternId]) {
                    this.captures[patternId].stream = stream;
                }
            }
        });

        return this.captures[patternId];
    };

    stop = (patternId: string) => {

        const {[patternId]: stopped, ...others} = this.captures;

        stopped?.stop();
        this.captures = others;
    };

    updateParams = (patternId: string) => {
        console.log('UPDATE PARAMS VIDOE')
        // this.captures[patternId]?.update();
    };

}

export const Captures = new CaptureService();
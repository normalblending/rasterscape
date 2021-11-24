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
    BOT = 'bottom',
    ALL = 'all',
}

export enum MirrorMode {
    NO = '◢|◺',
    VERTICAL = 'vertical',
    HORIZONTAL = '◿|◣',
    BOTH = 'both',
}
export const mirrorModesSelectItems = [MirrorMode.NO, MirrorMode.HORIZONTAL];

export enum SlitMode {
    FRONT = 'front',
    BACK = 'back',
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
}


export interface CaptureOptions {
    patternId
    width?: number,
    height?: number,
    depth?: number,
    onNewFrame: (pixels, width, height) => any
    cutFunction: (x, y) => any
    edgeMode: EdgeMode,
    slitMode: SlitMode,
    stackType: StackType,
    mirrorMode: MirrorMode,
    onStream?: (stream, patternId?) => void
}

export class Capture {

    on: boolean;
    isPause: boolean;

    width = 320
    height = 320
    depth = 320

    stack: PixelsStack
    slitMode: SlitMode = SlitMode.FRONT
    mirrorMode: MirrorMode = MirrorMode.NO
    mirrorH: boolean = false
    mirrorV: boolean = false

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
            mirrorMode,
            stackType,
            onStream
        } = options;

        this.width = width;
        this.height = height;
        this.depth = depth;
        this.stack = new PixelsStack(this.depth, stackType, edgeMode);
        this.slitMode = slitMode;
        this.mirrorMode = mirrorMode;
        this.mirrorH = mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.HORIZONTAL;
        this.mirrorV = mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.VERTICAL;

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
                this.canvas.hide();
                this.capture.hide();

                sketch.frameRate(20);
            };

            sketch.draw = () => {

                // let time = performance.now();
                try {

                    sketch.loadPixels();

                    this.capture.loadPixels();
                    // this.canvas.scale(-1.0, 1.0);

                    this.stack.push(this.capture.pixels, this.width, this.height);

                    // coordHelper2.setText(this.width, this.height);
                    // coordHelper3.setText(sketch.pixels.length);

                    // let pixelsStack = this.stack.getArray();

                    return this.updateImage();
                } catch (e) {

                }
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

        let coords: [number, number, number];


        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {

                // const xx = this.mirrorH ? (this.width - 1 - x) : x;
                // const yy = this.mirrorV ? (this.height - 1 - y) : y;

                const z = this.cutFunction(x, y);
                switch (this.slitMode) {
                    case SlitMode.BACK:
                        coords = [x, y, z]
                        break;
                    case SlitMode.FRONT:
                        coords = [x, y, 1 - z]
                        break;
                    case SlitMode.LEFT:
                        coords = [
                            Math.round(z * (this.width - 1)),
                            y,
                            x / (this.width - 1)
                        ]
                        break;
                    case SlitMode.RIGHT:
                        coords = [
                            Math.round((1 - z) * (this.width - 1)),
                            y,
                            ((this.width - 1) - x) / (this.width - 1)
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
                            Math.round((1 - z) * (this.height - 1)),
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
                    4,
                    x,
                    y,
                    this.stack.getPixel(
                        this.mirrorH ? (this.width - 1 - coords[0]) : coords[0],
                        this.mirrorV ? (this.height - 1 - coords[1]) : coords[1],
                        coords[2]
                    )
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

    setEdgeMode = (value: EdgeMode) => {
        this.stack.setEdgeMode(value);

        if (this.on && this.isPause) {
            this.updateImage();
        }
    };

    setMirrorMode = (value: MirrorMode) => {
        this.mirrorMode = value;
        this.mirrorH = value === MirrorMode.BOTH || value === MirrorMode.HORIZONTAL;
        this.mirrorV = value === MirrorMode.BOTH || value === MirrorMode.VERTICAL;

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
    };
    setHeight = (height) => {
        this.height = height || this.height;

        this.sketch.pixels = new Uint8ClampedArray(this.width * this.height * 4);

        this.capture.size(this.width, this.height);
        this.sketch.resizeCanvas(this.width, this.height);

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

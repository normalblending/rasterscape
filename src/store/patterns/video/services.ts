import {PixelsStack, set, StackType, StackTypeASMap} from "./_old/capture/pixels";
import * as P5 from 'p5';

import asVideoModule from './_old/capture/as/build/index.wasm';
import {AsVideoModule} from "./_old/capture/as/AsVideoModule";
import loader, {ASUtil} from "@assemblyscript/loader";
import {coordHelper5, imageDataDebug} from "../../../components/Area/canvasPosition.servise";
import {EmccVideoModule} from "./_old/capture/emcc/EmccVideoModule";

export interface ICaptures {
    [patternId: string]: Capture
}

export enum EdgeMode {
    NO = 'no',
    TOP = 'top',
    BOT = 'bottom',
    ALL = 'all',
}

export const EdgeModeASMap = {
    [EdgeMode.NO]: 0,
    [EdgeMode.TOP]: 1,
    [EdgeMode.BOT]: 2,
    [EdgeMode.ALL]: 3,
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

export const SlitModeDirectionMap = {
    [SlitMode.FRONT]: 0,
    [SlitMode.BACK]: 1,
    [SlitMode.TOP]: 2,
    [SlitMode.BOTTOM]: 3,
    [SlitMode.LEFT]: 4,
    [SlitMode.RIGHT]: 5,
}


export interface CaptureOptions {
    patternId
    width?: number,
    height?: number,
    depth?: number,
    onNewFrame: (pixels: Uint8ClampedArray, width, height) => any
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

    patternId: string
    onStream: (stream, patternId?) => void

    stack: PixelsStack
    stackType: StackType
    edgeMode: EdgeMode
    slitMode: SlitMode = SlitMode.FRONT
    mirrorMode: MirrorMode = MirrorMode.NO
    mirrorH: boolean = false
    mirrorV: boolean = false

    sketch: P5
    canvas
    capture
    stream

    onNewFrame: (pixels: Uint8ClampedArray, width, height) => any
    cutFunction

    // wasmVideoModule: AsVideoModule = new AsVideoModule();
    wasmVideoModule: EmccVideoModule = new EmccVideoModule();

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
        this.stackType = stackType;
        this.edgeMode = edgeMode;

        this.patternId = patternId;
        this.onStream = onStream;

        this.stack = new PixelsStack(width, height, this.depth, stackType, edgeMode);
        this.slitMode = slitMode;
        this.mirrorMode = mirrorMode;
        this.mirrorH = mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.HORIZONTAL;
        this.mirrorV = mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.VERTICAL;

        this.onNewFrame = onNewFrame;
        this.cutFunction = cutFunction;

        this.init();

        this.on = true;
        this.isPause = false;
    }

    async init() {
        await this.wasmVideoModule.instantiate();

        this.wasmVideoModule.init(
            this.width, this.height, this.depth,
            0,
            EdgeModeASMap[this.edgeMode]);

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
                    this.onStream(stream, this.patternId)
                });

                this.capture.size(this.width, this.height);

                this.capture.parent("v2"); //
                this.canvas.parent("v1"); //
                this.canvas.hide();
                this.capture.hide();

                sketch.frameRate(15);
            };

            let i = 0;
            sketch.draw = () => {
                // coordHelper5.setText(i++);

                // let time = performance.now();
                try {

                    // sketch.loadPixels();
                    //
                    this.capture.loadPixels();

                    // this.canvas.scale(-1.0, 1.0);

                    // console.log(this.capture.pixels);
                    if (this.capture.pixels.length) {
                        const newFrame = this.wasmVideoModule.paraboloidCutFunction(
                            this.capture.pixels,
                            this.width,
                            this.height,
                            0,
                            this.mirrorH ? 1 : 0,
                            1.5,
                            1.5,
                            1,
                            0
                        );

                        imageDataDebug.setImageData(new ImageData(newFrame, this.width, this.height));

                        // this.onNewFrame(newFrame, this.width, this.height);
                    }
                    // return this.update();
                } catch (e) {

                }
            }
        });
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

    update = () => {
        this.updateImage(
            this.sketch.pixels
        );

        this.onNewFrame(this.sketch.pixels, this.width, this.height);
    };

    updateImage = (pixels: Uint8ClampedArray) => {

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
                    pixels,
                    this.width,
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

    };


    setSlitMode = (value: SlitMode) => {
        this.slitMode = value;

        if (this.on && this.isPause) {
            this.update();
        }
    };

    setEdgeMode = (value: EdgeMode) => {
        this.stack.setEdgeMode(value);

        if (this.on && this.isPause) {
            this.update();
        }
    };

    setMirrorMode = (value: MirrorMode) => {
        this.mirrorMode = value;
        this.mirrorH = value === MirrorMode.BOTH || value === MirrorMode.HORIZONTAL;
        this.mirrorV = value === MirrorMode.BOTH || value === MirrorMode.VERTICAL;

        if (this.on && this.isPause) {
            this.update();
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
        if (this.sketch) {
            this.height = height || this.height;

            this.sketch.pixels = new Uint8ClampedArray(this.width * this.height * 4);

            this.capture.size(this.width, this.height);
            this.sketch.resizeCanvas(this.width, this.height);

            this.setSize(this.width + 1, this.height);
            this.setSize(this.width - 1, this.height);
        }
    };

    setDepth = (depth) => {
        // this.stack.setSize(depth);// todo тут надо вернуть функцию
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

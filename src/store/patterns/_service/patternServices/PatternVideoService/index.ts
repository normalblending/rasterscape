import {PatternService} from "../../PatternService";
import {EmccVideoModule} from "./emcc/EmccVideoModule";
import {ECFType} from "../../../../changeFunctions/types";
import {
    FxyArrayParams,
    FxyArrayType,
    FxyParams,
    FxyType,
    ParabParams,
    Sis2Params
} from "../../../../changeFunctions/functions/fxy";
import {
    coordHelper2,
    coordHelper3,
    coordHelper4,
    imageDataDebug
} from "../../../../../components/Area/canvasPosition.servise";
import {xyArrayVideoFunctionByType} from "../../../video/_old/capture/cutFunctions";
import {CfDepthParams} from "../../../../changeFunctions/functions/depth";
import {patternsService} from "../../../../index";
import {CameraService, CameraServiceInitParams} from "./CameraService";
import {ShaderVideoModule} from "./ShaderVideoModule";

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

export const EdgeModeASMap = {
    [EdgeMode.NO]: 0,
    [EdgeMode.TOP]: 1,
    [EdgeMode.BOT]: 2,
    [EdgeMode.ALL]: 3,
}


export enum StackType {
    Right = ">",
    Left = "<",
    FromCenter = "<>",
    ToCenter = "><",
}

export const StackTypeASMap = {
    [StackType.Right]: 0,
    [StackType.Left]: 1,
    [StackType.FromCenter]: 2,
    [StackType.ToCenter]: 3,
}


export interface VideoServiceInitParams {
    width: number;
    height: number;
    depth: number,
    edgeMode: EdgeMode,
    slitMode: SlitMode,
    stackType: StackType,
    mirrorMode: MirrorMode
    cutOffset: number
}

export class PatternVideoService {
    patternService: PatternService;

    isCameraOn: boolean = false;
    isUpdatingOn: boolean = false;
    isOn: boolean = false;
    isPause: boolean = false;

    width: number;
    height: number;
    depth: number;

    cameraService: CameraService = new CameraService();
    device: MediaDeviceInfo;

    requestFrameID: number;

    wasmVideoModule: ShaderVideoModule;

    stackType: StackType = StackType.Right;
    edgeMode: EdgeMode = EdgeMode.ALL;
    slitMode: SlitMode = SlitMode.FRONT;
    mirrorMode: MirrorMode = MirrorMode.NO;
    mirrorH: boolean = false
    mirrorV: boolean = false
    cutOffset: number;
    changeFunctionId: string;

    constructor(patternService: PatternService) {
        this.patternService = patternService;


        this.wasmVideoModule = new ShaderVideoModule();

    }

    initCamera(params: CameraServiceInitParams): PatternVideoService {
        this.cameraService.init(params);
        return this;
    }

    async startCamera() {
        await this.cameraService.start();
        return this;
    }

    stopCamera() {
        this.cameraService.stop();
        return this;
    }

    setDevice = async (device: MediaDeviceInfo): Promise<PatternVideoService> => {
        this.device = device;

        await this.cameraService.setDevice(device);

        return this;
    };



    async init(params: VideoServiceInitParams): Promise<PatternVideoService> {

        this.width = this.patternService.canvasService.canvas.width;
        this.height = this.patternService.canvasService.canvas.height;
        this.depth = Math.ceil(params.depth * this.width) || 1;

        this.edgeMode = params.edgeMode;
        this.slitMode = params.slitMode;
        this.stackType = params.stackType;
        this.mirrorMode = params.mirrorMode;
        this.cutOffset = params.cutOffset;

        (await this.wasmVideoModule
            .instantiate())
            .init(
                this.width, this.height, this.depth,
                0,
                EdgeModeASMap[this.edgeMode]
            );

        return this;

    }

    start = () => {
        // if (this.requestFrameID) return;

        let prevTime = 0;
        let minTime = 1000;
        let maxTime = 0;
        const times = new Array(50);
        const changing = (time) => {


            // DRAW SPEED
            const interval = time - prevTime;
            times.push(interval);
            times.shift();

            minTime = Math.min(minTime, interval);

            if (prevTime) maxTime = Math.max(maxTime, interval)
            coordHelper2.setText(interval);
            coordHelper3.setText(minTime);
            coordHelper4.setText(maxTime);
            prevTime = time;

            this.onFrame();

            this.requestFrameID = requestAnimationFrame(changing);
        };
        this.requestFrameID = requestAnimationFrame(changing);
    };
    stop = () => {

        this.requestFrameID && cancelAnimationFrame(this.requestFrameID);
        this.requestFrameID = null;
    };

    onFrame = () => {

        const newCameraFrameData = this.cameraService.receiveImageDataData();

        this.update(newCameraFrameData);
    };

    update = (imageDataData?: Uint8ClampedArray | null): PatternVideoService => {
        let newFrameData: Uint8ClampedArray;
        if (this.changeFunctionId) {
            const state = this.patternService.storeService.getState();

            const cfState = state.changeFunctions.functions[this.changeFunctionId];

            if (cfState) {
                // const cfType = cfState.type;
                // const cfParams = cfState.params;

                // const f = this.changeFunction[cfType];
                // newFrameData = f(imageDataData, cfParams);
                newFrameData = this.defaultChangeFunction(imageDataData);
            } else {
                newFrameData = this.defaultChangeFunction(imageDataData);
            }
        } else {

            newFrameData = this.defaultChangeFunction(imageDataData);
        }

        // imageDataDebug.setImageData(new ImageData(newFrameData, this.width, this.height));

        newFrameData && this.patternService.canvasService.context.putImageData(new ImageData(newFrameData, this.width, this.height), 0, 0);
        this.patternService.valuesService.update();

        return this;
    }

    setStackType = (type: StackType): PatternVideoService => {
        this.stackType = type;
        if (this.isOn && this.isPause) {
            this.update();
        }
        return this;
    }

    setEdgeMode = (mode: EdgeMode): PatternVideoService => {
        this.edgeMode = mode;
        if (this.isOn && this.isPause) {
            this.update();
        }
        return this;
    }

    setSlitMode = (slitMode: SlitMode): PatternVideoService => {
        this.slitMode = slitMode;

        if (this.isOn && this.isPause) {
            this.update();
        }
        return this;
    };


    setMirrorMode = (mirrorMode: MirrorMode): PatternVideoService => {
        this.mirrorMode = mirrorMode;
        this.mirrorH = mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.HORIZONTAL;
        this.mirrorV = mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.VERTICAL;

        if (this.isOn && this.isPause) {
            this.update();
        }
        return this;
    };

    setDepth = (depth: number): PatternVideoService => {
        this.depth = Math.ceil(depth * this.width);

        // this.wasmVideoModule.setDepth?.(this.depth);

        if (this.isOn && this.isPause) {
            this.update();
        }
        return this;
    }

    setCutOffset = (cutOffset: number): PatternVideoService => {
        this.cutOffset = cutOffset; //??

        if (this.isOn && this.isPause) {
            this.update();
        }
        return this;
    }

    setChangeFunction = (changeFunctionId: string): PatternVideoService => {
        this.changeFunctionId = changeFunctionId;

        if (this.isOn && this.isPause) {
            this.update();
        }
        return this;
    }

    defaultChangeFunction = (imageDataData: Uint8ClampedArray | null) => {
        return this.wasmVideoModule.defaultCutFunction(
            imageDataData,
            this.width,
            this.height,
            SlitModeDirectionMap[this.slitMode],
            this.mirrorH ? 1 : 0,
            this.cutOffset
        );
    };

    // xyChangeFunction = {
    //     [FxyType.Parab]: (imageDataData: Uint8ClampedArray | null, params: ParabParams): Uint8ClampedArray => {
    //         return this.wasmVideoModule.paraboloidCutFunction(
    //             imageDataData,
    //             this.width,
    //             this.height,
    //             SlitModeDirectionMap[this.slitMode],
    //             this.mirrorH ? 1 : 0,
    //             this.cutOffset,
    //             params?.x,
    //             params?.y,
    //             params?.end,
    //             params?.zd,
    //         );
    //     },
    //     [FxyType.Sis2]: (imageDataData: Uint8ClampedArray | null, params: Sis2Params): Uint8ClampedArray => {
    //         return this.wasmVideoModule.sis2CutFunction(
    //             imageDataData,
    //             this.width,
    //             this.height,
    //             SlitModeDirectionMap[this.slitMode],
    //             this.mirrorH ? 1 : 0,
    //             this.cutOffset,
    //             params.cosA,
    //             params.h,
    //             params.xN,
    //             params.yN,
    //             params.xD,
    //             params.yD,
    //             params.XA,
    //             params.xdd,
    //             params.ydd,
    //         );
    //     },
    //     [FxyType.Array]: (imageDataData: Uint8ClampedArray | null, arrayParams: FxyArrayParams): Uint8ClampedArray => {
    //         const {type, typeParams} = arrayParams;
    //         const params = typeParams[type];
    //
    //         if (type === FxyArrayType.X) {
    //             return this.wasmVideoModule.arrayXCutFunction(
    //                 imageDataData,
    //                 this.width,
    //                 this.height,
    //                 SlitModeDirectionMap[this.slitMode],
    //                 this.mirrorH ? 1 : 0,
    //                 this.cutOffset,
    //                 params.valuesArray,
    //                 params.from,
    //                 params.to,
    //                 params.drawWidth,
    //                 params.drawHeight,
    //             );
    //         } else {
    //             return this.wasmVideoModule.arrayYCutFunction(
    //                 imageDataData,
    //                 this.width,
    //                 this.height,
    //                 SlitModeDirectionMap[this.slitMode],
    //                 this.mirrorH ? 1 : 0,
    //                 this.cutOffset,
    //                 params.valuesArray,
    //                 params.from,
    //                 params.to,
    //                 params.drawWidth,
    //                 params.drawHeight,
    //             );
    //         }
    //     }
    // };
    //
    // changeFunction = {
    //     [ECFType.FXY]: (imageDataData: Uint8ClampedArray | null, params: FxyParams) => {
    //         const cfSubType = params.type;
    //         const cfSubTypeParams = params.typeParams[cfSubType];
    //
    //         return this.xyChangeFunction[cfSubType](imageDataData, cfSubTypeParams as any);
    //     },
    //     [ECFType.DEPTH]: (imageDataData: Uint8ClampedArray | null, params: CfDepthParams) => {
    //         const item1 = params.items[0];
    //         const item2 = params.items[1];
    //         const item3 = params.items[2];
    //         const item4 = params.items[3];
    //         const depth1ImageData = patternsService.pattern[item1?.patternId]?.canvasService.getImageData();
    //         const depth2ImageData = patternsService.pattern[item2?.patternId]?.canvasService.getImageData();
    //         const depth3ImageData = patternsService.pattern[item3?.patternId]?.canvasService.getImageData();
    //         const depth4ImageData = patternsService.pattern[item4?.patternId]?.canvasService.getImageData();
    //         return this.wasmVideoModule.channelsCutFunction(
    //             imageDataData,
    //             this.width,
    //             this.height,
    //             SlitModeDirectionMap[this.slitMode],
    //             this.mirrorH ? 1 : 0,
    //             this.cutOffset,
    //             depth1ImageData?.data,
    //             depth1ImageData?.width,
    //             depth1ImageData?.height,
    //             item1?.zed,
    //             item1?.zd,
    //             item1?.component,
    //             depth2ImageData?.data,
    //             depth2ImageData?.width,
    //             depth2ImageData?.height,
    //             item2?.zed,
    //             item2?.zd,
    //             item2?.component,
    //             depth3ImageData?.data,
    //             depth3ImageData?.width,
    //             depth3ImageData?.height,
    //             item3?.zed,
    //             item3?.zd,
    //             item3?.component,
    //             depth4ImageData?.data,
    //             depth4ImageData?.width,
    //             depth4ImageData?.height,
    //             item4?.zed,
    //             item4?.zd,
    //             item4?.component,
    //         );
    //     }
    // };
}

import { PatternService } from '../../PatternService'
import { CameraService, CameraServiceInitParams } from 'bbuutoonnss'
import { EdgeMode, MirrorMode, ShaderVideoModule, CameraAxis, StackType } from './ShaderVideoModule'
import { FxyParams } from '../../../../changeFunctions/functions/fxy'
import { getFxyFunctionType } from './utils'
import { setStackSize } from '../../../video/actions'
import { VideoOffset } from './ShaderVideoModule/types'
import { ECFType } from '../../../../changeFunctions/types'
import { CfDepthParams } from '../../../../changeFunctions/functions/depth'
import * as StackBlur from 'stackblur-canvas';

export const CameraAxisDirectionMap = {
    [CameraAxis.T]: 0,
    [CameraAxis.Y]: 1,
    [CameraAxis.X]: 2,
}

export const EdgeModeASMap = {
    [EdgeMode.NO]: 0,
    [EdgeMode.TOP]: 1,
    [EdgeMode.BOT]: 2,
    [EdgeMode.ALL]: 3,
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
    stackSize: number,
    offset: VideoOffset

    edgeMode: EdgeMode,
    cameraAxis: CameraAxis,
    stackType: StackType,
    mirrorMode: MirrorMode
}

export interface FrameSource {

}

export class PatternVideoService {
    patternService: PatternService

    // isCameraOn: boolean = false
    // isUpdatingOn: boolean = false

    // isOn: boolean = false
    // isPause: boolean = false

    width: number
    height: number
    stackSize: number
    stackType: StackType = StackType.Right
    edgeMode: EdgeMode = EdgeMode.ALL
    cameraAxis: CameraAxis = CameraAxis.T
    mirrorMode: MirrorMode = MirrorMode.NO

    offset: VideoOffset


    cutOffset: number
    depth: number

    changeFunctionId: string

    source: FrameSource
    device: MediaDeviceInfo
    cameraService: CameraService = new CameraService()

    requestFrameID: number

    shaderVideoModule: ShaderVideoModule

    constructor(patternService: PatternService) {
        this.patternService = patternService


        this.shaderVideoModule = new ShaderVideoModule()

    }

    initCamera(params: CameraServiceInitParams): PatternVideoService {
        this.cameraService.init(params)
        return this
    }

    async startCamera() {
        await this.cameraService.start()
        console.log('getCapabilities', this.cameraService.stream.getVideoTracks()[0]?.getCapabilities())

        return this
    }

    stopCamera() {
        this.cameraService.stop()
        return this
    }

    setDevice = async (device: MediaDeviceInfo): Promise<PatternVideoService> => {
        this.device = device

        await this.cameraService.setDevice(device)

        return this
    }


    async init(params: VideoServiceInitParams): Promise<PatternVideoService> {

        this.width = params.width
        this.height = params.height
        this.stackSize = params.stackSize

        this.edgeMode = params.edgeMode
        this.cameraAxis = params.cameraAxis
        this.stackType = params.stackType
        this.mirrorMode = params.mirrorMode
        this.offset = params.offset;

        (
            await this.shaderVideoModule.instantiate()
        ).init(
            params,
        )

        return this

    }

    prevTime = 0
    minTime = 1000
    maxTime = 0
    times = new Array(50)
    start = () => {

        this.requestFrameID = requestAnimationFrame(this.frameHandler)
    }
    stop = () => {

        this.requestFrameID && cancelAnimationFrame(this.requestFrameID)
        this.requestFrameID = null
    }

    frameHandler = (time) => {

        // coordHelper5.setText('CHANG', time);
        // DRAW SPEED
        const interval = time - this.prevTime
        this.times.push(interval)
        this.times.shift()

        this.minTime = Math.min(this.minTime, interval)

        if (this.prevTime) this.maxTime = Math.max(this.maxTime, interval)
        // coordHelper2.setText(interval)
        // coordHelper3.setText(this.minTime)
        // coordHelper4.setText(this.maxTime)
        this.prevTime = time

        this.onFrame()

        this.requestFrameID = requestAnimationFrame(this.frameHandler)
    }

    onFrame = () => {

        const newCameraFrameData = this.cameraService.receiveImageData()?.data

        if (newCameraFrameData) {
            this.shaderVideoModule.pushNewFrame(newCameraFrameData)
        }
        const state = this.patternService.storeService.getState()

        if (this.changeFunctionId) {

            const changeFunctionState = state.changeFunctions.functions[this.changeFunctionId]

            if (changeFunctionState.type === ECFType.FXY) {
                const changeFunctionParams = changeFunctionState.params as FxyParams
                const changeFunctionTypeParams = changeFunctionParams.typeParams[changeFunctionParams.type]

                this.shaderVideoModule.updateFuncParams(changeFunctionParams.type, changeFunctionTypeParams, state)
            }
            if (changeFunctionState.type === ECFType.DEPTH) {
                const changeFunctionParams = changeFunctionState.params as CfDepthParams

                this.shaderVideoModule.updateFuncParams(changeFunctionState.type, changeFunctionParams, state)
            }

        }

        const patternVideoOffset = state.patterns[this.patternService.patternId].video.params.offset
        this.shaderVideoModule.updateOffsets(patternVideoOffset)

        const newFrameCanvas: HTMLCanvasElement = this.shaderVideoModule.updateImage()


       

        newFrameCanvas && this.patternService.canvasService.context.drawImage(newFrameCanvas, 0, 0) // можно заменять сразу все изображение?


        // blur start
        const pattern = this.patternService.storeService.getState().patterns[this.patternService.patternId];
       
        const radius = Math.round(pattern.blur?.value?.radius);
    
        if (radius > 0) {
            this.patternService.canvasService.setImageData(
                StackBlur.imageDataRGBA(
                    this.patternService.canvasService.getImageData(),
                    0, 0, 
                    this.width, this.height, radius
                )
            )
        }
        // blur eend

        this.patternService.valuesService.update()
    }

    setStackType = (type: StackType): PatternVideoService => {
        this.stackType = type
        this.shaderVideoModule.updateStackType(type)

        return this
    }

    setEdgeMode = (mode: EdgeMode): PatternVideoService => {
        this.edgeMode = mode
        this.shaderVideoModule.updateEdgeMode(mode)

        return this
    }

    setCameraAxis = (cameraAxis: CameraAxis): PatternVideoService => {
        this.cameraAxis = cameraAxis
        this.shaderVideoModule.updateCameraAxis(cameraAxis)

        return this
    }


    setMirrorMode = (mirrorMode: MirrorMode): PatternVideoService => {
        this.mirrorMode = mirrorMode
        this.shaderVideoModule.updateMirror(
            mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.HORIZONTAL,
            mirrorMode === MirrorMode.BOTH || mirrorMode === MirrorMode.VERTICAL,
        )

        return this
    }

    setStackSize = (value: number): PatternVideoService => {
        this.stackSize = value
        this.shaderVideoModule.updateStackSize(this.stackSize)

        return this
    }

    setChangeFunction = (changeFunctionId: string): PatternVideoService => {
        this.changeFunctionId = changeFunctionId

        this.shaderVideoModule.updateCutFunctionType(
            getFxyFunctionType(this.changeFunctionId, this.patternService.storeService.getState()),
        )

        return this
    }

    setOffset = (param: string, value: any): PatternVideoService => {
        this.offset = { ...this.offset, [param]: value }

        this.shaderVideoModule.updateOffset(param, value)

        return this
    }
}

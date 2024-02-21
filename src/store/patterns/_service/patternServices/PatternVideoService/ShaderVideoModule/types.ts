import { FxyArrayParams, FxyType, ParabParams, Sis2Params, AnyFxyParams } from '../../../../../changeFunctions/functions/fxy'

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

export enum CameraAxis {
    T = 't',
    Y = 'y',
    X = 'x',
}

export enum StackType {
    Right = '>',
    Left = '<',
    FromCenter = '<>',
    ToCenter = '><',
}



export interface ShaderModuleParams {
    width: number
    height: number
    stackSize: number
    stackType: StackType
    offset: VideoOffset
    edgeMode: EdgeMode
    slitMode: CameraAxis

    cutFunction: FxyType
    cutFuncParams: AnyFxyParams
}
export interface VideoOffset {
    x0: number
    y0: number
    z0: number
    x1: number
    y1: number
    z1: number
}
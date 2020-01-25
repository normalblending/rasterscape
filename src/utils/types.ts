import {Action} from "redux";

export interface EventData {
    value: any,
    name?: string,
    e?: any
}

export interface ImageAction extends Action {
    imageData: ImageData
}

export interface WidthAction extends Action {
    width: number
}

export interface HeightAction extends Action {
    height: number
}


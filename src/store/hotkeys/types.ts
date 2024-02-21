import {LabelFormatter} from "./label-formatters";

export enum HotkeyControlType {
    Button = 'button',
    Number = 'number',
    Cycled = 'cycled',
}

export interface HotkeyKeyValue {
    key: string
    code: string
    onRelease: boolean
}

export interface ButtonHotkeyValue {
    path: string
    maxKeysCount: number

    label: string
    labelFormatter?: LabelFormatter
    labelData: any[]

    controlType: HotkeyControlType

    keys: HotkeyKeyValue[]
}

export interface ButtonsHotkeys {
    [path: string]: ButtonHotkeyValue
}

export interface HotkeysState {
    buttons: ButtonsHotkeys,
    setting: boolean
    highlightedPath: string
    highlightedIndex: number
    autofocus: boolean
    autoblur: boolean
}
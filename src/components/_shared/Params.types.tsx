export interface ParamConfig {
    type: EParamType
    props?: any
    name: string
}

export enum EParamType {
    Boolean = "boolean",
    Number = "number",
    Select = "select",
    ImageData = "imageData",
}
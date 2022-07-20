import { CameraAxis } from './types'
import { ECFType } from '../../../../../changeFunctions/types'
import { FxyArrayType, FxyType } from '../../../../../changeFunctions/functions/fxy'

export const CameraAxisToNumber = {
    [CameraAxis.T]: 1,
    [CameraAxis.X]: 2,
    [CameraAxis.Y]: 3,
}

export const XYCutFunctionTypeToNumber = {
    [FxyType.Parab]:1,
    [FxyType.Sis2]: 2,
    [FxyType.Array]: 3,
    [ECFType.DEPTH]: 4,
}
export const XYArrayCutFunctionTypeToNumber = {
    [FxyArrayType.X]:1,
    [FxyArrayType.Y]: 2,
}
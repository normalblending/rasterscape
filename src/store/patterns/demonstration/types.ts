// DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION DEMONSTRATION

import {FunctionState} from "../../../utils/patterns/function";

export enum DemonstrationMode {
    fill = 'fill',
    contain = 'contain',
    cover = 'cover',
}

export interface DemonstrationParams {
    mode?: DemonstrationMode
}

export interface DemonstrationValue {
    enabled: boolean
}

export type DemonstrationState = FunctionState<DemonstrationValue, DemonstrationParams>;
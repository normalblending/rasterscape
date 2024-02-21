import * as React from "react";

export interface RepeatsControlsSubComponentProps {
    patternId: string
}

export type SecondaryComponentType = React.ComponentType<RepeatsControlsSubComponentProps>;
export type PrimaryComponentType = React.ComponentType<RepeatsControlsSubComponentProps>;
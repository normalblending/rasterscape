import React from "react";
import {ChangeFunctionState} from "../../../../../store/changeFunctions/types";
import {WithTranslation} from "react-i18next";

export interface FxyArrayTypeComponentProps<TFxyArrayParams> {
    params: TFxyArrayParams
    functionParams: ChangeFunctionState
    onChange: (params: TFxyArrayParams, functionParams: ChangeFunctionState) => void
}

export type FxyArrayTypeComponentPropsWithTranslation<TFxyArrayParams> = FxyArrayTypeComponentProps<TFxyArrayParams> & WithTranslation

export type FxyArrayTypeComponentType<TFxyArrayParams> = React.ComponentType<FxyArrayTypeComponentProps<TFxyArrayParams>>;

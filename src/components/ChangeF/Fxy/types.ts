import {ChangeFunctionState} from "../../../store/changeFunctions/types";
import {WithTranslation} from "react-i18next";
import React from "react";

export interface FxyTypeComponentProps<TFxyParams> {
    params: TFxyParams
    name: string
    functionParams: ChangeFunctionState
    onChange(params: TFxyParams, name?: string)
}

export type FxyTypeComponentPropsWithTranslation<TFxyParams> = FxyTypeComponentProps<TFxyParams> & WithTranslation

export type FxyTypeComponentType<TFxyParams> = React.ComponentType<FxyTypeComponentProps<TFxyParams>>;

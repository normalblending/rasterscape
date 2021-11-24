import React from "react";
import {ChangeFunctionState} from "../../../../../../store/changeFunctions/types";
import {WithTranslation} from "react-i18next";

export interface DrawTypeComponentProps<TDrawParams> {
    params: TDrawParams
    functionParams: ChangeFunctionState
    onChange: (params: TDrawParams, functionParams: ChangeFunctionState) => void
}

export type DrawTypeComponentPropsWithTranslation<TDrawParams> = DrawTypeComponentProps<TDrawParams> & WithTranslation

export type DrawTypeComponentType<TDrawParams> = React.ComponentType<DrawTypeComponentProps<TDrawParams>>;

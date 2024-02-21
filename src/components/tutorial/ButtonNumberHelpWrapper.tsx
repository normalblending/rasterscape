import * as React from "react";
import {HelpTooltip, HelpTooltipOwnProps} from "./HelpTooltip";

export interface ButtonNumberHelpWrapperProps {
    button: React.ReactNode
}

export const buttonNumberHelpWrapper = (helpTTooltipProps: HelpTooltipOwnProps): React.FC<ButtonNumberHelpWrapperProps> => ({button}) => {

    return (
        <HelpTooltip {...helpTTooltipProps}>{button}</HelpTooltip>
    );
};
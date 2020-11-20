import * as React from "react";
import {MessageComponentType} from "./helpers";
import {BaseMessage} from "./BaseMessage";

export const LinkMessage: MessageComponentType = (props) => {
    const {unreaded, data} = props;
    const {text, link} = data;
    return (
        <BaseMessage unreaded={unreaded}>
            <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
            >
                {text}
            </a>
        </BaseMessage>
    );
};

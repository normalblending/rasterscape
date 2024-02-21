import * as React from "react";
import {MessageComponentType} from "./helpers";
import {BaseMessage} from "./BaseMessage";

export const UCImageSent: MessageComponentType = (props) => {
    const {unreaded, data} = props;
    const {text, link} = data;
    return (
        <BaseMessage unreaded={unreaded}>
            {link ? (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {text}
                </a>
            ) : (
                text
            )}
        </BaseMessage>);
};
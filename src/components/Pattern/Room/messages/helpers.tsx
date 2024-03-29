import {MessageData} from "../../../../store/patterns/room/types";
import {withTranslation, WithTranslation, WithTranslationProps} from "react-i18next";
import * as React from "react";
import {BaseMessage} from "./BaseMessage";

export interface MessageOwnProps {
    data: MessageData
    unreaded: boolean
}

export interface MessageProps extends MessageOwnProps, WithTranslation {
}

export type MessageComponentType = React.ComponentType<Omit<MessageProps, keyof WithTranslation> & WithTranslationProps>;


export const withT = (component: React.ComponentType<MessageProps>): React.ComponentType<Omit<MessageProps, keyof WithTranslation> & WithTranslationProps> => withTranslation('chat')<MessageComponentType>(component);

export const translatedMessageWithClass = (className) => {
    return withT(({data, unreaded, t}) => {
        const {translate} = data;
        return (
            <BaseMessage
                className={className}
                unreaded={unreaded}>
                {t(translate.key, translate.data)}
            </BaseMessage>
        )
    })
};
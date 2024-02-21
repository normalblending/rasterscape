import {MessageData, MessageType, RoomParams, RoomValue} from "./types";
import {getFunctionState} from "../../../utils/patterns/function";

export const getRoomState = getFunctionState<RoomValue, RoomParams>(
    {}, {
        value: null
    });

export const isMeDrawer = (roomValue: RoomValue) => {
    return !roomValue?.connected || roomValue?.meDrawer;
};

export const SIGN_LEFT = '>';

export const parseMessage = (message: string) => {
    const leftIndex = message.indexOf('>');

    const left = leftIndex !== -1
        ? message.slice(0, leftIndex).trim()
        : '';

    const right = leftIndex !== -1
        ? message.slice(leftIndex + 1)
        : message;

    const leftParts = left.replace(/ +(?= )/g,'').trim().split(' ');

    let leftPersistent = leftParts[0];
    leftPersistent = (leftPersistent ? (leftPersistent + ' ') : '') + '>';

    return {
        left,
        right,
        leftParts,
        leftPersistent
    }
};

export enum SpecialSigns {
    Left = '>',
    Empty = 'empty',
    Default = 'default',
}

export const SignRules = {
    [SpecialSigns.Left]: {
        value: text => text,
    },
    [SpecialSigns.Empty]: {
        value: text => text,
    },
    [SpecialSigns.Default]: {
        value: (text, sign?, options?) => (sign ? (sign+ ' ') : '') + text,
    }
};

export const getSignedMessage = (text: string, leftSide?: string, options?) => {

    const sign = leftSide[0];

    return (SignRules[sign] || SignRules[SpecialSigns.Default])
        .value(text, sign, options)
};

export const messageFilterByType: Record<string, (newMessage: MessageData, oldMessage: MessageData) => boolean> = {
    [MessageType.Help]: (newMessage, oldMessage) => newMessage.type === oldMessage.type,
    [MessageType.ChannelPublicData]: (newMessage, oldMessage) => (
        newMessage.type === oldMessage.type
        && (newMessage.channelPublicData?.channelSign === oldMessage.channelPublicData?.channelSign)
    ),
    [MessageType.ChannelData]: (newMessage, oldMessage) => (
        newMessage.type === oldMessage.type
        && (newMessage.channelData?.channelSign === oldMessage.channelData?.channelSign)
    ),
    [MessageType.ChannelScoresTable]: (newMessage, oldMessage) => newMessage.type === oldMessage.type,
    [MessageType.SignScoresTable]: (newMessage, oldMessage) => newMessage.type === oldMessage.type,
};
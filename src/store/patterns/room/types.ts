import {FunctionState} from "../../../utils/patterns/function";

export interface RoomParams {
}

export enum MessageType {
    Help = 'HELP',
    _StringDefault = 'STRING_DEFAULT',
    UserMessage = "USER_MESSAGE",
    UserMessageError = "USER_MESSAGE_EROR",

    Link = "LINK",

    AccessDenied = "ACCESS_DENIED",
    CommandSuccess = "COMMAND_SUCCESS",
    CommandError = "COMMAND_ERROR",

    SignScoresTable = "SIGN_SCORES_TABLE",
    ChannelScoresTable = "CHANNEL_SCORES_TABLE",
    ChannelData = "CHANNEL_DATA",
    ChannelPublicData = "CHANNEL_PUBLIC_DATA",
    ImageSent = 'IMAGE_SENT',

    UCImageSent = 'UC_IMAGE_SENT',
    UCAccessDenied = 'UC_ACCESS_DENIED'
}

export type Scores = {
    score
    sign
    rank
}[];

export interface UserChannelData {
    chatId: string
    owner: string
    caption: string
    anon: string
    link: string
    message: string
    isPrivate: string
    channelSign: string
    members: string[]
    description: string
    score: string
    rank: string
}

export interface UserChannelPublicData {
    owner: string
    isPrivate: string
    members?: string[]
    channelSign: string
    description: string
    isMeMember: boolean
    isMeAdmin: boolean
    score: string
    rank: string
}

export type ChatHelp = {
    aliases: string[]
    paramKeys?: string[]
    slashParam?: string
    slashParams?: string[]
    translationKey: string
}[];


export interface MessageData {
    sign?: string

    type?: MessageType
    text?: string

    scores?: Scores
    channelData?: UserChannelData
    channelPublicData?: UserChannelPublicData
    link?: string

    helpData?: ChatHelp

    translate?: {
        key: string
        data?: object
    }
}

export interface Message {
    data: MessageData
    unreaded?: boolean
}

export interface RoomValue {
    connected?: string
    messages?: Message[]
    drawer?: string
    meDrawer?: boolean
    persistMeDrawer?: boolean
    members?: number
    unreaded?: boolean
    persistentMessagePart?: string
}

export type RoomState = FunctionState<RoomValue, RoomParams>;
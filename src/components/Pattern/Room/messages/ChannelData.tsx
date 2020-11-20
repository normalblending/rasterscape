import * as React from "react";
import {MessageComponentType, withT} from "./helpers";

export const ChannelData: MessageComponentType = withT((props) => {
    const {unreaded, data, t} = props;
    const {
        chatId,
        owner,
        caption,
        anon,
        channelSign,
        link,
        message,
        isPrivate,
        members,
        score,
        rank,
        description
    } = data.channelData;
    return (
        <div
            className={'channelData-container'}
        >
            <div className={'channelData'}>
                <div className={'channelData-sign'}>
                    <div className={'private public'}>{t('channel.data.admin')}</div>
                    <div className={'sign'}>{channelSign}</div>
                </div>
                <div className={'channelData-values-table'}>
                    {/*<div>*/}
                    {/*    <div>admin</div>*/}
                    {/*    <div className={'long'}><span>{owner}</span></div>*/}
                    {/*</div>*/}
                    <div>
                        <div>{t('channel.data.private')}</div>
                        <div className={'long'}><span>{isPrivate ? '+' : '-'}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.anon')}</div>
                        <div className={'long'}><span>{anon ? '+' : '-'}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.caption')}</div>
                        <div className={'long'}><span>{caption ? '+' : '-'}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.chatId')}</div>
                        <div className={'long'}><span>{chatId}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.description')}</div>
                        <div><span>{description}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.message')}</div>
                        <div className={'long'}><span>{message}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.link')}</div>
                        <div className={'long'}><span>{link}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.members')}</div>
                        <div className={'tall'}><span>{(members || []).join(', ')}</span></div>
                    </div>
                    <div>
                        <div>{t('channel.data.score')}</div>
                        <div className={'long'}><span>{rank}/{score}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
});

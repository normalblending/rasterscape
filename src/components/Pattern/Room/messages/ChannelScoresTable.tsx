import * as React from "react";
import {MessageComponentType, withT} from "./helpers";
import './scores.scss';

export const ChannelScoresTable: MessageComponentType = withT((props) => {
    const {unreaded, data, t} = props;

    return (
        <div
            className={'sign-scores-container'}
        >
            <div
                className={'sign-scores'}
            >
                <div
                    className={'scores-header'}
                >
                    {t('channel.scores.channels')}
                </div>
                <div className={'scores-table'}>
                    {data.scores.map(({sign, score, rank}, i) => {
                        return (
                            <div className={'scores-table-row'}>
                                <div className={'rank'}>
                                    {rank}
                                </div>
                                <div className={'score'}>
                                    {score}
                                </div>
                                <div className={'sign'}>
                                    {sign}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});


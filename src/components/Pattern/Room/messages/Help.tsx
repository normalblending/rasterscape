import * as React from "react";
import {MessageComponentType, withT} from "./helpers";
import './help.scss';

export const Help: MessageComponentType = withT((props) => {
    const {data, t} = props;

    return (
        <div
            className={'help'}
        >
            <div className={'help-table'}>
                {data.helpData.map(({aliases, paramKeys, translationKey, slashParam, slashParams}, i) => {
                    const [firstAlias, ...rest] = aliases;

                    return (
                        <div className={'item'}>
                            <div className={'command'}>
                                {firstAlias}{slashParam ? `/[${t('help.' + slashParam)}]` : ''} {paramKeys?.map(paramKey => `[${t('help.' + paramKey)}]`).join(' ')}
                            </div>
                            <div className={'description'}>
                                {t('help.' + translationKey)}{rest.length > 0 && ` (${rest.join(', ')})`}
                                <div>
                                    {slashParams?.map(slashParam => (
                                        <>
                                        <span>{slashParam}</span> - {t('help.' + slashParam)}<br/>
                                        </>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});


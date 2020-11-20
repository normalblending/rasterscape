import * as React from "react";
import * as cn from 'classnames';
import './globalHotkeys.scss'
import {WithTranslation, withTranslation} from "react-i18next";

const CMD_KEY = navigator.userAgent.indexOf('Mac OS X') !== -1
    ? '⌘'
    : 'ctrl'

export interface GlobalHotkeysProps extends WithTranslation{

}

const Key: React.FC<{
    big?: boolean
    one?: boolean
    digits?: boolean
    value: string
}> = ({big, digits, one, value}) => (
    <input
        disabled
        className={cn({
            'one-key': one,
            'big-key': big,
            'digits': digits,
        })}
        value={value}
    />
);

const Plus = () => (
    <div className={'separator'}>+</div>
);

const Item: React.FC<{
    children?: any
    desc: string
}> = ({desc, children}) => (
    <div className={'global-hotkeys-item'}>
        <div className={'global-hotkeys-item_buttons'}>
            {children}
        </div>
        <div className={'global-hotkeys-item_description'}>
            {desc}
        </div>
    </div>
);

const GlobalHotkeysComponent: React.FC<GlobalHotkeysProps> = (props) => {

    const {t} = props;

    return (
        <div className={'global-hotkeys'}>

            <Item desc={t('globalHotkeys.patternSelect')}>
                <Key digits value={'1..9'} />
            </Item>

            <Item desc={t('globalHotkeys.patternGoTo')}>
                <Key big value={CMD_KEY} /><Plus/><Key digits value={'1..9'} />
            </Item>

            <Item desc={t('globalHotkeys.fullscreen')}>
                <Key big value={CMD_KEY} /><Plus/><Key one value={'f'}/>
            </Item>

            <Item desc={t('globalHotkeys.hotkeys')}>
                <Key big value={CMD_KEY} /><Plus/><Key one value={'k'}/>
            </Item>


            <Item desc={t('globalHotkeys.patternWindow')}>
                <Key big value={CMD_KEY} /><Plus/><Key one value={'w'}/>
            </Item>
            <Item desc={t('globalHotkeys.selectAll')}>
                <Key big value={CMD_KEY} /><Plus/><Key one value={'a'}/>
            </Item>
            <Item desc={t('globalHotkeys.selectClear')}>
                <Key big value={CMD_KEY} /><Plus/><Key one value={'d'}/>
            </Item>
            {/*<Item*/}
            {/*    desc={'новый паттерн'}*/}
            {/*>*/}
            {/*    <Key big value={CMD_KEY} />*/}
            {/*    <Plus/>*/}
            {/*    <Key value={'n'}/>*/}
            {/*</Item>*/}
        </div>
    );
};

export const GlobalHotkeys = withTranslation('common')(GlobalHotkeysComponent);
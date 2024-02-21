import * as React from "react";
import {ButtonHK} from "../../_shared/buttons/hotkeyed/ButtonHK";
import {ButtonSelect} from "../../_shared/buttons/simple/ButtonSelect";
import {clearHotkeys, setAutoblur, setAutofocus} from "../../../store/hotkeys/actions";

import {GlobalHotkeysInfo} from "./GlobalHotkeysInfo";
import {WithTranslation, withTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getAutoFocusBlur, getHotkeysState} from "../../../store/hotkeys/selectors";
import {ButtonHotkeyListItem} from "./ButtonHotkeyListItem";
import {KeyTrigger} from "../simple/KeyTrigger";

export interface HotkeysPanelProps extends WithTranslation {
    onClose()
}

export const HotkeysPanel = withTranslation("common")((props: HotkeysPanelProps) => {

    const {t, onClose} = props;

    const hotkeys = useSelector(getHotkeysState);
    const [autofocus, autoblur] = useSelector(getAutoFocusBlur);

    const dispatch = useDispatch();


    const handleSetAutofocus = React.useCallback((data) => {
        dispatch(setAutofocus(!data.selected));
    }, [dispatch]);

    const handleSetAutoblur = React.useCallback((data) => {
        dispatch(setAutoblur(!data.selected));
    }, [dispatch]);

    const handleClear = React.useCallback((data) => {
        dispatch(clearHotkeys());
    }, [dispatch]);


    return (
        <div className={'hotkeys-list'}>
            <div className={'hotkeys-list-controls'}>
                {!!Object.keys(hotkeys.buttons).length && (
                    <ButtonHK onClick={handleClear}>{t('utils.clear')}</ButtonHK>
                )}
                <ButtonSelect
                    autofocus
                    autoblur={autoblur}
                    selected={autofocus}
                    onClick={handleSetAutofocus}
                >
                    {t('utils.autofocus')}
                </ButtonSelect>
                <ButtonSelect
                    autoblur
                    autofocus={autofocus}
                    selected={autoblur}
                    onClick={handleSetAutoblur}
                >
                    {t('utils.autoblur')}
                </ButtonSelect>
            </div>
            <div className={'hotkeys-list-items'}>
                {!Object.keys(hotkeys.buttons).length && (
                    <div className={'no-user-hotkeys'}>{t('hotkeys.empty')}</div>
                )}
                {Object.keys(hotkeys.buttons).map((path, index) => (
                    <ButtonHotkeyListItem value={hotkeys.buttons[path]}/>
                ))}
            </div>
            <GlobalHotkeysInfo/>
            <KeyTrigger
                keyValue={'Escape'}
                codeValue={'esc'}
                onPress={onClose}
                withInputs
            />
        </div>
    );
});

// export const HotkeysPanel = withTranslation("common")(HotkeysPanel);
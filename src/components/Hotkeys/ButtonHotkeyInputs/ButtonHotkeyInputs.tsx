import * as React from "react";
import "./ButtonHotkeyInputs.scss";
import cn from 'classnames';
import {
    removeHotkey, createHotkey, setHotkeyKey, removeHotkeyKey, highlightHotkey, setHotkeyOnRelease,
} from "store/hotkeys/actions";
import {useDispatch, useSelector} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {HKLabelProps} from "../../_shared/buttons/hotkeyed/types";
import {KeyInput} from "../simple/KeyInput";
import {memo, useCallback, useMemo} from "react";
import {
    createButtonHotkeyValueByPathSelector,
    getHotkeysHighlight, getIsSettingMode
} from "../../../store/hotkeys/selectors";
import {ButtonHotkeyValue, HotkeyControlType} from "../../../store/hotkeys/types";

// keyboardjs.bindKeyCode('KeyA', () => {
//     coordHelper.writeln('--------------------KeyA');
// });

export interface UserHotkeyInputProps extends HKLabelProps, WithTranslation {
    type: HotkeyControlType;
    maxKeysCount?: number
    path: string;

    onBlur?(value: string, hotkey: ButtonHotkeyValue)

    onFocus?(value: string, hotkey: ButtonHotkeyValue)


    onMouseEnter?(e)

    onMouseMove?(e)

    onMouseLeave?(e)
    autofocus?: boolean
    autoblur?: boolean

}

export interface UserHotkeyInputState {
    value: string[]
}

export const ButtonHotkeyInputsComponent: React.FC<UserHotkeyInputProps> = memo((props) => {

    const {
        path, type, maxKeysCount,
        hkData0, hkData1, hkData2, hkData3, hkLabelFormatter, hkLabel,
        onFocus, onBlur,
        autoblur, autofocus,
    } = props;

    const inputElementsCounter = useMemo(() => new Array(maxKeysCount || 3).fill(0), [maxKeysCount]);

    const selectHotkey = useMemo(() => createButtonHotkeyValueByPathSelector(path), [path]);

    const [highlightedPath, highlightedIndex] = useSelector(getHotkeysHighlight);
    const hotkey: ButtonHotkeyValue = useSelector(selectHotkey);
    const isSettingMode = useSelector(getIsSettingMode)

    const dispatch = useDispatch();

    const handleAdd = useCallback((_, key: string, code: string) => {
        dispatch(createHotkey(path, {
            maxKeysCount,
            key,
            code,
            controlType: type,
            label: hkLabel || path,
            labelFormatter: hkLabelFormatter,
            labelData: [hkData0, hkData1, hkData2, hkData3],
        }))
    }, [path, type, maxKeysCount, hkData0, hkData1, hkData2, hkData3, hkLabelFormatter, hkLabel]);

    const handleChange = useCallback((index: number, key: string, code: string) => {
        dispatch(setHotkeyKey(path, index, key, code))
    }, [path]);

    const handleIsOnReleaseChange = useCallback((index: number, isOnRelease: boolean) => {
        dispatch(setHotkeyOnRelease(path, index, isOnRelease));
    }, [path]);

    const handleFocus = useCallback((e, index, value) => {
        dispatch(highlightHotkey(path, index));

        onFocus?.(value, hotkey);
    }, [path, onFocus, hotkey]);

    const handleBlur = useCallback((e, index, value) => {


        dispatch(highlightHotkey(null, null));


        if (!value) {
            dispatch(removeHotkeyKey(path, index));
        }
        if (hotkey && hotkey.keys.every(({key}) => !key)) {

            dispatch(removeHotkey(path));
        }

        onBlur?.(value, hotkey);
    }, [handleChange, onBlur, path, hotkey]);

    // console.log(highlightedPath, highlightedIndex)
    return isSettingMode ? (
        <div className={"button-hotkey-inputs-container"}>
            {inputElementsCounter.map((_, index) => (index === 0 || hotkey?.keys[index - 1]) && (
                <KeyInput
                    controlType={type}
                    isOnRelease={hotkey?.keys[index]?.onRelease}
                    onIsOnReleaseChange={handleIsOnReleaseChange}
                    key={index}
                    value={hotkey?.keys[index]?.key}
                    name={index}
                    highlighted={highlightedPath === path && highlightedIndex === index}
                    onChange={!hotkey ? handleAdd : handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    autoblur={autoblur}
                    autofocus={autofocus}
                />
            ))}
        </div>
    ) : (
        !!hotkey?.keys.length && <div className={'button-hotkey-keys'}>{hotkey?.keys.map(({key, onRelease}) => <div className={onRelease ? 'button-hotkey-keys_on-release' : null}>{key}</div>)}</div>
    );
});

export const ButtonHotkeyInputs = withTranslation('common')(ButtonHotkeyInputsComponent);

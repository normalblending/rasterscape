import * as React from "react";
import "./ButtonHotkeyKeyInput.scss";
import {
    removeHotkey, setHotkeyKey, removeHotkeyKey, highlightHotkey, setHotkeyOnRelease,
} from "store/hotkeys/actions";
import {useDispatch, useSelector} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {KeyInput} from "../simple/KeyInput";
import {memo, useCallback, useMemo} from "react";
import {
    createButtonHotkeyValueByPathSelector, createHotkeysKeysByPathSelector,
    getHotkeysHighlight
} from "../../../store/hotkeys/selectors";
import {ButtonHotkeyValue, HotkeyControlType, HotkeyKeyValue} from "../../../store/hotkeys/types";

// keyboardjs.bindKeyCode('KeyA', () => {
//     coordHelper.writeln('--------------------KeyA');
// });

export interface ButtonHotkeyKeyInputProps extends WithTranslation {
    path: string;
    index: number;
    value: HotkeyKeyValue;
    controlType: HotkeyControlType

    onBlur?(value: HotkeyKeyValue)

    onFocus?(value: HotkeyKeyValue)


    onMouseEnter?(e)

    onMouseMove?(e)

    onMouseLeave?(e)

    autofocus?: boolean
    autoblur?: boolean

}

export const ButtonHotkeyKeyInputComponent: React.FC<ButtonHotkeyKeyInputProps> = memo((props) => {

    const {
        controlType,
        path, index, value,
        onFocus, onBlur,
        autoblur, autofocus,
    } = props;

    const selectHotkeyKeys = useMemo(() => createHotkeysKeysByPathSelector(path), [path]);

    const [highlightedPath, highlightedIndex] = useSelector(getHotkeysHighlight);
    const keys = useSelector(selectHotkeyKeys);

    const dispatch = useDispatch();

    const handleChange = useCallback((index: number, key: string, code: string) => {
        dispatch(setHotkeyKey(path, index, key, code));
    }, [path]);

    const handleIsOnReleaseChange = useCallback((index: number, isOnRelease: boolean) => {
        dispatch(setHotkeyOnRelease(path, index, isOnRelease));
    }, [path]);

    const handleFocus = useCallback((e, index, value) => {
        dispatch(highlightHotkey(path, index));

        onFocus?.(value);
    }, [path, onFocus, value]);

    const handleBlur = useCallback((e, index) => {

        dispatch(highlightHotkey(null, null));

        if (!value.key) {
            dispatch(removeHotkeyKey(path, index))
        }

        if (keys.every(({key}) => !key)) {

            dispatch(removeHotkey(path));
        }

        onBlur?.(value);
    }, [handleChange, onBlur, path, keys, value]);

    return (
        <KeyInput
            controlType={controlType}
            isOnRelease={value.onRelease}
            onIsOnReleaseChange={handleIsOnReleaseChange}
            value={value.key}
            name={index}
            highlighted={highlightedPath === path && highlightedIndex === index}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoblur={autoblur}
            autofocus={autofocus}
        />
    );
});

export const ButtonHotkeyKeyInput = withTranslation('common')(ButtonHotkeyKeyInputComponent)

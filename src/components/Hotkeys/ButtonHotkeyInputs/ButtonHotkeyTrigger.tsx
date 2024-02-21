import * as React from "react";
import {useSelector} from "react-redux";
import {memo, useMemo, useState} from "react";
import {KeyTrigger} from "../simple/KeyTrigger";
import {
    createButtonHotkeyValueByPathSelector, getIsSettingMode,
} from "store/hotkeys/selectors";
import {ButtonHotkeyValue} from "store/hotkeys/types";


export interface UserHotkeyTriggerProps {
    path?: string

    onPress?(e?: any, hotkey?: ButtonHotkeyValue, data?: any)  // for ButtonNumber

    onRelease?(e?: any, hotkey?: ButtonHotkeyValue, data?: any) // for ButtonNumber

    onEveryPress?(e?: any, hotkey?: ButtonHotkeyValue, data?: any)  // for ButtonNumber

    onEveryRelease?(e?: any, hotkey?: ButtonHotkeyValue, data?: any) // for ButtonNumber

    onTrigger?(e?: any, hotkey?: ButtonHotkeyValue, data?: any, release?: boolean) // for clickable Buttons

    data?: any

    debug?: boolean;
}

export const INPUT_WITH_HOTKEYS_DATA_ATTRIBUTE = 'data-hotkeys';

export const ButtonHotkeyTrigger: React.FC<UserHotkeyTriggerProps> = memo((props) => {

    const {path, onPress, onEveryPress, onEveryRelease, onRelease, onTrigger, data, debug} = props;

    const selectHotkey = useMemo(() => createButtonHotkeyValueByPathSelector(path), [path]);

    const hotkey: ButtonHotkeyValue = useSelector(selectHotkey);

    const isSettingMode = useSelector(getIsSettingMode);

    const [states, setStates] = useState<Record<number, boolean>>({});

    const handlePress = React.useCallback((e, index) => {
        if (Object.values(states).every((val) => !val)) {
            onPress?.(e, hotkey, data);
        }
        onEveryPress?.(e, hotkey, data);
        setStates({
            ...states,
            [index]: true,
        });


        if (hotkey.keys[index] && !hotkey.keys[index].onRelease) {
            onTrigger?.(e, hotkey, data, false);
        }

    }, [onPress, onEveryPress, states, hotkey, data, onTrigger]);

    const handleRelease = React.useCallback((e, index) => {
        const newStates = {
            ...states,
            [index]: false,
        };
        if (Object.values(newStates).every((val) => !val)) {
            onRelease?.(e, hotkey, data)
        }
        onEveryRelease?.(e, hotkey, data);
        setStates(newStates);


        if (hotkey.keys[index] && hotkey.keys[index].onRelease) {
            onTrigger?.(e, hotkey, data, true);
        }

    }, [onRelease, onEveryRelease, states, hotkey, data, onTrigger]);

    return !isSettingMode && (
        <>
            {hotkey.keys.map(({key, code, onRelease}, index) => {
                return key && <KeyTrigger
                    debug={debug}
                    keyValue={key}
                    codeValue={code}
                    name={index}
                    onPress={handlePress}
                    onRelease={handleRelease}
                />
            })}
        </>
    );
});

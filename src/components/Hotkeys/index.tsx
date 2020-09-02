import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import './styles.scss';
import {addHotkey, ButtonsHotkeys, clearHotkeys, settingMode} from "../../store/hotkeys";
import {createSelector} from "reselect";
import {Button} from "bbuutoonnss";
import {ButtonHK} from "../_shared/buttons/ButtonHK";

export type HotkeyItem = {
    path: string
    key: string
};

export interface HotkeysStateProps {
    hotkeys: HotkeyItem[]
}

export interface HotkeysActionProps {
    addHotkey(path: string, value: string)

    settingMode(state: boolean)

    clearHotkeys()
}

export interface HotkeysOwnProps {

}

export interface HotkeysProps extends HotkeysStateProps, HotkeysActionProps, HotkeysOwnProps {

}

const HotkeysComponent: React.FC<HotkeysProps> = (props) => {

    const {
        hotkeys,
        addHotkey,
        settingMode,
        clearHotkeys,
    } = props;

    const [openHotkeys, setOpenHotkeys] = React.useState(false);

    const toggleHotkeys = React.useCallback(() => {
        setOpenHotkeys(!openHotkeys);
        settingMode(!openHotkeys);
    }, [openHotkeys, setOpenHotkeys, settingMode]);

    const deleteHandler = React.useCallback((data) => {
        addHotkey(data.value.path, null);
    }, [hotkeys, addHotkey]);

    return (
        <div className={'hotkeys'}>
            <Button
                className="app-control-button"
                onClick={toggleHotkeys}>hk</Button>
            {openHotkeys && (
                <div className={'hotkeys-list'}>
                    <Button
                        onClick={clearHotkeys}
                    >очистить</Button>
                    {hotkeys.map((hotkey) => {
                        const {path, key} = hotkey;
                        return (
                            <div className={'hotkeys-list-item'}>
                                <div>
                                    <Button
                                        onClick={deleteHandler}
                                        value={hotkey}
                                    >удалить</Button>
                                </div>
                                <div>{path}</div>
                                <div>{key}</div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};


const hotkeysSelector = createSelector(
    [(state: AppState) => state.hotkeys.keys],
    (hotkeys) => Object.keys(hotkeys).reduce((res, path) => {
        res.push({
            path,
            key: hotkeys[path]
        })
        return res;
    }, []));

const mapStateToProps: MapStateToProps<HotkeysStateProps, HotkeysOwnProps, AppState> = state => ({
    hotkeys: hotkeysSelector(state)
});

const mapDispatchToProps: MapDispatchToProps<HotkeysActionProps, HotkeysOwnProps> = {
    addHotkey,
    settingMode,
    clearHotkeys,
};

export const Hotkeys = connect<HotkeysStateProps, HotkeysActionProps, HotkeysOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(HotkeysComponent);
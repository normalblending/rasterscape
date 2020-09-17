import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Key} from "./_shared/Key";
import {redo, undo} from "../store/patterns/history/actions";
import {settingMode} from "../store/hotkeys";
import {setFullScreen} from "../store/fullscreen";
import {toggleDemonstration} from "../store/patterns/demonstration/actions";

export interface PatternsHotkeysStateProps {
    activePatternId: string
    isSettingMode: boolean
    full: boolean
}

export interface PatternsHotkeysActionProps {
    undo: typeof undo
    redo: typeof redo
    settingMode: typeof settingMode
    setFullScreen: typeof setFullScreen
    toggleDemonstration: typeof toggleDemonstration
}

export interface PatternsHotkeysOwnProps {

}

export interface PatternsHotkeysProps extends PatternsHotkeysStateProps, PatternsHotkeysActionProps, PatternsHotkeysOwnProps {

}

const PatternsHotkeysComponent: React.FC<PatternsHotkeysProps> = (props) => {

    const {
        activePatternId,
        undo,
        redo,
        isSettingMode,
        settingMode,
        full,
        setFullScreen,
        toggleDemonstration,
    } = props;

    const handleUndo = React.useCallback((e, keys) => {
        activePatternId && undo(activePatternId);
    }, [activePatternId, undo]);

    const handleRedo = React.useCallback((e, keys) => {
        activePatternId && redo(activePatternId);
    }, [activePatternId, redo]);

    const toggleHotkeys = React.useCallback((e) => {
        e.preventDefault();
        settingMode(!isSettingMode);
    }, [isSettingMode, settingMode]);

    const toggleFullscreen = React.useCallback((e) => {
        e.preventDefault();
        setFullScreen(!full);
    }, [full, setFullScreen]);

    const handleToggleDemonstration = React.useCallback((e) => {
        console.log(111);
        e.preventDefault();
        toggleDemonstration(activePatternId);
    }, [activePatternId, toggleDemonstration]);

    return (
        <>
            <Key
                keys={['command + z', 'ctrl + z']}
                onPress={handleUndo}
            />
            <Key
                keys={['command + x', 'ctrl + x']}
                onPress={handleRedo}
            />
            <Key
                keys={['command + k', 'ctrl + k']}
                onPress={toggleHotkeys}
            />
            <Key
                keys={['command + f', 'ctrl + f']}
                onPress={toggleFullscreen}
            />
            <Key
                // keys={['alt + 5']}
                keys={['command + 5', 'ctrl + 5']}
                onPress={handleToggleDemonstration}
            />
        </>
    );
};

const mapStateToProps: MapStateToProps<PatternsHotkeysStateProps, PatternsHotkeysOwnProps, AppState> = state => ({
    activePatternId: state.activePattern.patternId,
    isSettingMode: state.hotkeys.setting,
    full: state.fullScreen,
});

const mapDispatchToProps: MapDispatchToProps<PatternsHotkeysActionProps, PatternsHotkeysOwnProps> = {
    undo,
    redo,
    settingMode,
    setFullScreen,
    toggleDemonstration,
};

export const PatternsHotkeys = connect<PatternsHotkeysStateProps, PatternsHotkeysActionProps, PatternsHotkeysOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsHotkeysComponent);
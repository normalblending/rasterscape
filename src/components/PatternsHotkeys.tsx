import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Key} from "./_shared/Key";
import {redo, undo} from "../store/patterns/history/actions";
import {settingMode} from "../store/hotkeys";

export interface PatternsHotkeysStateProps {
    activePatternId: string
    isSettingMode: boolean
}

export interface PatternsHotkeysActionProps {
    undo: typeof undo
    redo: typeof redo
    settingMode: typeof settingMode
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
        </>
    );
};

const mapStateToProps: MapStateToProps<PatternsHotkeysStateProps, PatternsHotkeysOwnProps, AppState> = state => ({
    activePatternId: state.activePattern.patternId,
    isSettingMode: state.hotkeys.setting,
});

const mapDispatchToProps: MapDispatchToProps<PatternsHotkeysActionProps, PatternsHotkeysOwnProps> = {
    undo,
    redo,
    settingMode,
};

export const PatternsHotkeys = connect<PatternsHotkeysStateProps, PatternsHotkeysActionProps, PatternsHotkeysOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsHotkeysComponent);
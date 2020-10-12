import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Key} from "./_shared/Key";
import {redo, undo} from "../store/patterns/history/actions";
import {settingMode} from "../store/hotkeys";
import {setFullScreen} from "../store/fullscreen";
import {toggleDemonstration} from "../store/patterns/demonstration/actions";
import {offOptimization, onOptimization} from "../store/optimization";
import {getImageDataFromClipboard} from "../utils/clipboard";
import {load} from "../store/patterns/import/actions";
import {copyPatternToClipboard} from "../store/patterns/pattern/actions";

export interface PatternsHotkeysStateProps {
    activePatternId: string
    isSettingMode: boolean
    full: boolean
    optimization: boolean
}

export interface PatternsHotkeysActionProps {
    undo: typeof undo
    redo: typeof redo
    settingMode: typeof settingMode
    setFullScreen: typeof setFullScreen
    toggleDemonstration: typeof toggleDemonstration
    onOptimization: typeof onOptimization
    offOptimization: typeof offOptimization
    load: typeof load
    copyToClipboard
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

        optimization,
        onOptimization,
        offOptimization,
        load,
        copyToClipboard,
    } = props;

    const receiveImageFromClipboard = React.useCallback((event) => {
        getImageDataFromClipboard(event, (imageData) => {
            activePatternId && load(activePatternId, imageData);
        })
    }, [activePatternId, load])

    React.useEffect(() => {
        document.addEventListener('paste', receiveImageFromClipboard);
        return () => {
            document.removeEventListener('paste', receiveImageFromClipboard);
        };
    }, [activePatternId]);

    const copyImageToClipboard = React.useCallback((e) => {
        if (!window.getSelection().toString()) {
            activePatternId && copyToClipboard(activePatternId);
        }
    }, [activePatternId, copyToClipboard])

    React.useEffect(() => {
        document.addEventListener('copy', copyImageToClipboard);
        return () => {
            document.removeEventListener('copy', copyImageToClipboard);
        };
    }, [activePatternId]);

    const handleUndo = React.useCallback((e, keys) => {
        e.preventDefault();
        activePatternId && undo(activePatternId);
    }, [activePatternId, undo]);

    const handleRedo = React.useCallback((e, keys) => {
        e.preventDefault();
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
        e.preventDefault();
        toggleDemonstration(activePatternId);
    }, [activePatternId, toggleDemonstration]);

    const handleToggleOptimization = React.useCallback((e) => {
        e.preventDefault();
        optimization ? offOptimization() : onOptimization();
    }, [onOptimization, offOptimization, optimization]);

    return (
        <>
            <Key
                keys={['command + z', 'ctrl + z']}
                onPress={handleUndo}
            />
            <Key
                keys={['command + shift + z', 'ctrl + shift + z']}
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
            <Key
                // keys={['alt + 5']}
                keys={['command + o', 'ctrl + o']}
                onPress={handleToggleOptimization}
            />
        </>
    );
};

const mapStateToProps: MapStateToProps<PatternsHotkeysStateProps, PatternsHotkeysOwnProps, AppState> = state => ({
    activePatternId: state.activePattern.patternId,
    isSettingMode: state.hotkeys.setting,
    full: state.fullScreen,
    optimization: state.optimization.on,
});

const mapDispatchToProps: MapDispatchToProps<PatternsHotkeysActionProps, PatternsHotkeysOwnProps> = {
    undo,
    redo,
    settingMode,
    setFullScreen,
    toggleDemonstration,
    onOptimization,
    offOptimization,
    load,
    copyToClipboard: copyPatternToClipboard,
};

export const PatternsHotkeys = connect<PatternsHotkeysStateProps, PatternsHotkeysActionProps, PatternsHotkeysOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsHotkeysComponent);
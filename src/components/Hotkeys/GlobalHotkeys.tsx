import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {Key} from "./Key";
import {redo, undo} from "../../store/patterns/history/actions";
import {settingMode} from "../../store/hotkeys";
import {setFullScreen} from "../../store/fullscreen";
import {toggleDemonstration} from "../../store/patterns/demonstration/actions";
import {offOptimization, onOptimization} from "../../store/optimization";
import {getImageFromClipboard} from "../../utils/clipboard";
import {load, save} from "../../store/patterns/import/actions";
import {copyPatternToClipboard, doublePattern} from "../../store/patterns/pattern/actions";
import {
    clearSelectionIn,
    cutSelectionInToClipboard,
    selectAll,
    updateSelection
} from "../../store/patterns/selection/actions";
import {PatternConfig} from "../../store/patterns/pattern/types";
import {addPattern} from "../../store/patterns/actions";
import {imageToImageData} from "../../utils/canvas/helpers/imageData";

export interface GlobalHotkeysStateProps {
    activePatternId: string
    isSettingMode: boolean
    full: boolean
    optimization: boolean
}

export interface GlobalHotkeysActionProps {
    undo: typeof undo
    redo: typeof redo
    settingMode: typeof settingMode
    setFullScreen: typeof setFullScreen
    toggleDemonstration: typeof toggleDemonstration
    onOptimization: typeof onOptimization
    offOptimization: typeof offOptimization
    cutPatternSelection(id)
    addPattern(config?: PatternConfig)
    cutPatternSelectionToClipboard(id)
    selectAll(id)
    updateSelection: typeof updateSelection
    load: typeof load
    save: typeof save
    doublePattern: (id: string) => void
    copyToClipboard
}

export interface GlobalHotkeysOwnProps {

}

export interface GlobalHotkeysProps extends GlobalHotkeysStateProps, GlobalHotkeysActionProps, GlobalHotkeysOwnProps {

}

const GlobalHotkeysComponent: React.FC<GlobalHotkeysProps> = (props) => {

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
        cutPatternSelection,
        cutPatternSelectionToClipboard,
        updateSelection,
        load,
        save,
        doublePattern,
        addPattern,
        copyToClipboard,
        selectAll,
    } = props;

    const receiveImageFromClipboard = React.useCallback((event) => {
        getImageFromClipboard(event, (image) => {
            if (activePatternId) {
                load(activePatternId, image);
            } else {
                addPattern?.({
                    startImage: imageToImageData(image),
                    history: true,
                    selection: true,
                    repeating: false
                });
            }
        })
    }, [activePatternId, load, addPattern])

    React.useEffect(() => {
        document.addEventListener('paste', receiveImageFromClipboard);
        return () => {
            document.removeEventListener('paste', receiveImageFromClipboard);
        };
    }, [activePatternId]);

    const copyImageToClipboard = React.useCallback((e) => {
        console.log(!window.getSelection().toString());
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

    const cutImageToClipboard = React.useCallback((e) => {
        if (!window.getSelection().toString()) {
            activePatternId && cutPatternSelectionToClipboard(activePatternId);
        }
    }, [activePatternId, cutPatternSelectionToClipboard])

    React.useEffect(() => {
        document.addEventListener('cut', cutImageToClipboard);
        return () => {
            document.removeEventListener('cut', cutImageToClipboard);
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
        try {
            setFullScreen(!full);
        } catch (e) {
            console.error(e);
        }
    }, [full, setFullScreen]);

    const handleToggleDemonstration = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDemonstration(activePatternId);
    }, [activePatternId, toggleDemonstration]);

    const handleToggleOptimization = React.useCallback((e) => {
        e.preventDefault();
        optimization ? offOptimization() : onOptimization();
    }, [onOptimization, offOptimization, optimization]);

    const handleDeleteSelected = React.useCallback((e) => {
        e.preventDefault();
        cutPatternSelection(activePatternId);
    }, [cutPatternSelection, activePatternId]);

    const handleClearSelection = React.useCallback((e) => {
        e.preventDefault();
        updateSelection(activePatternId, [], null);
    }, [updateSelection, activePatternId]);

    const handleSave = React.useCallback((e) => {
        e.preventDefault();
        save(activePatternId);
    }, [save, activePatternId]);

    const handleCopy = React.useCallback((e) => {
        e.preventDefault();
        doublePattern(activePatternId);
    }, [doublePattern, activePatternId]);

    const handleSelectAll = React.useCallback((e) => {
        e.preventDefault();
        activePatternId && selectAll(activePatternId);
    }, [selectAll, activePatternId]);

    const handleScrollToPattern = React.useCallback((e) => {
        e.preventDefault();

        window.location.hash = '#pattern' + e.key;
        // window.scrollTo(0, -100);//document.getElementsByClassName('pattern')[+e.key - 1]?.getBoundingClientRect().left + window.scrollX);
        // console.log(e, document.getElementsByClassName('pattern')[+e.key - 1]?.getBoundingClientRect().left + window.scrollX);


    }, []);

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
                keys={['option + k', 'alt + k']}
                onPress={toggleHotkeys}
            />
            {/*<Key*/}
            {/*    keys={['option + f', 'alt + f']}*/}
            {/*    onPress={toggleFullscreen}*/}
            {/*/>*/}
            <Key
                keys={['option + w', 'alt + w']}
                onPress={handleToggleDemonstration}
            />
            <Key
                // keys={['alt + 5']}
                keys={['option + o', 'alt + o']}
                onPress={handleToggleOptimization}
            />
            <Key
                keys={['backspace', 'del']}
                onPress={handleDeleteSelected}
            />
            <Key
                keys={['option + d', 'alt + d']}
                onPress={handleClearSelection}
            />
            <Key
                keys={['option + a', 'alt + a']}
                onPress={handleSelectAll}
            />
            <Key
                keys={['option + s', 'alt + s']}
                onPress={handleSave}
            />
            <Key
                keys={['option + c', 'alt + c']}
                onPress={handleCopy}
            />
            {/*<Key*/}
            {/*    keys={[*/}
            {/*        ...'123456789'.split('').map(n => 'option + ' + n),*/}
            {/*        ...'123456789'.split('').map(n => 'alt + ' + n),*/}
            {/*    ]}*/}
            {/*    onPress={handleScrollToPattern}*/}
            {/*/>*/}
        </>
    );
};

const mapStateToProps: MapStateToProps<GlobalHotkeysStateProps, GlobalHotkeysOwnProps, AppState> = state => ({
    activePatternId: state.activePattern.patternId,
    isSettingMode: state.hotkeys.setting,
    full: state.fullScreen,
    optimization: state.optimization.on,
});

const mapDispatchToProps: MapDispatchToProps<GlobalHotkeysActionProps, GlobalHotkeysOwnProps> = {
    undo,
    redo,
    settingMode,
    setFullScreen,
    toggleDemonstration,
    onOptimization,
    offOptimization,
    load,
    copyToClipboard: copyPatternToClipboard,
    cutPatternSelection: clearSelectionIn,
    addPattern: addPattern,
    updateSelection: updateSelection,
    cutPatternSelectionToClipboard: cutSelectionInToClipboard,
    selectAll,
    save,
    doublePattern,
};

export const GlobalHotkeys = connect<GlobalHotkeysStateProps, GlobalHotkeysActionProps, GlobalHotkeysOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(GlobalHotkeysComponent);
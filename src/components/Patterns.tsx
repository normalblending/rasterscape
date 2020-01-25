import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Button} from "./_shared/Button";
import {
    addPattern,
    redo,
    removePattern,
    undo,
    updateImage,
    updateSelection,
    setHeight,
    setWidth,
    createRoom,
    editConfig, updateMask, setMaskParams, setRotation, setRepeating, save, load,
    setLoadingParams, createPatternFromSelection, doublePattern,
    cutPatternBySelection
} from "../store/patterns/actions";
import {
    EPatternType,
    LoadingParams,
    MaskParams,
    RepeatingParams,
    RotationValue,
    Segments
} from "../store/patterns/types";
import {Pattern} from "./Pattern/";
import {PatternConfig} from "../store/patterns/types";

export interface PatternsStateProps {
    patterns: any
}

export interface PatternsActionProps {
    addPattern(config?: PatternConfig)

    removePattern(id: string)

    doublePattern(id: string)

    updateImage(id: string, imageData: ImageData)

    updateMask(id: string, imageData: ImageData)

    setMaskParams(id: string, params: MaskParams)

    updateSelection(id: string, value: Segments, bBox: SVGRect)

    redo(id: string)

    undo(id: string)

    setWidth(id: string, value: number)

    setHeight(id: string, value: number)

    editConfig(id: string, config: PatternConfig)

    createRoom(id: string, name: string)

    setRotation(id: string, value: RotationValue)

    setRepeating(id: string, value: RepeatingParams)

    save(id: string)

    load(id: string, image)

    setLoadingParams(id: string, value: LoadingParams)

    createPatternFromSelection(id: string)

    cutPatternBySelection(id: string)
}

export interface PatternsOwnProps {

}

export interface PatternsProps extends PatternsStateProps, PatternsActionProps, PatternsOwnProps {

}

export interface PatternsState {

}

class PatternsComponent extends React.PureComponent<PatternsProps, PatternsState> {

    handleAddClick = () => this.props.addPattern({history: true, selection: true, rotation: true, repeating: false});

    render() {
        const {
            patterns,
            createRoom, removePattern, updateImage, updateMask,
            setMaskParams, updateSelection, undo, redo, setWidth,
            setHeight, editConfig, setRotation, setRepeating,
            save, load, setLoadingParams,
            createPatternFromSelection, doublePattern, cutPatternBySelection
        } = this.props;
        return (
            <>
                {patterns.map(({id, current, mask, config, history, store, selection, connected, resultImage, rotation, repeating, loading}) => {
                    return (
                        <Pattern
                            key={id}
                            id={id}
                            config={config}

                            connected={connected}

                            history={history}
                            store={store}
                            selection={selection}
                            imageValue={current ? current.imageData : null}
                            maskValue={mask ? mask.value.imageData : null}
                            resultImage={resultImage}
                            maskParams={mask ? mask.params : null}
                            rotation={rotation ? rotation.value : null}
                            repeating={repeating ? repeating.params : null}
                            loading={loading ? loading.params : null}

                            width={current ? current.width : null}
                            height={current ? current.height : null}

                            onUndo={undo}
                            onRedo={redo}
                            onImageChange={updateImage}
                            onMaskChange={updateMask}
                            onMaskParamsChange={setMaskParams}
                            onSelectionChange={updateSelection}
                            onRemove={removePattern}
                            onSetWidth={setWidth}
                            onSetHeight={setHeight}
                            onCreateRoom={createRoom}
                            onConfigChange={editConfig}
                            onRotationChange={setRotation}
                            onRepeatingChange={setRepeating}
                            onSave={save}
                            onLoad={load}
                            onLoadingParamsChange={setLoadingParams}
                            onCreatePatternFromSelection={createPatternFromSelection}
                            onDouble={doublePattern}
                            onCutBySelection={cutPatternBySelection}/>
                    );
                })}
                <Button onClick={this.handleAddClick}>add</Button>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<PatternsStateProps, {}, AppState> = state => ({
    patterns: Object.values(state.patterns)
});

const mapDispatchToProps: MapDispatchToProps<PatternsActionProps, PatternsOwnProps> = {
    setMaskParams,
    createRoom,
    addPattern,
    removePattern,
    updateImage,
    updateSelection,
    redo,
    undo,
    setWidth,
    setHeight,
    editConfig,
    updateMask,
    setRotation,
    setRepeating,
    save,
    load,
    setLoadingParams,
    createPatternFromSelection,
    doublePattern,
    cutPatternBySelection
};

export const Patterns = connect<PatternsStateProps, PatternsActionProps, PatternsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsComponent);
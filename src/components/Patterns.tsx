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
    createRoom, editConfig, updateMask, setMaskParams
} from "../store/patterns/actions";
import {EPatternType, MaskParams} from "../store/patterns/types";
import {Pattern} from "./Pattern/";
import {PatternConfig} from "../store/patterns/types";
import {SelectionValue} from "../utils/types";

export interface PatternsStateProps {
    patterns: any
}

export interface PatternsActionProps {
    addPattern(config?: PatternConfig)

    removePattern(id: number)

    updateImage(id: number, imageData: ImageData)

    updateMask(id: number, imageData: ImageData)

    setMaskParams(id: number, params: MaskParams)

    updateSelection(id: number, value: SelectionValue)

    redo(id: number)

    undo(id: number)

    setWidth(id: number, value: number)

    setHeight(id: number, value: number)

    editConfig(id: number, config: PatternConfig)

    createRoom(id: number, name: string)
}

export interface PatternsOwnProps {

}

export interface PatternsProps extends PatternsStateProps, PatternsActionProps, PatternsOwnProps {

}

export interface PatternsState {

}

class PatternsComponent extends React.PureComponent<PatternsProps, PatternsState> {

    handleAddClick = () => this.props.addPattern({history: true, selection: true});

    render() {
        const {createRoom, removePattern, patterns, updateImage, updateMask, setMaskParams, updateSelection, undo, redo, setWidth, setHeight,editConfig } = this.props;
        return (
            <>
                {patterns.map(({id, current, mask, config, history, store, selection, connected, resultImage}) => {
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
                            onConfigChange={editConfig}/>
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
    setMaskParams, createRoom, addPattern, removePattern, updateImage, updateSelection, redo, undo, setWidth, setHeight, editConfig, updateMask
};

export const Patterns = connect<PatternsStateProps, PatternsActionProps, PatternsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsComponent);
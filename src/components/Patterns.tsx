import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Button} from "./_shared/Button";
import {addPattern, redo, removePattern, undo, updateImage, updateSelection, setHeight, setWidth} from "../store/patterns/actions";
import {EPatternType} from "../store/patterns/types";
import {Pattern} from "./Pattern/";
import {PatternConfig} from "../store/patterns/helpers";
import {SelectionValue} from "../utils/types";

export interface PatternsStateProps {
    patterns: any
}

export interface PatternsActionProps {
    addPattern(config?: PatternConfig)

    removePattern(id: number)

    updateImage(id: number, imageData: ImageData)

    updateSelection(id: number, value: SelectionValue)

    redo(id: number)

    undo(id: number)

    setWidth(id: number, value: number)

    setHeight(id: number, value: number)
}

export interface PatternsOwnProps {

}

export interface PatternsProps extends PatternsStateProps, PatternsActionProps, PatternsOwnProps {

}

export interface PatternsState {

}

class PatternsComponent extends React.PureComponent<PatternsProps, PatternsState> {

    render() {
        const {addPattern, removePattern, patterns, updateImage, updateSelection, undo, redo, setWidth, setHeight} = this.props;
        return (
            <>
                {patterns.map(({id, current, config, history, store, selection}) => {
                    return (
                        <Pattern
                            key={id}
                            id={id}
                            config={config}

                            history={history}
                            store={store}
                            selection={selection}
                            imageValue={current ? current.imageData : null}
                            width={current ? current.width : null}
                            height={current ? current.height : null}

                            onUndo={undo}
                            onRedo={redo}
                            onImageChange={updateImage}
                            onSelectionChange={updateSelection}
                            onRemove={removePattern}
                            onSetWidth={setWidth}
                            onSetHeight={setHeight}/>
                    );
                })}
                <Button onClick={() => addPattern({history: true, selection: true})}>add</Button>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<PatternsStateProps, {}, AppState> = state => ({
    patterns: Object.values(state.patterns)
});

const mapDispatchToProps: MapDispatchToProps<PatternsActionProps, PatternsOwnProps> = {
    addPattern, removePattern, updateImage, updateSelection, redo, undo, setWidth, setHeight
};

export const Patterns = connect<PatternsStateProps, PatternsActionProps, PatternsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsComponent);
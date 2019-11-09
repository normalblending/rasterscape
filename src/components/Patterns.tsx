import * as React from "react";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../store";
import {Button} from "./_shared/Button";
import {addPattern, removePattern, updateImage} from "../store/patterns/actions";
import {EPatternType} from "../store/patterns/types";
import {PatternComponentByType} from "./Pattern";

export interface PatternsStateProps {
    patterns: any
}

export interface PatternsActionProps {
    addPattern(type: EPatternType)

    removePattern(id: number)

    updateImage(id: number, imageData: ImageData)
}

export interface PatternsOwnProps {

}

export interface PatternsProps extends PatternsStateProps, PatternsActionProps, PatternsOwnProps {

}

export interface PatternsState {

}

class PatternsComponent extends React.PureComponent<PatternsProps, PatternsState> {

    render() {
        const {addPattern, removePattern, patterns, updateImage} = this.props;
        return (
            <>
                {patterns.map(({id, type, current}) => {
                    const Component = PatternComponentByType[type];
                    return (
                        <Component
                            key={id}
                            id={id}
                            onImageChange={updateImage}
                            onRemove={removePattern}
                            imageValue={current.imageData}
                            width={current.width}
                            height={current.height}/>
                    );
                })}
                <Button onClick={() => addPattern(EPatternType.Simple)}>add</Button>
            </>
        );
    }
}

const mapStateToProps: MapStateToProps<PatternsStateProps, {}, AppState> = state => ({
    patterns: Object.values(state.patterns)
});

const mapDispatchToProps: MapDispatchToProps<PatternsActionProps, PatternsOwnProps> = {
    addPattern, removePattern, updateImage
};

export const Patterns = connect<PatternsStateProps, PatternsActionProps, PatternsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(PatternsComponent);
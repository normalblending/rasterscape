import * as React from "react";
import {Button} from "../_shared/buttons/simple/Button";
import {SelectionValue} from "../../store/patterns/selection/types";
import '../../styles/selectionControls.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";
import {isMeDrawer} from "../../store/patterns/room/helpers";
import {
    createPatternFromSelection,
    cutPatternBySelection,
    updateSelection
} from "../../store/patterns/selection/actions";
import {ButtonHK} from "../_shared/buttons/hotkeyed/ButtonHK";


export interface SelectionControlsStateProps {
    selectionValue: SelectionValue
    isVideoPlaying: boolean
    meDrawer: boolean
}

export interface SelectionControlsActionProps {

    updateSelection: typeof updateSelection
    createPatternFromSelection(id),
    cutPatternBySelection(id),

}

export interface SelectionControlsOwnProps {
    patternId: string

}

export interface SelectionControlsProps extends SelectionControlsStateProps, SelectionControlsActionProps, SelectionControlsOwnProps {

}

export interface SelectionControlsState {

}

export class SelectionControlsComponent extends React.PureComponent<SelectionControlsProps, SelectionControlsState> {

    handleClearSelection = () => {
        const {patternId, updateSelection} = this.props;
        updateSelection(patternId, [], null);
    };
    handleCreatePattern = () => {
        const {patternId, createPatternFromSelection} = this.props;
        createPatternFromSelection(patternId);
    };
    handleCut = () => {
        const {patternId, cutPatternBySelection} = this.props;
        cutPatternBySelection(patternId);
    };

    render() {
        const {selectionValue} = this.props;
        return selectionValue.segments && selectionValue.segments.length ? (
            <div className={'selection-controls'}>
                <ButtonHK
                    onClick={this.handleClearSelection}>clear</ButtonHK>

                <ButtonHK
                    onClick={this.handleCreatePattern}>pattern</ButtonHK>
                <ButtonHK
                    onClick={this.handleCut}>cut</ButtonHK>
            </div>
        ) : null;
    }
}

const mapStateToProps: MapStateToProps<SelectionControlsStateProps, SelectionControlsOwnProps, AppState> = (state, {patternId}) => ({
    selectionValue: state.patterns[patternId]?.selection.value,
    isVideoPlaying: state.patterns[patternId]?.video?.params.on && !state.patterns[patternId]?.video?.params.pause,
    meDrawer: isMeDrawer(state.patterns[patternId].room?.value)
});

const mapDispatchToProps: MapDispatchToProps<SelectionControlsActionProps, SelectionControlsOwnProps> = {
    updateSelection,

    createPatternFromSelection,
    cutPatternBySelection,
};

export const SelectionControls = connect<SelectionControlsStateProps, SelectionControlsActionProps, SelectionControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(SelectionControlsComponent);

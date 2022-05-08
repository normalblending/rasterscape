import * as React from "react";
import {Button} from "../_shared/buttons/simple/Button";
import {Segments, SelectionValue} from "../../store/patterns/selection/types";
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
import {WithTranslation, withTranslation} from "react-i18next";


export interface SelectionControlsStateProps {
    selectionValue: SelectionValue
    isVideoPlaying: boolean
    meDrawer: boolean
}

export interface SelectionControlsActionProps {

    updateSelection: (id: string, value: Segments, bBox: SVGRect) => void
    createPatternFromSelection(id),
    cutPatternBySelection(id),

}

export interface SelectionControlsOwnProps {
    patternId: string

}

export interface SelectionControlsProps extends SelectionControlsStateProps, SelectionControlsActionProps, SelectionControlsOwnProps, WithTranslation {

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
        const {
            selectionValue,
            t,
        } = this.props;

        return selectionValue.segments && selectionValue.segments.length ? (
            <div className={'selection-controls'}>
                <ButtonHK
                    onClick={this.handleClearSelection}>{t('patternSelection.clear')}</ButtonHK>

                <ButtonHK
                    onClick={this.handleCut}>{t('patternSelection.cut')}</ButtonHK>
                <ButtonHK
                    onClick={this.handleCreatePattern}>{t('patternSelection.pattern')}</ButtonHK>
            </div>
        ) : null;
    }
}

const mapStateToProps: MapStateToProps<SelectionControlsStateProps, SelectionControlsOwnProps, AppState> = (state, {patternId}) => ({
    selectionValue: state.patterns[patternId]?.selection.value,
    isVideoPlaying: state.patterns[patternId]?.video?.params.updatingOn,// && !state.patterns[patternId]?.video?.params.pause,
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
)(withTranslation('common')(SelectionControlsComponent));

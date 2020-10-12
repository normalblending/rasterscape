import * as React from "react";
import './maskControls.scss';
import {withTranslation, WithTranslation} from "react-i18next";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../../store";
import {ButtonHK} from "../../_shared/buttons/hotkeyed/ButtonHK";
import {setMaskParams} from "../../../store/patterns/mask/actions";
import {MaskParams} from "../../../store/patterns/mask/types";
import {coordHelper2} from "../../Area/canvasPosition.servise";

export interface MaskControlsStateProps {
    params: MaskParams
}

export interface MaskControlsActionProps {
    setMaskParams(id: string, value: MaskParams)
}

export interface MaskControlsOwnProps {
    patternId: string
}

export interface MaskControlsProps extends MaskControlsStateProps, MaskControlsActionProps, MaskControlsOwnProps, WithTranslation {
}

export interface MaskControlsState {

}

const radiusRange = [0, 100] as [number, number];

export class MaskControlsComponent extends React.PureComponent<MaskControlsProps, MaskControlsState> {


    handleInverseChange = (data) => {
        const {setMaskParams, patternId} = this.props;
        coordHelper2.setText('inv ' + !data.selected);
        setMaskParams(patternId, {
            inverse: !data.selected
        });
    };

    render() {
        const {patternId} = this.props;
        const {inverse} = this.props.params;
        return (
            <div className={'mask-controls'}>
                <ButtonHK
                    selected={inverse}
                    path={`pattern.${patternId}.mask.inverse`}
                    hkLabel={`p${patternId} mask inverse`}
                    onClick={this.handleInverseChange}
                >{inverse ? 'white' : 'black'}</ButtonHK>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<MaskControlsStateProps, MaskControlsOwnProps, AppState> = (state, {patternId}) => ({
    params: state.patterns[patternId]?.mask.params
});

const mapDispatchToProps: MapDispatchToProps<MaskControlsActionProps, MaskControlsOwnProps> = {
    setMaskParams
};

export const MaskControls = connect<MaskControlsStateProps, MaskControlsActionProps, MaskControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(MaskControlsComponent));

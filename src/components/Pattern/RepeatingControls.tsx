import * as React from "react";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {ButtonSelect} from "../_shared/buttons/ButtonSelect";
import {BezierCurveRepeating} from "../_shared/canvases/BezierCurveRepeating";
import {ERepeatingType, RepeatingParams} from "../../store/patterns/repeating/types";
import '../../styles/repeatingControls.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {AppState} from "../../store";
import {setRepeating} from "../../store/patterns/repeating/actions";

export interface RepeatingControlsStateProps {

    repeating: RepeatingParams
}

export interface RepeatingControlsActionProps {
    setRepeating(id: string, repeating: RepeatingParams)

}

export interface RepeatingControlsOwnProps {
    patternId: string
}

export interface RepeatingControlsProps extends RepeatingControlsStateProps, RepeatingControlsActionProps, RepeatingControlsOwnProps, WithTranslation {

}

export interface RepeatingControlsState {

}

const repeatingRange = [1, 10] as [number, number];
const repeatingOutRange = [0, 3] as [number, number];
const repeatingValueD = ValueD.VerticalLinear(9);

export class RepeatingControlsComponent extends React.PureComponent<RepeatingControlsProps, RepeatingControlsState> {

    handleGridParamsChange = ({value, name}) => {
        const {setRepeating, repeating, patternId} = this.props;
        setRepeating(patternId, {
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                [name]: value
            }
        })
    };

    handleBoolParamChange = (data) => {
        const {selected, name} = data;
        const {setRepeating, repeating, patternId} = this.props;
        setRepeating(patternId, {
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                [name]: !selected
            }
        })
    };

    handleBezierChange = (points) => {
        const {setRepeating, repeating, patternId} = this.props;
        setRepeating(patternId, {
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                bezierPoints: points
            }
        })
    };

    render() {
        const {type, gridParams} = this.props.repeating;
        return (
            <div className={'repeating-controls'}>
                {type === ERepeatingType.Grid && (
                    <div className={'repeating-controls-grid'}>
                        <div className={'repeating-controls-grid-buttons'}>
                            <div className={'repeating-controls-grid-buttons-row'}>
                                <ButtonSelect
                                    className={'repeating-button'}
                                    name={"float"}
                                    onClick={this.handleBoolParamChange}
                                    selected={gridParams.float}>{!gridParams.float ? "int" : "float"}</ButtonSelect>
                                <ButtonNumberCF
                                    pres={gridParams.float ? 2 : 1}
                                    range={repeatingRange}
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.x`}
                                    name={"x"}
                                    value={gridParams.x}
                                    onChange={this.handleGridParamsChange}/>
                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.y`}
                                    name={"y"}
                                    value={gridParams.y}
                                    pres={gridParams.float ? 2 : 1}
                                    range={repeatingRange}
                                    onChange={this.handleGridParamsChange}/>

                            </div>

                            <div className={'repeating-controls-grid-buttons-row'}>
                                <ButtonSelect
                                    className={'repeating-button'}
                                    name={"flat"}
                                    onClick={this.handleBoolParamChange}
                                    selected={gridParams.flat}>{gridParams.flat ? "flat" : "flat"}</ButtonSelect>
                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.xOut`}
                                    name={"xOut"}
                                    value={gridParams.xOut}
                                    range={repeatingOutRange}
                                    pres={gridParams.float ? 2 : 1}
                                    onChange={this.handleGridParamsChange}/>
                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.yOut`}
                                    name={"yOut"}
                                    value={gridParams.yOut}
                                    range={repeatingOutRange}
                                    pres={gridParams.float ? 2 : 1}
                                    onChange={this.handleGridParamsChange}/>
                            </div>
                        </div>
                        <BezierCurveRepeating
                            disabled={gridParams.flat}
                            xn={gridParams.x}
                            yn={gridParams.y}
                            value={gridParams.bezierPoints}
                            onChange={this.handleBezierChange}/>
                    </div>)}
            </div>
        );
    }
}


const mapStateToProps: MapStateToProps<RepeatingControlsStateProps, RepeatingControlsOwnProps, AppState> = (state, {patternId}) => ({
    repeating: state.patterns[patternId]?.repeating?.params || null
});

const mapDispatchToProps: MapDispatchToProps<RepeatingControlsActionProps, RepeatingControlsOwnProps> = {
    setRepeating
};

export const RepeatingControls = connect<RepeatingControlsStateProps, RepeatingControlsActionProps, RepeatingControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(RepeatingControlsComponent));
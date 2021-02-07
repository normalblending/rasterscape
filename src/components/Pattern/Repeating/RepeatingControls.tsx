import * as React from "react";
import {ButtonNumberCF} from "../../_shared/buttons/hotkeyed/ButtonNumberCF";
import {ValueD} from "../../_shared/buttons/complex/ButtonNumber";
import {BezierCurveRepeating} from "../../_shared/SVG/BezierCurveRepeating";
import {ERepeatingType, RepeatingGridParams, RepeatingParams} from "../../../store/patterns/repeating/types";
import './repeatingControls.scss';
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {WithTranslation, withTranslation} from "react-i18next";
import {AppState} from "../../../store";
import {setRepeating} from "../../../store/patterns/repeating/actions";
import {ButtonHK} from "../../_shared/buttons/hotkeyed/ButtonHK";

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

    handleGridParamChange = ({value, name}) => {
        const {setRepeating, repeating, patternId} = this.props;
        setRepeating(patternId, {
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                [name]: value
            }
        })
    };

    handleGridParamsChange = (params: Partial<RepeatingGridParams>) => {
        const {setRepeating, repeating, patternId} = this.props;
        console.log( {
        ...repeating.gridParams,
        ...params
        })
        setRepeating(patternId, {
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                ...params
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

        const {patternId, t} = this.props;
        const {type, gridParams} = this.props.repeating;
        return (
            <div className={'repeating-controls'}>
                {type === ERepeatingType.Grid && (
                    <div className={'repeating-controls-grid'}>
                        <div className={'repeating-controls-grid-buttons'}>
                            <div className={'repeating-controls-grid-buttons-row'}>
                                <ButtonHK
                                    path={`pattern.${patternId}.repeating.params.gridParams.float`}
                                    containerClassName={'repeating-button'}
                                    name={"float"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.int'}
                                    hkData1={patternId}
                                    onClick={this.handleBoolParamChange}
                                    selected={gridParams.float}
                                >
                                    {t('pattern.repeating.float')}
                                </ButtonHK>
                                <ButtonNumberCF
                                    pres={gridParams.float ? 2 : 1}
                                    range={repeatingRange}
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.xd`}
                                    name={"xd"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.xd'}
                                    hkData1={patternId}
                                    value={gridParams.xd}
                                    onChange={this.handleGridParamChange}/>
                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.yd`}
                                    name={"yd"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.yd'}
                                    hkData1={patternId}
                                    value={gridParams.yd}
                                    pres={gridParams.float ? 2 : 1}
                                    range={repeatingRange}
                                    onChange={this.handleGridParamChange}/>

                            </div>

                            <div className={'repeating-controls-grid-buttons-row'}>
                                <ButtonHK
                                    path={`pattern.${patternId}.repeating.params.gridParams.flat`}
                                    containerClassName={'repeating-button'}
                                    name={"flat"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.flat'}
                                    hkData1={patternId}
                                    onClick={this.handleBoolParamChange}
                                    selected={gridParams.flat}
                                >
                                    {t('pattern.repeating.flat')}
                                </ButtonHK>
                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.xn0`}
                                    name={"xn0"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.xn0'}
                                    hkData1={patternId}
                                    value={gridParams.xn0}
                                    range={repeatingOutRange}
                                    pres={gridParams.float ? 2 : 1}
                                    onChange={this.handleGridParamChange}/>
                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.yn0`}
                                    name={"yn0"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.yn0'}
                                    hkData1={patternId}
                                    value={gridParams.yn0}
                                    range={repeatingOutRange}
                                    pres={gridParams.float ? 2 : 1}
                                    onChange={this.handleGridParamChange}/>
                            </div>

                            <div className={'repeating-controls-grid-buttons-row'}>

                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.xn1`}
                                    name={"xn1"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.xn1'}
                                    hkData1={patternId}
                                    value={gridParams.xn1}
                                    range={repeatingOutRange}
                                    pres={gridParams.float ? 2 : 1}
                                    onChange={this.handleGridParamChange}/>
                                <ButtonNumberCF
                                    className={'repeating-button-number'}
                                    integer={!gridParams.float}
                                    path={`patterns.${this.props.patternId}.repeating.params.gridParams.yn1`}
                                    name={"yn1"}
                                    hkLabel={'pattern.hotkeysDescription.repeating.yn1'}
                                    hkData1={patternId}
                                    value={gridParams.yn1}
                                    range={repeatingOutRange}
                                    pres={gridParams.float ? 2 : 1}
                                    onChange={this.handleGridParamChange}/>
                            </div>
                        </div>
                        <BezierCurveRepeating
                            disabled={gridParams.flat}
                            xd={gridParams.xd}
                            yd={gridParams.yd}
                            xn0={gridParams.xn0}
                            yn0={gridParams.yn0}
                            xn1={gridParams.xn1}
                            yn1={gridParams.yn1}
                            value={gridParams.bezierPoints}
                            onParamsChange={this.handleGridParamsChange}
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
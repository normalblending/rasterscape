import * as React from "react";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {RotationValue} from "../../store/patterns/rotating/types";
import '../../styles/rotatingControls.scss';
import {withTranslation, WithTranslation} from "react-i18next";
import {setRotation} from "../../store/patterns/rotating/actions";
import {connect, MapDispatchToProps, MapStateToProps} from "react-redux";
import {AppState} from "../../store";

export interface RotationControlsStateProps {
    rotation: RotationValue
}

export interface RotationControlsActionProps {
    setRotation(id: string, value: RotationValue)
}

export interface RotationControlsOwnProps {
    patternId: string
}

export interface RotationControlsProps extends RotationControlsStateProps, RotationControlsActionProps, RotationControlsOwnProps, WithTranslation {
}

export interface RotationControlsState {

}

const angleRange = [0, 360] as [number, number];
const angleText = value => value.toFixed(0) + '°';
const angleValueD = ValueD.VerticalLinear(0.2);

const offsetRange = [-1000, 1000] as [number, number];
const offsetValueD = ValueD.VerticalLinear(0.1);

export class RotationControlsComponent extends React.PureComponent<RotationControlsProps, RotationControlsState> {

    handleAngleChange = ({value: angle}) => {
        const {setRotation, rotation, patternId} = this.props;
        setRotation(patternId, {...rotation, angle})
    };

    handleOffsetChange = ({value, name}) => {
        const {setRotation, rotation, patternId} = this.props;
        setRotation(patternId, {
            ...rotation, offset: {
                ...rotation.offset,
                [name]: value
            }
        })
    };

    render() {
        const {angle, offset} = this.props.rotation;
        return (
            <div className={'rotating-controls'}>
                <ButtonNumberCF
                    pres={0}
                    path={`patterns.${this.props.patternId}.rotation.value.angle`}
                    name={"angle"}
                    value={angle}
                    range={angleRange}
                    getText={angleText}
                    valueD={0.36}
                    onChange={this.handleAngleChange}/>
                <ButtonNumberCF
                    pres={0}
                    valueD={1}
                    range={offsetRange}
                    path={`patterns.${this.props.patternId}.rotation.value.offset.x`}
                    name={"x"}
                    value={offset.x}
                    onChange={this.handleOffsetChange}/>
                <ButtonNumberCF
                    pres={0}
                    valueD={1}
                    range={offsetRange}
                    path={`patterns.${this.props.patternId}.rotation.value.offset.y`}
                    name={"y"}
                    value={offset.y}
                    onChange={this.handleOffsetChange}/>
            </div>
        );
    }
}

const mapStateToProps: MapStateToProps<RotationControlsStateProps, RotationControlsOwnProps, AppState> = (state, {patternId}) => ({
    rotation: state.patterns[patternId]?.rotation?.value
});

const mapDispatchToProps: MapDispatchToProps<RotationControlsActionProps, RotationControlsOwnProps> = {
    setRotation,
};

export const RotationControls = connect<RotationControlsStateProps, RotationControlsActionProps, RotationControlsOwnProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
)(withTranslation('common')(RotationControlsComponent));

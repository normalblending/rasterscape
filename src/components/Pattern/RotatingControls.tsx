import * as React from "react";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {RotationValue} from "../../store/patterns/rotating/types";
import '../../styles/rotatingControls.scss';
import {VideoParams} from "../../store/patterns/video/types";
import {ChangeFunctions} from "../../store/changeFunctions/reducer";
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
const angleValueD = ValueD.VerticalLinear(0.4);

const offsetRange = [-800, 800] as [number, number];
const offsetValueD = ValueD.VerticalLinear(0.6);

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
                    path={`patterns.${this.props.patternId}.rotation.value.angle`}
                    name={"angle"}
                    value={angle}
                    range={angleRange}
                    valueD={angleValueD}
                    onChange={this.handleAngleChange}/>

                <ButtonNumberCF
                    path={`patterns.${this.props.patternId}.rotation.value.offset.x`}
                    name={"x"}
                    value={offset.x}
                    range={offsetRange}
                    valueD={offsetValueD}
                    onChange={this.handleOffsetChange}/>
                <ButtonNumberCF
                    path={`patterns.${this.props.patternId}.rotation.value.offset.y`}
                    name={"y"}
                    value={offset.y}
                    range={offsetRange}
                    valueD={offsetValueD}
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

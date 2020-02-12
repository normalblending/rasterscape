import * as React from "react";
import {ValueD} from "../_shared/buttons/ButtonNumber";
import {ButtonNumberCF} from "../_shared/buttons/ButtonNumberCF";
import {RotationValue} from "../../store/patterns/rotating/types";

export interface RotationControlsProps {
    rotation: RotationValue
    patternId: string

    onChange(rotation: RotationValue)

}

export interface RotationControlsState {

}


const angleRange = [0, 360] as [number, number];
const angleValueD = ValueD.VerticalLinear(0.4);

const offsetRange = [-200, 200] as [number, number];
const offsetValueD = ValueD.VerticalLinear(0.6);

export class RotationControls extends React.PureComponent<RotationControlsProps, RotationControlsState> {

    handleAngleChange = ({value: angle}) => {
        const {onChange, rotation} = this.props;
        onChange({...rotation, angle})
    };

    handleOffsetChange = ({value, name}) => {
        const {onChange, rotation} = this.props;
        onChange({
            ...rotation, offset: {
                ...rotation.offset,
                [name]: value
            }
        })
    };

    render() {
        const {angle, offset} = this.props.rotation;
        return (
            <div>
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
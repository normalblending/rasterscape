import * as React from "react";
import {ERepeatingType, RepeatingParams} from "../../store/patterns/types";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import {ValueD} from "../_shared/ButtonNumber";
import {ButtonSelect} from "../_shared/ButtonSelect";

export interface RepeatingControlsProps {
    repeating: RepeatingParams
    patternId: string

    onChange(repeating: RepeatingParams)

}

export interface RepeatingControlsState {

}

const repeatingRange = [1, 10] as [number, number];
const repeatingValueD = ValueD.VerticalLinear(9);

export class RepeatingControls extends React.PureComponent<RepeatingControlsProps, RepeatingControlsState> {


    handleGridParamsChange = ({value, name}) => {
        const {onChange, repeating} = this.props;
        onChange({
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                [name]: value
            }
        })
    };

    handleIntegerChange = (data) => {
        const {selected, name} = data;
        const {onChange, repeating} = this.props;
        onChange({
            ...repeating,
            gridParams: {
                ...repeating.gridParams,
                [name]: !selected
            }
        })
    };

    render() {
        const {type, gridParams} = this.props.repeating;
        return (
            <div>
                {type === ERepeatingType.Grid && (<>
                    <ButtonSelect
                        name={"integer"}
                        onClick={this.handleIntegerChange}
                        selected={gridParams.integer}>{gridParams.integer ? "int" : "float"}</ButtonSelect>
                    <ButtonNumberCF
                        integer={gridParams.integer}
                        path={`patterns.${this.props.patternId}.repeating.params.gridParams.x`}
                        name={"x"}
                        value={gridParams.x}
                        range={repeatingRange}
                        valueD={repeatingValueD}
                        onChange={this.handleGridParamsChange}/>
                    <ButtonNumberCF
                        integer={gridParams.integer}
                        path={`patterns.${this.props.patternId}.repeating.params.gridParams.y`}
                        name={"y"}
                        value={gridParams.y}
                        range={repeatingRange}
                        valueD={repeatingValueD}
                        onChange={this.handleGridParamsChange}/>
                </>)}
            </div>
        );
    }
}
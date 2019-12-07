import * as React from "react";
import {ERepeatingType, RepeatingParams} from "../../store/patterns/types";
import {ButtonNumberCF} from "../_shared/ButtonNumberCF";
import {ValueD} from "../_shared/ButtonNumber";

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

    render() {
        const {type, gridParams} = this.props.repeating;
        return (
            <div>
                {type === ERepeatingType.Grid && (<>
                    <ButtonNumberCF
                        // integer
                        path={`patterns.${this.props.patternId}.repeating.params.gridParams.x`}
                        name={"x"}
                        value={gridParams.x}
                        range={repeatingRange}
                        valueD={repeatingValueD}
                        onChange={this.handleGridParamsChange}/>
                    <ButtonNumberCF
                        // integer
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